import { TavilySearchResponse } from '@tavily/core';

class TransformSearchResultsToSummariesPrompt {
    format(researchTopic: string, searchResults: TavilySearchResponse[]): string {
        const prompt = `
Based on the research topic "${researchTopic}", the researcher has split the research topic into multiple queries and performed web search for each query. The following are the results:
${searchResults.map((result, index) => (`
    * Query ${index + 1}: ${result.query}
    * Results:
    * ${result.results.map((res, idx) => (`
        * Result ${idx + 1}: 
        * Title: ${res.title}
        * Content: ${res.content}
    `)).join('\n')}
`)).join('\n')}
`
        return prompt;
    }
}

export const transformSearchResultsToSummariesPrompt = new TransformSearchResultsToSummariesPrompt();