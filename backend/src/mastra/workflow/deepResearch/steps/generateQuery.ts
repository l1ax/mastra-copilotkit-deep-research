/**
 * @file 根据用户输入，生成web search query
 */

import { createStep } from '@mastra/core';
import { z } from 'zod';
import {getCurrentDate} from '../../../utils';
import {generateQueriesPrompt} from '../../../prompt';
import {llm} from '../../../llm';
import OpenAI from 'openai';

export const generateQuery = createStep({
    id: 'generateQuery',
    inputSchema: z.object({
        researchTopic: z.string()
    }),
    outputSchema: z.object({
        queries: z.array(z.string()).describe('web search queries'),
    }),
    execute: async ({ inputData }): Promise<{ queries: string[] }> => {
        const {researchTopic} = inputData;

        const currentDate = getCurrentDate();

        const prompt = generateQueriesPrompt.format(researchTopic, currentDate, 3);

        const response: OpenAI.Chat.Completions.ChatCompletion = await llm.invoke({
            messages: prompt,
            model: 'deepseek-chat',
            response_format: {
                type: 'json_object',
            },
        });

        const queries = JSON.parse(response.choices[0].message.content || '{}').query;

        return {
            queries: queries,
        }
    },
})