import type { ApplicationCommand } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { Command } from 'maclary';
import { IncrementCommandCount } from '&preconditions/IncrementCommandCount';

export class HelpCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'help',
            description: 'View a list of commands and useful links.',

            preconditions: [IncrementCommandCount],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const container = this.container;

        const helpEmbed = new EmbedBuilder()
            .setTitle('Commands')
            .setColor(0x2fc086)
            .addFields(
                buildCommandGroups(
                    Array.from(container.maclary.commands.cache.values()),
                    Array.from(
                        container.maclary.options.guildId
                            ? input.guild?.commands.cache.values() ?? []
                            : container.client.application.commands.cache.values()
                    )
                )
            );

        return input.reply({ embeds: [helpEmbed] });
    }
}

function buildCommandGroups(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    internalCommands: Command<any, [any]>[],
    externalCommands: ApplicationCommand[]
) {
    const categories = new Map<string, string[]>();
    for (const external of externalCommands) {
        const internal = internalCommands.find(
            cmd => cmd.name === external.name
        );
        if (!internal) continue;

        const category = internal?.category ?? 'Uncategorised';
        if (category === 'Developer') continue;

        const commands = categories.get(category) ?? [];
        commands.push(...formatCommand(internal, external.id));
        categories.set(category, commands);
    }

    return [...categories.entries()].map(([category, commands]) => ({
        name: category,
        value: commands.join('\n'),
    }));
}

interface CommandInfo {
    type: number;
    name: string;
    description: string;
    options?: CommandInfo[];
}
function formatCommand(
    command: CommandInfo,
    id: string,
    prefix = ''
): string[] {
    if (
        command.options?.length &&
        command.options?.every(opt => opt.type === 1)
    )
        return command.options.flatMap(opt =>
            formatCommand(opt, id, `${prefix}${command.name} `)
        );

    const usage =
        command.type === 1
            ? `</${prefix}${command.name}:${id}>`
            : `Apps > ${command.name}`;
    return [`__${usage}__ | ${command.description}`];
}

// function getBotInvite() {
//     const addParams = container.client.application.installParams ?? {
//         scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
//         permissions: 0n,
//     };

//     return container.client.generateInvite(addParams);
// }

// function getSupportInvite() {
//     return '';
// }
