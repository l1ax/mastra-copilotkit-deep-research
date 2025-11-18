import { createWorkflow } from '@mastra/core';
import { generateResearchTopic, generateQuery, webSearchAndReflection, clarifyWithUser } from './steps';
import { z } from 'zod';

export const deepResearch = createWorkflow({
    id: 'deepResearch',
    description: 'a workflow to perform deep research based on user input',
    inputSchema: z.object({
        userInput: z.string(),
    }),
    outputSchema: z.object({
        researchTopic: z.string(),
        answer: z.string()
    }),
    // 定义工作流状态，用于存储对话历史
    stateSchema: z.object({
        chatHistory: z.array(z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
        })).describe('对话历史').default([]),
    }),
})
.then(clarifyWithUser)
.then(generateResearchTopic)
.then(generateQuery)
.then(webSearchAndReflection)
.commit();