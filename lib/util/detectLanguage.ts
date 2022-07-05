import { ModelOperations } from '@vscode/vscode-languagedetection';
import { detect } from 'program-language-detector';
import type { Provider } from '@lib/structures/Provider';
const model = new ModelOperations();

/**
 * Detect the programming language of a piece of code
 * @param input The input to detect the language of
 * @param provider The provider to use for resolving name
 */
export async function detectLanguage(input: string, provider: Provider) {
    const aiResults = await model.runModel(input);
    const aiResult = aiResults.at(0)?.languageId;
    // Package program-language-detector is used as a backup
    const regexResult = detect(input);
    if (!aiResult && !regexResult) return undefined;

    let language = await provider.resolveLanguage(aiResult);
    if (!language) language = await provider.resolveLanguage(regexResult);
    if (!language) return undefined;

    return language;
}
