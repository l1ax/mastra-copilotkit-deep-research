/**
 * @file 根据用户输入，生成research topic
 */

import { createStep } from '@mastra/core';
import { z } from 'zod';
import {generateResearchTopicPrompt} from '../../../prompt';
import {mastra} from '../../..';

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
        const agent = mastra.getAgent('defaultAgent');
        const response = await agent.generate(
            prompt,
            {
                structuredOutput: {
                    schema: z.object({
                        researchTopic: z.string()
                    }),
                    jsonPromptInjection: true,
                },
            }
        );
        
        const researchTopic = response.object.researchTopic;

        return {
            researchTopic,
        }
    },
});