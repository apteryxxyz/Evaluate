import { Collection } from 'discord.js';
import { Action } from 'maclary';
import { Help } from '&builders/help';

export class HelpAction extends Action {
    public constructor() {
        super({ id: 'help' });
    }

    public override async onButton(click: Action.Button) {
        const [, action] = click.customId.split(',');

        if (action === 'commands') {
            const globalCommands =
                this.container.client.application.commands.cache;
            const guildCommands =
                click.guild?.commands.cache ?? new Collection();
            const commands = //
                Array.from(globalCommands.concat(guildCommands).values());

            return click.reply({
                embeds: [new Help.CommandsEmbed(commands)],
            });
        }

        return void 0;
    }
}
