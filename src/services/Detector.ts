import process from 'node:process';
import { setTimeout } from 'node:timers';
import { ModelOperations } from '@vscode/vscode-languagedetection';
import { stripIndent } from 'common-tags';
import flourite from 'flourite';
import { container } from 'maclary';
import { Configuration, OpenAIApi } from 'openai';
import { formatLanguageName } from '&functions/formatNames';

/** Handle detecting programming languages. */
export class Detector {
    private _openai?: OpenAIApi;
    private _vscode?: ModelOperations;

    public constructor() {
        (async () => {
            this._vscode = new ModelOperations({
                minContentSize: 0,
            });

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
        const result = await (options.usePaid
            ? this._paidDetection(options)
            : this._freeDetection(options));
        return result ? formatLanguageName(result) : undefined;
    }

    private _freeDetection(options: Detector.DetectOptions) {
        return Promise.resolve(
            this._detectUsingRegex(options) ??
                options.language ??
                this._detectUsingVscode(options)
        );
    }

    private async _paidDetection(options: Detector.DetectOptions) {
        return this._detectUsingOpenai(options)
            .catch(() => undefined)
            .then(result => result ?? this._freeDetection(options));
    }

    private _detectUsingRegex(options: Detector.DetectOptions) {
        const result = flourite(options.code).language;
        return result === 'Unknown' ? undefined : result;
    }

    private async _detectUsingVscode(options: Detector.DetectOptions) {
        await Detector.waitFor();
        const results = await this._vscode!.runModel(options.code);
        return results[0]?.languageId || undefined;
    }

    private async _detectUsingOpenai(options: Detector.DetectOptions) {
        await Detector.waitFor();
        return this._openai!.createChatCompletion({
            model: 'gpt-3.5-turbo',
            max_tokens: 100,
            messages: [
                { role: 'system', content: this._createSystemPrompt() },
                { role: 'user', content: options.code },
            ],
        }).then(({ data }) => {
            const result = data.choices[0].message?.content;
            if (!result || result.toLowerCase().includes('unknown'))
                return undefined;
            return result;
        });
    }

    private _createSystemPrompt() {
        return stripIndent`As a programming language detection AI, your task is to determine the programming language of the user's code.
        This involves analyzing the code to identify its syntax and patterns.
        Your output should only include the name of the detected language, formatted and capitalized properly, without a period.
        If the programming language cannot be identified, return "Unknown" as the result.
        Your task is crucial in helping users identify the language in which their code is written.
        Use your advanced machine learning algorithms and natural language processing capabilities to accurately detect the language used in the code.`;
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
        language?: string;
        usePaid?: boolean;
    }
}

declare module 'maclary' {
    interface Container {
        detector: Detector;
    }
}
