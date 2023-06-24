import type { Guild as DiscordGuild, User as DiscordUser } from 'discord.js';
import type { Action, Command } from 'maclary';
import { Precondition } from 'maclary';
import { Guild as DatabaseGuild } from '&entities/Guild';
import { User as DatabaseUser } from '&entities/User';

export class BeforeCommand extends Precondition {
    public override async actionRun(action: Action.AnyInteraction) {
        return this._sharedRun(action.user, action.guild ?? undefined);
    }

    public override async contextMenuRun(menu: Command.ContextMenu) {
        return this._sharedRun(menu.user, menu.guild ?? undefined);
    }

    public override async prefixRun(message: Command.Message) {
        return this._sharedRun(message.author, message.guild ?? undefined);
    }

    public override async slashRun(input: Command.ChatInput) {
        return this._sharedRun(input.user, input.guild ?? undefined);
    }

    private async _sharedRun(user: DiscordUser, guild?: DiscordGuild) {
        const database = this.container.database;
        const userRepository = database.repository(DatabaseUser);
        const guildRepository = database.repository(DatabaseGuild);

        const [ourUser, ourGuild] = await Promise.all([
            userRepository.ensure(user),
            guild && guildRepository.ensure(guild),
        ]);

        // Bump the command count
        if (ourUser) ourUser.commandCount++;
        if (ourGuild) ourGuild.commandCount++;

        // Save our entities
        await Promise.all([ourUser.save(), ourGuild?.save()]);

        // Apply the entities to the discord user and guild
        if (user) user.entity = ourUser;
        if (guild && ourGuild) guild.entity = ourGuild;

        return this.ok();
    }
}

declare module 'discord.js' {
    export interface User {
        /** Database entity for this user, only exists if used after `BeforeCommand` precondition has run. */
        entity?: DatabaseUser;
    }

    export interface Guild {
        /** Database entity for this guild, only exists if used after `BeforeCommand` precondition has run. */
        entity?: DatabaseGuild;
    }
}
