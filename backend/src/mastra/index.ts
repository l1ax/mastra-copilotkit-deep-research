import { Mastra } from "@mastra/core/mastra";
import {deepResearchAgent} from './agent';
import {deepResearch} from './workflow';
import { LibSQLStore } from "@mastra/libsql";

export const mastra = new Mastra({
    agents: {
        deepResearchAgent
    },
    workflows: {
        deepResearch
    },
    storage: new LibSQLStore({
        url: ':memory:'
    })
});