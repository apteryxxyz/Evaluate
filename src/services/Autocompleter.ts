/* eslint-disable id-length */
import process from 'node:process';
import { setTimeout } from 'node:timers';
import { stripIndent } from 'common-tags';
import { container } from 'maclary';
import { Configuration, OpenAIApi } from 'openai';

/** Handle autocompleting programming code. */
export class Autocompleter {
    private _openai?: OpenAIApi;

    public constructor() {
        (async () => {
            this._openai = new OpenAIApi(
                new Configuration({
                    basePath: process.env.OPENAI_BASE_PATH,
                    apiKey: process.env.OPENAI_KEY,
                })
            );
        })();
    }

    public async autocompleteCode(options: Autocompleter.AutocompleteOptions) {
        return options.usePaid
            ? this._autocompleteUsingOpenai(options)
            : this._autocompleteUsingFind(options);
    }

    private _autocompleteValues = {
        go: [
            'func main() {',
            (code: string) =>
                `package main\nimport "fmt"\nfunc main() {\n  ${code}\n}`,
        ] as const,
        rust: [
            'fn main() {',
            (code: string) => `use std::io;\nfn main() {\n  ${code}\n}`,
        ] as const,
        c: [
            'int main() {',
            (code: string) => `#include <stdio.h>\nint main() {\n  ${code}\n}`,
        ] as const,
        cpp: [
            'int main() {',
            (code: string) =>
                `#include <iostream>\nusing namespace std;\nint main() {\n  ${code}\n}`,
        ] as const,
        csharp: [
            'static void Main(string[] args) {',
            (code: string) =>
                `using System;\nclass Program {\n  static void Main(string[] args) {\n    ${code}\n  }\n}`,
        ] as const,
        java: [
            'public static void main(String[] args) {',
            (code: string) =>
                `public class Main {\n  public static void main(String[] args) {\n    ${code}\n  }\n}`,
        ] as const,
        kotlin: [
            'fun main() {',
            (code: string) => `fun main() {\n  ${code}\n}`,
        ] as const,
    };

    private async _autocompleteUsingFind(
        options: Autocompleter.AutocompleteOptions
    ) {
        if (!(options.language in this._autocompleteValues))
            return options.code;

        const language =
            options.language as keyof typeof this._autocompleteValues;
        const [find, replace] = this._autocompleteValues[language];

        return options.code.includes(find)
            ? options.code
            : replace(options.code.replaceAll('\n', '\n  '));
    }

    // NOTE: This is never used, it is too slow to do on every evaluation
    private async _autocompleteUsingOpenai(
        options: Autocompleter.AutocompleteOptions
    ) {
        return this._openai!.createChatCompletion({
            model: 'gpt-3.5-turbo',
            max_tokens: 100,
            messages: [
                {
                    role: 'system',
                    content: this._createSystemPrompt(options.language),
                },
                { role: 'user', content: options.code },
            ],
        }).then(({ data }) => {
            return data.choices[0].message?.content ?? options.code;
        });
    }

    private _createSystemPrompt(language: string) {
        return stripIndent`As an AI programming assistant, your task is to auto complete the users code.
        This can include importing needed packages, adding necessary main functions, etc. You do not need to fix any errors, only autocomplete the code.
        The result can never be longer than 1000 characters no matter what, and should be valid code.
        If the code is invalid or cannot be autocompleted, you should return the original input.
        You have been asked to assist with code written in ${language}. Use your knowledge and expertise.`;
    }

    /** Ensure that the autocompleter has been initialise. */
    public static async waitFor() {
        if (!container.autocompleter)
            container.autocompleter = new Autocompleter();

        while (!container.autocompleter._openai)
            await new Promise(resolve => setTimeout(resolve, 100));
        return container.autocompleter;
    }
}

export namespace Autocompleter {
    export interface AutocompleteOptions {
        code: string;
        language: string;
        usePaid?: boolean;
    }
}

declare module 'maclary' {
    interface Container {
        autocompleter: Autocompleter;
    }
}
