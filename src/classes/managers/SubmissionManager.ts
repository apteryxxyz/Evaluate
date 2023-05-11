import { Collection } from 'discord.js';
import type { Executor } from '&services/Executor';

export class SubmissionManager {
    public cache = new Collection<
        string,
        { language: Executor.Language; code: string }
    >();

    /** Create a new evaluator and cache it. */
    public create(id: string, language: Executor.Language, code: string) {
        this.cache.set(id, { language, code });
        return { language, code };
    }

    /** Resolve an evaluator from an interaction. */
    public resolve(id: string) {
        return this.cache.get(id);
    }
}
