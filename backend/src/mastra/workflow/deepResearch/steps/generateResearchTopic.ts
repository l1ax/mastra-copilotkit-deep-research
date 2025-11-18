/**
 * @file 根据用户输入，生成research topic
 */

import { createStep } from '@mastra/core';
import { z } from 'zod';
import {generateResearchTopicPrompt} from '../../../prompt';
import {llm} from '../../../llm';

export const generateResearchTopic = createStep({
    id: 'generateResearchTopic',
    inputSchema: z.object({
        userInput: z.string().describe('用户的问题'),
        isNeedToClarify: z.boolean().describe('是否需要用户再次澄清需求'),
    }),
    outputSchema: z.object({
        researchTopic: z.string().describe('research topic'),
    }),
    stateSchema: z.object({
        chatHistory: z.array(z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
        })).describe('对话历史，用于多轮对话'),
    }),
    execute: async ({ inputData }): Promise<{ researchTopic: string }> => {
        const { userInput } = inputData;
        const prompt = generateResearchTopicPrompt.format(userInput);

        const response = await llm.invoke({
            messages: prompt,
            model: 'deepseek-chat',
            response_format: {
                type: 'json_object',
            },
        })
        
        const content = response.choices[0].message.content || '{}';
        const researchTopic = JSON.parse(content).researchTopic;

        return {
            researchTopic,
        }
    },
});