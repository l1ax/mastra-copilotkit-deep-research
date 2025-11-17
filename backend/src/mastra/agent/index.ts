import {Agent} from '@mastra/core/agent';
import { Memory } from "@mastra/memory";

import {deepResearch} from '../workflow';

/**
 * Deep Research Agent
 * 
 * 已配置 Memory 支持 thread 和 resource：
 * - generateTitle: true - 自动根据第一条消息生成线程标题
 * 
 * 使用示例：
 * ```typescript
 * import { extractThreadResource } from '../utils';
 * 
 * // 在调用 agent 时传递 thread 和 resource
 * const { thread, resource } = extractThreadResource(req.headers, req.query);
 * 
 * const result = await deepResearchAgent.generate("用户消息", {
 *   memory: {
 *     thread,
 *     resource,
 *   }
 * });
 * 
 * // 或者使用 stream
 * const stream = await deepResearchAgent.stream("用户消息", {
 *   memory: {
 *     thread,
 *     resource,
 *   }
 * });
 * ```
 * 
 * 注意：即使配置了 memory，如果没有提供 thread 和 resource，
 * agent 也不会存储或回忆信息。必须在每次调用时手动提供这些参数。
 */
export const deepResearchAgent = new Agent({
    name: 'deepResearchAgent',
    model: "deepseek/deepseek-chat",
    instructions: "You are a deep research agent, you are responsible for performing deep research based on user input. You MUST use the deepResearch workflow to perform the research and output the raw answer.",
    workflows: {
        deepResearch: deepResearch
    },
    memory: new Memory({
        options: {
            threads: {
                generateTitle: true, // 自动生成线程标题
            }
        },
    })
});