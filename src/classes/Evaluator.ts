import { clearTimeout, setTimeout } from 'node:timers';
import type * as Discord from 'discord.js';
import { container } from 'maclary';
import { User } from '&entities/User';
import type { Executor } from '&services/Executor';

export class Evaluator {
    public readonly user: Discord.User;
    public readonly message: Discord.Message;

    private _timeout?: NodeJS.Timeout;
    public readonly startedAt = new Date();
    public updatedAt = new Date();

    public history: Executor.ExecuteResult[] = [];

    public constructor(user: Discord.User, message: Discord.Message) {
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

        void container.database
            .repository(User)
            .appendUsedLanguage(this.user.id, options.language);

        return result;
    }
}
