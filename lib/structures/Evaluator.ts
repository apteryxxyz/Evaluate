import { addLanguage } from '@lib/util/statisticsTracking';
import type { Message, User } from 'discord.js';
import EventEmitter from 'node:events';
import type { Language, Options, Provider, Result } from './Provider';

export enum Events {
    InvalidLanguage = 'invalidLanguage',
    InputsUpdated = 'codesUpdated',
    ProviderUpdated = 'providerUpdated',
    EvaluationComplete = 'evaluationComplete',
    Unprepared = 'unprepared',
}

export class Evaluator extends EventEmitter {
    public provider!: Provider;
    public readonly startedAt = new Date();

    public user: User;
    public message: Message;

    public language!: Language;
    public code!: string;
    public input = '';
    public args: string[] = [];

    public history: Result[] = [];

    public constructor(user: User, message: Message) {
        super();
        this.user = user;
        this.message = message;
    }

    /**
     * Set a new provider for the evaluator.
     * @param provider The new provider to use
     * @param emit Whether to emit the ProviderUpdated event
     */
    public setProvider(provider: Provider, emit = true): void {
        this.provider = provider;
        if (emit) this.emit(Events.ProviderUpdated, provider);
    }

    /**
     * Set new options for the evaluator.
     * @param options The new options to set
     * @returns
     */
    public async updateInputs(options: Partial<Options>): Promise<boolean | undefined> {
        const language = await this.provider.resolveLanguage(options.language);
        if (!language) return void this.emit(Events.InvalidLanguage, options.language);

        if (language) this.language = language;
        if (options.code) this.code = options.code;
        if (options.input) this.input = options.input;
        if (options.args) this.args = options.args;

        this.emit(Events.InputsUpdated, options);
        return true;
    }

    /**
     * Evaluate the code.
     * @param emit Whether to emit the EvaluationComplete event
     */
    public async evaluate(emit = true): Promise<Result | undefined> {
        if (!this.language || !this.code) return void this.emit(Events.Unprepared);
        const opts = {
            language: this.language.pretty,
            code: this.code,
            input: this.input,
            args: this.args,
        };

        void addLanguage(this.user.id, this.language.pretty);
        const result = await this.provider.evaluate(opts);
        if (!result) return undefined;

        this.history.push(result);
        if (emit) this.emit(Events.EvaluationComplete, result);
        return result;
    }
}
