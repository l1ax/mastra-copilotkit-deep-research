import { createWorkflow } from '@mastra/core';
import { generateResearchTopic, generateQuery, webSearch, reflection } from './steps';
import { z } from 'zod';
import {webSearchAndReflection} from './steps/webSearchAndReflection';

export const deepResearch = createWorkflow({
    id: 'deepResearch',
    inputSchema: z.object({
        userInput: z.string(),
    }),
    outputSchema: z.object({
        researchTopic: z.string(),
        answer: z.string()
    })
})
.then(generateResearchTopic)
.then(generateQuery)
.then(webSearchAndReflection)
.commit();