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
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        return input.reply({
            embeds: [new Help.MainEmbed()],
            components: [
                new Help.ActionComponents(),
                new Help.LinkComponents(),
            ],
        });
    }
}
