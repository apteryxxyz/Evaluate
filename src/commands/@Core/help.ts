import { Collection } from 'discord.js';
import { Command } from 'maclary';
import { Help } from '&builders/help';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class HelpCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'help',
            description:
                'View a list of commands and useful links for Evaluate.',

            preconditions: [BeforeCommand],
            options: [
                {
                    name: 'section',
                    description: 'The section of the help menu to view.',
                    type: Command.OptionType.String,
                    choices: [
                        { name: 'Commands', value: 'commands' },
                        { name: 'Premium', value: 'premium' },
                    ],
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const section = input.options.getString('section');

        if (section === 'commands') {
            const globalCommands =
                this.container.client.application.commands.cache;
            const guildCommands =
                input.guild?.commands.cache ?? new Collection();
            const commands = //
                Array.from(globalCommands.concat(guildCommands).values());

            return input.reply({
                embeds: [new Help.CommandsEmbed(commands)],
            });
        }

        if (section === 'premium') {
            return input.reply({
                embeds: [new Help.PremiumEmbed()],
                components: [new Help.VoteComponents()],
            });
        }

        return input.reply({
            embeds: [new Help.Embed()],
            components: [
                new Help.SectionComponents(),
                new Help.LinkComponents(),
            ],
        });
    }
}
