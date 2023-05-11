import { clearTimeout, setTimeout } from 'node:timers';
import type * as Discord from 'discord.js';
import { container } from 'maclary';
import { Guild as DatabaseGuild } from '&entities/Guild';
import { User as DatabaseUser } from '&entities/User';
import type { Executor } from '&services/Executor';

export class Evaluator {
    public readonly user: Discord.User;
    public readonly message: Discord.Message;
    public history: Executor.ExecuteResult[] = [];

    private _timeout?: NodeJS.Timeout;
    public readonly startedAt = new Date();
    public updatedAt = new Date();

    public constructor(
        user: Discord.User,
        message: Discord.Message,
        _options: Evaluator.Options = {}
    ) {
        this.user = user;
        this.message = message;
    }

    /** Reset the timeout timer. */
    public onUpdate() {
        this.updatedAt = new Date();
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => this.destroy(), 720_000);
    }

    /** Merge the options with new ones. */
    public async runWithOptions(options: Executor.ExecuteOptions) {
        this.onUpdate();

        const code = await container.autocompleter.autocompleteCode({
            code: options.code,
            language: options.language.id,
            usePaid: false,
        });

        const result = await container.executor.execute({ ...options, code });
        this.history.push(result);
        void this._bumpStatistics(options.language.key);

        return result;
    }

    private async _bumpStatistics(langaugeKey: string) {
        const database = container.database;
        const userRepository = database.repository(DatabaseUser);
        const guildRepository = database.repository(DatabaseGuild);

        const [ourUser, ourGuild] = await Promise.all([
            userRepository.ensure(this.user),
            (this.message.guildId &&
                guildRepository.ensure(this.message.guildId)) ||
                undefined,
        ]);

        // Bump the evaluation count
        if (ourUser) ourUser.evaluationCount++;
        if (ourGuild) ourGuild.evaluationCount++;

        // Append the used language
        if (ourUser) ourUser.usedLanguages.push(langaugeKey);
        if (ourGuild) ourGuild.usedLanguages.push(langaugeKey);

        // Save our entities
        await Promise.all([ourUser.save(), ourGuild?.save()]);

        // Apply the entities to the discord user and guild
        if (this.user) this.user.entity = ourUser;
        if (this.message.guild && ourGuild)
            this.message.guild.entity = ourGuild;
    }

    /** Render a capture for the current code. */
    public async capture() {
        this.onUpdate();

        return container.renderer.createRender(
            this.history.at(-1)!,
            this.user.id,
            this.message.guildId ?? undefined
        );
    }

    /** Destroy this evaluator. */
    public async destroy(deleteMessage: boolean = false) {
        clearTimeout(this._timeout);

        if (deleteMessage) await this.message.delete();
        else await this.message.edit({ components: [] });

        container.evaluators.cache.delete(this.message.id);
    }
}

export namespace Evaluator {
    export interface Options {}
}
