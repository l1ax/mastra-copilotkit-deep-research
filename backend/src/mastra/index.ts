import { Mastra } from "@mastra/core/mastra";
import {defaultAgent} from './agent';
import {deepResearch} from './workflow';

export const mastra = new Mastra({
    agents: {
        defaultAgent
    },
    workflows: {
        deepResearch
    }
});