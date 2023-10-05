import OpenAI from 'openai';
import * as subscriptionHandler from './subscriptions.js'

let messagesLog = [
  { role: 'system', 
    content: `
      Du är en kundservicemedarbetare hos Grönköpings Nyheter. 
      Du inleder konversationen genom en hälsningsfras och frågar sedan vad du kan hjälpa till med.
      Kunden som kontaktar kundservice heter Magnus (accountID: 12345) och har redan verifierat sin indentitet. 
      Du behöver enbart be om uppgifter för det som kunden önskar ändra.
      Eskalera alltid ärenden som inte kan hanteras med den information du har tillgång till.
      Fråga alltid kunden om vilken kontaktväg som föredras innan du eskalerar ett ärende.
    `
  }
];

const { OPENAI_KEY } = process.env;
const openai = new OpenAI({ apiKey: OPENAI_KEY });

const runPrompt = async (messages, callback) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
    functions: subscriptionHandler.avaibleFunctions,
    function_call: "auto",
    stream: false,
  });
  const responseMessage = response["choices"][0]["message"];
  addMessageToLog(responseMessage);
  if (responseMessage.function_call) {
    callSubscriptionFunction(responseMessage.function_call, callback);
  } else {
    writeToPrompt(responseMessage['content']);
    callback();
  }
}

const callSubscriptionFunction = (fnCall, callback) => {
  const fnName = fnCall.name;
  subscriptionHandler.avaibleFunctions.filter(f => f.name === fnName).forEach((fn) => {
    const fnArgs = JSON.parse(fnCall.arguments);
    const fnResponse = subscriptionHandler[fn.name](...Object.values(fnArgs));
    addMessageToLog({
      "role": "function",
      "name": fnName,
      "content": fnResponse,
    });
    runPrompt(messagesLog, callback);
  })
}

const writeToPrompt = (msg) => console.log(msg);
const addMessageToLog = (msgObj) => messagesLog.push(msgObj);
const start = async (callback) => runPrompt(messagesLog, callback);

const handleIssue = async (issueDescription, callback) => {
  addMessageToLog({ role: 'user', content: issueDescription });
  runPrompt(messagesLog, callback);
}
export { start, handleIssue };