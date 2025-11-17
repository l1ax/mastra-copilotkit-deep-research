import {Agent} from '@mastra/core/agent';
import {deepResearch} from '../workflow';

export const deepResearchAgent = new Agent({
    name: 'deepResearchAgent',
    model: "deepseek/deepseek-chat",
    instructions: "You are a deep research agent, you are responsible for performing deep research based on user input. You MUST use the deepResearch workflow to perform the research and output the raw answer.",
    workflows: {
        deepResearch: deepResearch
    }
});