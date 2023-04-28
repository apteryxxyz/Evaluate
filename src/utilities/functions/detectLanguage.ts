import process from 'node:process';
import { ModelOperations } from '@vscode/vscode-languagedetection';
import { Configuration, OpenAIApi } from 'openai';
import { detect } from 'program-language-detector';

export function detectLanguage(content: string, usePaid = false) {
    return usePaid
        ? premiumLanguageDetection(content)
        : freeLanguageDetection(content);
}

const vscode = new ModelOperations();

async function freeLanguageDetection(
    content: string
): Promise<string | undefined> {
    const regexResult = detect(content);
    const regexDetention = regexResult === 'Unknown' ? undefined : regexResult;
    if (regexDetention) return regexDetention;

    const aiResults = await vscode.runModel(content);
    const aiDetention = aiResults[0]?.languageId;
    if (aiDetention) return aiDetention;

    return undefined;
}

const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.PAWAN_KEY,
        basePath: 'https://api.pawan.krd/v1',
    })
);

async function premiumLanguageDetection(
    content: string
): Promise<string | undefined> {
    return openai
        .createChatCompletion({
            model: 'gpt-3.5-turbo',
            max_tokens: 100,
            messages: [
                { role: 'system', content: createSystemPrompt() },
                { role: 'user', content },
            ],
        })
        .then(({ data }) => {
            const result = data.choices[0].message?.content.toLowerCase();
            if (!result || result.includes('unknown')) return undefined;
            return result;
        })
        .catch(() => {
            return freeLanguageDetection(content);
        });
}

function createSystemPrompt() {
    return `Your job is to detect the programming language of the users contentted code.
    You should only ever return the name of the language, all lowercase, no period.
    If the programming language is not found, return "unknown".`;
}
