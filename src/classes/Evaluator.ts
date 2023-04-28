import { clearTimeout, setTimeout } from 'node:timers';
import type { Message, User } from 'discord.js';
import { container } from 'maclary';
import { Statistics } from '&entities/Statistics';
import type { Executor } from '&services/Executor';

export class Evaluator {
    public readonly user: User;
    public readonly message: Message;

    private _timeout?: NodeJS.Timeout;
    public readonly startedAt = new Date();
    public updatedAt = new Date();

    public history: Executor.ExecuteResult[] = [];

    public constructor(user: User, message: Message) {
        this.user = user;
        this.message = message;
    }

    /** Reset the timeout timer. */
    public onUpdate() {
        this.updatedAt = new Date();
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {}, 720_000);
    }

    /** Merge the options with new ones. */
    public async runWithOptions(options: Executor.ExecuteOptions) {
        this.onUpdate();

        const result = await container.executor.execute(options);
        this.history.push(result);

        const repo = container.database.get(Statistics);
        void repo.appendLanguage(this.user.id, options.language.id);
        void repo.incrementEvaluatorCount(this.user.id);

        return result;
    }
}
