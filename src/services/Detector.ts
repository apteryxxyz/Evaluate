import process from 'node:process';
import { setTimeout } from 'node:timers';
import { ModelOperations } from '@vscode/vscode-languagedetection';
import { container } from 'maclary';
import { Configuration, OpenAIApi } from 'openai';
import { detect as detectUsingRegex } from 'program-language-detector';

/** Handle detecting programming languages. */
export class Detector {
    private _openai?: OpenAIApi;
    private _vscode?: ModelOperations;

    public constructor() {
        (async () => {
            this._vscode = new ModelOperations();
            this._openai = new OpenAIApi(
                new Configuration({
                    basePath: process.env.OPENAI_BASE_PATH,
                    apiKey: process.env.OPENAI_KEY,
                })
            );
        })();
    }

    /** Attempt to identify the programming language of a piece of code. */
    public async detectLanguage(options: Detector.DetectOptions) {
        return options.usePaid
            ? this._paidDetection(options.code)
            : this._freeDetection(options.code);
    }

    private _freeDetection(code: string) {
        return Promise.resolve(
            this._detectUsingRegex(code) ?? //
                this._detectUsingVscode(code)
        );
    }

    private async _paidDetection(code: string) {
        return this._detectUsingOpenai(code)
            .catch(() => undefined)
            .then(result => result ?? this._freeDetection(code));
    }

    private _detectUsingRegex(code: string) {
        const result = detectUsingRegex(code);
        return result === 'Unknown' ? undefined : result;
    }

    private async _detectUsingVscode(code: string) {
        await Detector.waitFor();
        const results = await this._vscode!.runModel(code);
        return results[0]?.languageId || undefined;
    }

    private async _detectUsingOpenai(code: string) {
        await Detector.waitFor();
        return this._openai!.createChatCompletion({
            model: 'gpt-3.5-turbo',
            max_tokens: 100,
            messages: [
                { role: 'system', content: this._createSystemPrompt() },
                { role: 'user', content: code },
            ],
        }).then(({ data }) => {
            const result = data.choices[0].message?.content.toLowerCase();
            if (!result || result.includes('unknown')) return undefined;
            return result;
        });
    }

    private _createSystemPrompt() {
        return `Your job is to detect the programming language of the users codeted code.
You should only ever return the name of the language, all lowercase, no period.
If the programming language is not found, return "unknown".`;
    }

    /** Ensure that the detector has been initialise. */
    public static async waitFor() {
        if (!container.detector) container.detector = new Detector();

        while (!container.detector._openai && !container.detector._vscode)
            await new Promise(resolve => setTimeout(resolve, 100));
        return container.detector;
    }
}

export namespace Detector {
    export interface DetectOptions {
        code: string;
        usePaid?: boolean;
    }
}

declare module 'maclary' {
    interface Container {
        detector: Detector;
    }
}
