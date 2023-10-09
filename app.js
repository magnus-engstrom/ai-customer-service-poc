import * as agent from './agent.js';
import pkg from 'prompt';
const prompt = pkg;
prompt.start();

const getUserInput = async (desc) => {
  const { input } = await prompt.get({ 
    properties: { 
      input: { description: desc } 
    } 
  });
  console.log('');
  agent.handleIssue(input, getUserInput);
}

agent.start(getUserInput);