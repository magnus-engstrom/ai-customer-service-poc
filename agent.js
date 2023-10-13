import OpenAI from 'openai';
import * as agentFunctions from './agent-functions.js'
import * as Observer from './observer.js'

const { OPENAI_KEY } = process.env;
const openai = new OpenAI({ apiKey: OPENAI_KEY });

let messagesLog = [
  { role: 'system', 
    content: `
      Du är en kundservicemedarbetare hos Bonnier News. 
      Du inleder konversationen genom en hälsningsfras och frågar sedan vad du kan hjälpa till med.
      Kunden som kontaktar kundservice har accountID 12345 och har redan verifierat sin indentitet. 
      Du behöver enbart be om uppgifter för det som kunden önskar ändra.
      Eskalera alltid ärenden som inte kan hanteras med den information du har tillgång till.
      Fråga alltid kunden om vilken kontaktväg som föredras innan du eskalerar ett ärende.
      Verifiera alltid kundens kontaktuppgifter innan du lägger ett ärende och innan du ändrar en kontaktuppgift.
      Hälsa kunden med kundens förnamn i starten av konversationen. Slå upp namnet genom att använda getCustomerData().
    `
  },
  { role: 'system', 
    content: `
      Hälsa kunden med kundens förnamn i starten av konversationen. Slå upp namnet genom att använda getCustomerData().
    `
  }
];

let giveOutput = undefined;
let requireInput = undefined;

const runPrompt = async () => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messagesLog,
    functions: agentFunctions.schema,
    function_call: 'auto',
    stream: false,
  });
  const responseMessage = response["choices"][0]["message"];
  addMessageToLog(responseMessage);
  if (responseMessage.function_call) {
    callSubscriptionFunction(responseMessage.function_call);
    runPrompt();
  } else {
    giveOutput(responseMessage['content']);
    const shouldContinue = await Observer.assertQuality(messagesLog);
    if (!shouldContinue) return;
    requireInput((userMsg) => {
      addMessageToLog({ role: 'user', content: userMsg });
      runPrompt();
    });
  }
}

const callSubscriptionFunction = (fnCall) => {
  const fnName = fnCall.name;
  agentFunctions.schema.filter(f => f.name === fnName).forEach((fn) => {
    const fnArgs = JSON.parse(fnCall.arguments);
    const fnResponse = agentFunctions[fn.name](...Object.values(fnArgs));
    addMessageToLog({
      "role": "function",
      "name": fnName,
      "content": fnResponse,
    });
  })
}

const addMessageToLog = (msgObj) => messagesLog.push(msgObj);
const init = async (outputFunc, inputFucn) => {
  giveOutput = outputFunc;
  requireInput = inputFucn;
  runPrompt(outputFunc, inputFucn);
}
export { init };