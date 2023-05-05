import { setInterval, setTimeout } from 'node:timers';
import Fuse from 'fuse.js';
import { Lexer, Parser, longShortStrategy } from 'lexure';
import { container } from 'maclary';
import type { PistonExecuteData, PistonExecuteResult } from 'piston-api-client';
import { PistonClient } from 'piston-api-client';
import { Database } from './Database';
import { User } from '&entities/User';
import { formatLanguageName, formatRuntimeName } from '&functions/formatNames';

/** Handle language fetching and code executing. */
export class Executor {
    private _client = new PistonClient();

    private _preferredRuntimes = new Map([['javascript', 'node']]);
    private _popularLanguages: Executor.Language[] = [];

    public constructor() {
        (async () => {
            await this._updatePopularLanguages();
            setInterval(() => this._updatePopularLanguages(), 60_000);
        })();
    }

    private async _updatePopularLanguages() {
        const database = await Database.waitFor();

        const languageIds = await database
            .repository(User)
            .getMostUsedLanguages();
        const _mapper = (id: string) => this.findLanguage(id);
        const languages = await Promise.all(languageIds.map(_mapper));
        this._popularLanguages = languages.filter(
            lang => lang !== undefined
        ) as Executor.Language[];
    }

    /** Fetch a list of all available languages. */
    public async fetchLanguages(): Promise<Executor.Language[]> {
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

    /** Search the list of languages for a query, returns a list. */
    public async searchLanguages(query: string) {
        if (query.length === 0) return Array.from(this._popularLanguages);

        const keys = ['id', 'name', 'aliases', 'runtime.id', 'runtime.name'];
        const languages = await this.fetchLanguages();
        const fuse = new Fuse(languages, { keys, threshold: 0.3 });
        return fuse.search(query).map(({ item }) => item);
    }

    /** Attempt to find a language using a resolvable. */
    public async findLanguage(resolvable: string) {
        if (resolvable === '') return undefined;
        const languages = await this.fetchLanguages();

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

            // By default "javascript" would return Deno, but we prefer Node
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

    /** Execute a piece of code. */
    public async execute(options: Executor.ExecuteOptions) {
        const data = this._convertOptions(options);
        const result = await this._client.execute(data);
        return this._convertResult(
            options,
            result.success ? result.data : result.error
        );
    }

    private _convertOptions(
        options: Executor.ExecuteOptions
    ): PistonExecuteData {
        return {
            language: options.language.id.split('-')[0],
            version: options.language.version,
            files: [{ content: options.code }],
            stdin: options.input,
            args: this._parseArgs(options.args),
        };
    }

    private _convertResult(
        options: Executor.ExecuteOptions,
        result: PistonExecuteResult
    ): Executor.ExecuteResult {
        const output = result.run.output ?? '';
        return { ...options, isSuccess: result.run.code === 0, output };
    }

    private _parseArgs(args: string) {
        const tokens = new Lexer(args)
            .setQuotes([
                ['"', '"'],
                ['“', '”'],
            ])
            .lex();

        return new Parser(tokens)
            .setUnorderedStrategy(longShortStrategy())
            .parse()
            .ordered.map(token => token.value);
    }

    /** Ensure that the executor has been initialise. */
    public static async waitFor() {
        if (!container.executor) container.executor = new Executor();

        while (!container.executor._client)
            await new Promise(resolve => setTimeout(resolve, 100));
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
        args: string;
    }

    export interface ExecuteResult extends ExecuteOptions {
        isSuccess: boolean;
        output: string;
    }
}

declare module 'maclary' {
    interface Container {
        executor: Executor;
    }
}
