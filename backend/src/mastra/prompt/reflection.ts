import OpenAI from 'openai';

class ReflectionInstructions {
    format(
        researchTopic: string,
        summaries: string,
        maxResearchLoopCount: number,
        researchLoopCount: number
    ): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
        const prompt = `
You are an expert research assistant analyzing summaries about "${researchTopic}".
You have already performed ${researchLoopCount} research loops.
You can perform at most ${maxResearchLoopCount} research loops.

Instructions:
- Identify knowledge gaps or areas that need deeper exploration and generate a follow-up query. (1 or multiple).
- If provided summaries are sufficient to answer the user's question, set "isSufficient" to true, omit follow-up queries, and provide an answer grounded in the summaries.
- If there is a knowledge gap and you can still perform more loops, set "isSufficient" to false, supply at least one follow-up query, and leave the "answer" as an empty string "".
- Focus on technical details, implementation specifics, or emerging trends that weren't fully covered.
- If the researchLoopCount: ${researchLoopCount} reaches maxResearchLoopCount: ${maxResearchLoopCount}, you must set "isSufficient" to true, provide your best possible answer based on the summaries, and leave "followUpQueries" empty regardless of remaining gaps.

Requirements:
- Ensure the follow-up query is self-contained and includes necessary context for web search.
- Ensure the answer is accurate, concise, and explicitly references the provided summaries (e.g., mention which finding, statistic, or source in the summaries supports each key point).

Output Format:
- Format your response as a JSON object with these exact keys:
   - "isSufficient": true or false
   - 'answer': The answer to the research topic
   - "knowledgeGap": Describe what information is missing or needs clarification
   - "followUpQueries": Write a specific question to address this gap


Example:
\`\`\`json
{{
    "isSufficient": true, // or false
    "answer": "The answer to the research topic referencing specific summary insights", // must never be empty when researchLoopCount reaches maxResearchLoopCount
    "knowledgeGap": "The summary lacks information about performance metrics and benchmarks", // "" if isSufficient is true
    "followUpQueries": ["What are typical performance benchmarks and metrics used to evaluate [specific technology]?"] // [] if isSufficient is true
}}
\`\`\`

Reflect carefully on the Summaries to identify knowledge gaps and produce a follow-up query. Then, produce your output following this JSON format:
Summaries:
${summaries}
`;
        return [
            {
                role: 'user',
                content: prompt,
            },
        ];
    }
}

export const reflectionInstructions = new ReflectionInstructions();