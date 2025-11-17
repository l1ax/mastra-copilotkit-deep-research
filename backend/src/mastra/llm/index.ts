import { OpenAI } from 'openai';

class LLM {
    openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({
            apiKey,
            baseURL: 'https://api.deepseek.com',
        });
    }

    async invoke(params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming): Promise<OpenAI.Chat.Completions.ChatCompletion> {
        return this.openai.chat.completions.create(params);
    }
}

export const llm = new LLM(process.env.DEEPSEEK_API_KEY!);