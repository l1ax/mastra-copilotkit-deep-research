import {Agent} from '@mastra/core/agent';

export const defaultAgent = new Agent({
    name: 'defaultAgent',
    model: "deepseek/deepseek-chat",
    instructions: "You are a helpful assistant."
});