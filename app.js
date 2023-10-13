import * as agent from './agent.js';
import pkg from 'prompt';
const prompt = pkg;
prompt.start();

const getUserInput = async (callback) => {
  console.log("\x1b[0m","");
  const { input } = await prompt.get({ properties: { input: {} } });
  callback(input);
};

const dispayAgentOutput = async (msg) => {
  console.log("\x1b[33m", msg);
};

agent.init(dispayAgentOutput, getUserInput);