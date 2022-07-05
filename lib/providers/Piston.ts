import { PistonClient, PistonExecuteData, PistonExecuteResult } from 'piston-api-client';
import Fuse from 'fuse.js';
import { Language, Options, Provider, Result } from '@lib/structures/Provider';
import { prettierLanguageName, prettierRuntimeName } from '@lib/util/prettyNames';
import { formatLanguageName } from '@lib/util/stringFormatting';
const piston = new PistonClient();

export class Piston extends Provider {
    public id = 'P';
    public name = 'Piston';
    public description = '';
    public link = 'https://github.com/engineer-man/piston';

    private languages: Language[] = [];

    public async initialise(): Promise<this> {
        const runtimes = await piston.runtimes();
        if (!runtimes.success) return this;

        this.languages = runtimes.data
            .map((r) => ({
                id: r.language,
                name: prettierLanguageName(r.language, true),
                aliases: r.aliases,
                version: r.version,
                runtime: r.runtime
                    ? {
                          id: r.runtime,
                          name: prettierRuntimeName(r.runtime, true),
                      }
                    : undefined,
            }))
            .map((l: any) => ({
                ...l,
                pretty: formatLanguageName(l),
            }));
        return this;
    }

    public async ping() {
        const ping = Date.now();
        // @ts-ignore Access private property
        await fetch(`${piston.baseUrl}/runtimes`);
        return Date.now() - ping;
    }

    public languageAutocomplete(query: string) {
        const keys = ['id', 'name', 'aliases', 'runtime.id', 'runtime.name'];
        const opts = { threshold: 0.3, keys };
        const fuse = new Fuse(this.languages, opts);

        const result = fuse.search(query);
        return Promise.resolve(
            result.map((r) => ({
                name: r.item.pretty,
                value: r.item.pretty,
            })),
        );
    }

    public resolveLanguage(resolvable: string) {
        if (!resolvable) return Promise.resolve(undefined);

        const regex = /([A-Z0-9#\-_+. ]+)(?:\(([A-Z0-9#\-_+. ]+)(?:, (.+))?\))?/i;
        let [, name, runtime, version] = resolvable.toLowerCase().match(regex) ?? [];
        if (!name) return Promise.resolve(undefined);
        if (!version) (version = runtime) && (runtime = undefined as any);

        const find = (l: any) =>
            [l.id, l.name, ...l.aliases].map((s) => s.toLowerCase()).includes(name.trim()) &&
            (version ? l.version === version : true);
        const language = this.languages.find(find);
        return Promise.resolve(language);
    }

    public async evaluate(options: Options) {
        const original = Object.freeze({ ...options });
        const language = await this.resolveLanguage(options.language);
        if (!language) return undefined;
        if (language) options.language = language.id;

        const converted = this.convertOptions(options);
        // Pass the version to the piston API here
        const result = await piston.execute(
            Object.assign(converted, { version: language.version }),
        );
        const data = result.success ? result.data : result.error;
        return this.convertResult(original, data);
    }

    private convertOptions(options: Options): PistonExecuteData {
        const { language, code } = options;
        const stdin = options.input ?? '';
        const args = options.args ?? [];
        const files = [{ content: code }];
        return { language, version: '', files, stdin, args };
    }

    private convertResult(options: Options, result: PistonExecuteResult): Result {
        const { language, code, input, args } = options;
        const run = result.run.output ?? '';
        const debug = result.compile?.output ?? '';
        const output = (run + (`${debug}\n\n` || '')).trim();
        return { language, code, input, args, output };
    }

    public static id = 'P';
    public static description = '';
    public static link = 'https://github.com/engineer-man/piston';
}
