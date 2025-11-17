import { Mastra } from "@mastra/core/mastra";
import {deepResearchAgent} from './agent';
import {deepResearch} from './workflow';

export const mastra = new Mastra({
    agents: {
        deepResearchAgent
    },
    workflows: {
        deepResearch
    }
});