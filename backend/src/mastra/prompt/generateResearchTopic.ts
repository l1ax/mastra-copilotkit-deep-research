import OpenAI from 'openai';

class GenerateResearchTopicPrompt {
    format(userInput: string): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
        const prompt = `
            Your goal is to generate a research topic based on the user's input.

            Instructions:
            - The research topic should be a single sentence that captures the main idea of the user's input.
            - The research topic should be concise and to the point.
            - The research topic should be in the language of the user's input.
            - The research topic should be no longer than 100 characters.

            Format: 
            - Format your response as a JSON object with the following keys:
                - researchTopic: The research topic.

            Example:
            {
                "researchTopic": "The impact of climate change on the ocean"
            }

            Context:
            - User input: ${userInput}
        `;

        return [
            {
                role: 'user',
                content: prompt,
            },
        ];
    }
}

export const generateResearchTopicPrompt = new GenerateResearchTopicPrompt();