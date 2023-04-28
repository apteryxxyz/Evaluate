import { setTimeout } from 'node:timers';
import Fuse from 'fuse.js';
import { container } from 'maclary';
import type { PistonExecuteData, PistonExecuteResult } from 'piston-api-client';
import { PistonClient } from 'piston-api-client';
import { detectLanguage } from '&functions/detectLanguage';
import { formatLanguageName, formatRuntimeName } from '&functions/formatNames';

export class Executor {
    private _client = new PistonClient();

    private _preferredRuntimes = new Map([['javascript', 'node']]);

    public async getLanguages() {
        const response = await this._client.runtimes();
        if (!response.success) throw new Error('Failed to fetch runtimes');

        return response.data.map(({ runtime, ...data }) => ({
            id: data.language,
            key: `${data.language}${runtime ? `-${runtime}` : ''}`,
            name:
                formatLanguageName(data.language) +
                (runtime ? ` (${formatRuntimeName(runtime)})` : ''),
            aliases: data.aliases,
            version: data.version,
            runtime: runtime
                ? {
                      id: runtime,
                      name: formatRuntimeName(runtime),
                  }
                : undefined,
        }));
    }

    public async autocompleteLanguage(query: string) {
        const keys = ['id', 'name', 'aliases', 'runtime.id', 'runtime.name'];
        const languages = await this.getLanguages();
        const fuse = new Fuse(languages, { keys, threshold: 0.3 });
        return fuse.search(query).map(({ item }) => item);
    }

    public async execute(options: Executor.ExecuteOptions) {
        const data = this._convertOptions(options);
        const result = await this._client.execute(data);
        return this._convertResult(
            options,
            result.success ? result.data : result.error
        );
    }

    public async detectLanguage(input: string, usePaid = false) {
        const result = await detectLanguage(input, usePaid);
        return result ? this.resolveLanguage(result) : undefined;
    }

    public async resolveLanguage(resolvable: string) {
        const languages = await this.getLanguages();

        resolvable = resolvable.toLowerCase();
        const existing = languages.find(lang => {
            const found = [
                lang.id,
                lang.key,
                lang.name,
                ...lang.aliases,
            ].includes(resolvable);
            if (
                !lang.runtime ||
                resolvable !== lang.id ||
                !this._preferredRuntimes.has(lang.id)
            )
                return found;
            const runtime = this._preferredRuntimes.get(lang.id);
            return found && runtime === lang.runtime.id;
        });
        if (existing) return existing;

        // Regex that matches "{name} ({runtime})" where the runtime is optional
        const extractor = /([\w #+.-]+)(?:\(([\w #+.-]+)\))?/i;
        const [, name, runtime] = extractor.exec(resolvable) ?? [];

        return languages.find(lang => {
            const names = [lang.id, lang.key, lang.name, ...lang.aliases];
            const isName = names.some(
                value => value.toLowerCase() === name.trim()
            );
            if (!lang.runtime) return isName;

            const runtimes = [lang.runtime.id, lang.runtime.name];
            return (
                isName &&
                runtimes.some(value => value.toLowerCase() === runtime.trim())
            );
        });
    }

    private _convertOptions(
        options: Executor.ExecuteOptions
    ): PistonExecuteData {
        return {
            language: options.language.id.split('-')[0],
            version: options.language.version,
            files: [{ content: options.code }],
            stdin: options.input,
            args: options.args,
        };
    }

    private _convertResult(
        options: Executor.ExecuteOptions,
        result: PistonExecuteResult
    ): Executor.ExecuteResult {
        const output = result.run.output ?? '';
        return { ...options, isSuccess: result.run.code === 0, output };
    }

    public static async waitFor() {
        if (!container.executor) container.executor = new Executor();

        while (!container.executor._client) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return container.executor;
    }
}

export namespace Executor {
    export interface Language {
        id: string;
        key: string;
        name: string;
        aliases: string[];
        version: string;
        runtime?: Language.Runtime;
    }

    export namespace Language {
        export interface Runtime {
            id: string;
            name: string;
        }
    }

    export interface ExecuteOptions {
        language: Language;
        code: string;
        input: string;
        args: string[];
    }

    export interface ExecuteResult extends ExecuteOptions {
        isSuccess: boolean;
        output: string;
    }
}
