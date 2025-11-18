/**
 * @file 根据用户输入，判断是否需要用户再次澄清需求
 * 支持多轮 human feedback，直到 LLM 认为信息足够
 */

import { createStep } from '@mastra/core';
import { z } from 'zod';
import { clarifyWithUserPrompt } from '../../../prompt';
import { llm } from '../../../llm';
import {getCurrentDate} from '../../../utils';

interface ClarificationResponse {
    needClarification: boolean;
    question: string;
    verification: string;
}

export const clarifyWithUser = createStep({
    id: 'clarifyWithUser',
    inputSchema: z.object({
        userInput: z.string(),
    }),
    outputSchema: z.object({
        userInput: z.string()
    }),
    stateSchema: z.object({
        chatHistory: z.array(z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
        })).describe('对话历史，用于多轮对话'),
    }),
    resumeSchema: z.object({
        userResponse: z.string().describe('用户的回复信息'),
    }),
    execute: async ({ inputData, resumeData, suspend, state, setState }) => {
        // 从工作流状态中获取对话历史（如果不存在则初始化为空数组）
        const chatHistory = state.chatHistory || [];
        
        // 判断是首次执行还是 resume
        const isFirstExecution = !resumeData;
        
        // 添加用户消息到历史
        // 首次执行：使用 inputData.userInput
        // Resume：使用 resumeData.userResponse（用户的反馈）
        chatHistory.push({
            role: 'user',
            content: isFirstExecution ? inputData.userInput : resumeData.userResponse,
        });
        
        // 更新工作流状态
        setState({ chatHistory });
        
        const prompt = clarifyWithUserPrompt.format({
            chatHistory,
            date: getCurrentDate(),
        });

        const response = await llm.invoke({
            messages: prompt,
            model: 'deepseek-chat',
            response_format: {
                type: 'json_object',
            },
        });

        const content = response.choices[0].message.content || '{}';
        const clarificationResult: ClarificationResponse = JSON.parse(content);

        // 如果信息不足，suspend 并返回澄清问题
        if (clarificationResult.needClarification) {
            // 添加助手的澄清问题到历史
            chatHistory.push({
                role: 'assistant',
                content: clarificationResult.question,
            });
            
            // 更新工作流状态（包含助手的回复）
            setState({ chatHistory });

            return suspend({
                clarificationQuestion: clarificationResult.question,
                verification: clarificationResult.verification,
            });
        }

        // 信息足够，继续执行
        // 合并所有用户输入作为最终输出
        const finalUserInput = chatHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content)
            .join('\n\n');

        return {
            userInput: finalUserInput,
        };
    },
});
