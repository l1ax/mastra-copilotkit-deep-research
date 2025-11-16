import { OpenAI } from 'openai';

class LLM {
    openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.DEEPSEEK_API_KEY,
            baseURL: 'https://api.deepseek.com',
        });
    }

    async invoke(params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming): Promise<OpenAI.Chat.Completions.ChatCompletion> {
        return this.openai.chat.completions.create(params);
    }
}

export const llm = new LLM();