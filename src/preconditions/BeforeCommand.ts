import type * as Discord from 'discord.js';
import type { Action, Command } from 'maclary';
import { Precondition } from 'maclary';
import * as Database from '&entities/User';

export class BeforeCommand extends Precondition {
    public override async prefixRun(message: Command.Message) {
        return this._sharedRun(message.author);
    }

    public override slashRun = this._interactionRun;
    public override contextMenuRun = this._interactionRun;
    public override actionRun = this._interactionRun;

    private async _interactionRun(
        interaction: Command.AnyInteraction | Action.AnyInteraction
    ) {
        return this._sharedRun(interaction.user);
    }

    private async _sharedRun(discordUser: Discord.User) {
        const userRepository = this.container.database //
            .repository(Database.User);

        return userRepository
            .ensureUser(discordUser.id) //
            .then(ourUser => {
                // Update the command count
                ourUser.commandCount++;

                // Ensure the 'hasPremium' is correct
                if (ourUser.hasPremium && ourUser.premiumEndsAt < new Date())
                    ourUser.hasPremium = false;

                // Save the user
                void userRepository.save(ourUser);
                discordUser.entity = ourUser;

                return this.ok();
            });
    }
}

declare module 'discord.js' {
    export interface User {
        entity: Database.User;
    }
}
