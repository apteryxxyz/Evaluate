import { EmbedBuilder } from '@discordjs/builders';
import type { ApplicationCommand } from 'discord.js';
import { container } from 'maclary';

export function CommandsEmbed(
    clientCommands: ApplicationCommand[],
    maclaryCommands = Array.from(container.maclary.commands.cache.values())
) {
    const categories = new Map<string, string[]>();

    for (const command of clientCommands) {
        const inner = maclaryCommands.find(cmd => cmd.name === command.name);
        if (!inner) continue;

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const category = inner?.category || 'Uncategorised';
        if (category === 'Developer') continue;

        const commands = categories.get(category) ?? [];
        commands.push(...formatCommand(inner, command.id));
        categories.set(category, commands);
    }

    const embed = new EmbedBuilder()
        .setTitle(`Evaluate Commands`)
        .setColor(0x2fc086);
    for (const [category, commands] of categories.entries())
        embed.addFields({ name: category, value: commands.join('\n') });
    return embed;
}

// Helpers

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
    return [`__**${usage}**__ | ${command.description}`];
}
