import { Base } from 'maclary';

export interface Options {
    language: string;
    code: string;
    input: string;
    args: string[];
}

export interface Result {
    language: string;
    code: string;
    input: string;
    args: string[];
    output: string;
}

export interface Language {
    id: string;
    name: string;
    version: string;
    aliases: string[];
    runtime?: {
        id: string;
        name: string;
    };
    pretty: string;
}

export abstract class Provider extends Base {
    /** The ID of the provider */
    public abstract id: string;
    /** The name of the provider */
    public abstract name: string;
    /** The description of the provider */
    public abstract description: string;
    /** The link to more information */
    public abstract link: string;
    /** Array of supported languages */
    public abstract languages: Language[];

    /**
     * Initialise the provider.
     */
    public abstract initialise(): Promise<this>;

    /**
     * Ping this provider.
     */
    public abstract ping(): Promise<number>;

    /**
     * Automatically complete a language name.
     * @param query The query to autocomplete
     */
    public abstract languageAutocomplete(query: string): Promise<{ name: string; value: string }[]>;

    /**
     * Resolve a language name to a language ID.
     * @param resolvable The language name or alias to resolve
     * @param readableName Whether to return the readable name or the ID
     */
    public abstract resolveLanguage(resolvable: any): Promise<Language | undefined>;

    /**
     * Evaluate a code snippet.
     * @param options The options to evaluate
     */
    public abstract evaluate(options: Options): Promise<Result | undefined>;
}
