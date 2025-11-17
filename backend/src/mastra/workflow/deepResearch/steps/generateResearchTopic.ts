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
    }),
    outputSchema: z.object({
        researchTopic: z.string().describe('research topic'),
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