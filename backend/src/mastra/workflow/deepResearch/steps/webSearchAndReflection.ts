/**
 * @file 根据用户输入，生成web search query，并根据web search结果，进行reflection，判断继续搜索or完成research
 */

import { createStep } from '@mastra/core';
import { z } from 'zod';
import { reflectionInstructions, transformSearchResultsToSummariesPrompt } from '../../../prompt';
import { llm } from '../../../llm';
import { tavily, TavilySearchResponse } from '@tavily/core';

interface ReflectionResponse {
    /** 是否已经足够完成research */
    isSufficient: boolean;
    /** 回答 */
    answer: string;
    /** 知识缺口 */
    knowledgeGap: string;
    /** 后续查询 */
    followUpQueries: string[];
}

const MAX_RESEARCH_LOOP_COUNT = 2;

/**
 * 执行搜索查询
 */
async function performSearch(
    tvlyClient: ReturnType<typeof tavily>,
    queries: string[]
): Promise<TavilySearchResponse[]> {
    return Promise.all(
        queries.map((query) => tvlyClient.search(query))
    );
}

/**
 * 执行reflection，判断是否需要继续搜索
 */
async function performReflection(
    researchTopic: string,
    summaries: string,
    researchLoopCount: number
): Promise<ReflectionResponse> {
    const isLastLoop = researchLoopCount === MAX_RESEARCH_LOOP_COUNT;
    const model = isLastLoop ? 'deepseek-reasoner' : 'deepseek-chat';
    
    const reflectionPrompt = reflectionInstructions.format(
        researchTopic,
        summaries,
        MAX_RESEARCH_LOOP_COUNT,
        researchLoopCount
    );

    const response = await llm.invoke({
        messages: reflectionPrompt,
        model,
        response_format: {
            type: 'json_object',
        },
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content) as ReflectionResponse;
}

export const webSearchAndReflection = createStep({
    id: 'webSearchAndReflection',
    inputSchema: z.object({
        queries: z.array(z.string()),
        researchTopic: z.string(),
    }),
    outputSchema: z.object({
        answer: z.string()
    }),
    stateSchema: z.object({
        chatHistory: z.array(z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
        })).describe('对话历史，用于多轮对话'),
    }),
    execute: async ({ inputData }) => {
        const { queries, researchTopic } = inputData;

        const tvlyClient = tavily({
            apiKey: process.env.TAVILY_API_KEY,
        });

        // 初始搜索
        let searchResults: TavilySearchResponse[] = await performSearch(tvlyClient, queries);
        let researchLoopCount = 0;
        let reflectionResponse: ReflectionResponse;

        // 执行reflection循环
        do {
            const summaries = transformSearchResultsToSummariesPrompt.format(researchTopic, searchResults);
            reflectionResponse = await performReflection(researchTopic, summaries, researchLoopCount);
            
            researchLoopCount++;

            // 如果不够充分且还有循环次数，继续搜索
            if (!reflectionResponse.isSufficient && researchLoopCount <= MAX_RESEARCH_LOOP_COUNT) {
                const followUpSearchResults = await performSearch(tvlyClient, reflectionResponse.followUpQueries);
                searchResults = [...searchResults, ...followUpSearchResults];
            }
        } while (!reflectionResponse.isSufficient && researchLoopCount <= MAX_RESEARCH_LOOP_COUNT);

        return {
            answer: reflectionResponse.answer,
            researchTopic: researchTopic,
        };
    },
});
