import type { AnyComponentBuilder } from '@discordjs/builders';
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import { container } from 'maclary';
import { codeBlock } from '&functions/codeBlock';
import type { Executor } from '&services/Executor';
import { Pastebin } from '&services/Pastebin';

export async function buildExecuteResultPayload(
    result: Executor.ExecuteResult
) {
    const output = await buildOutput(result.output);

    const embed = new EmbedBuilder()
        .setTitle('Evaluation Result')
        .setDescription(result.language.name)
        .setColor(result.isSuccess ? 0x2fc086 : 0xff0000)
        .setFields([
            {
                name: 'Code',
                value: codeBlock(result.code, result.language.id),
            },
        ]);

    if (result.args.length > 0)
        embed.addFields([
            { name: 'Arguments', value: formatArgs(result.args) },
        ]);
    if (result.input.length > 0)
        embed.addFields([{ name: 'Input', value: codeBlock(result.input) }]);
    embed.addFields([{ name: 'Output', value: output }]);

    const edit = new ButtonBuilder()
        .setCustomId('execute,edit')
        .setLabel('Edit')
        .setStyle(ButtonStyle.Success);

    const capture = new ButtonBuilder()
        .setCustomId('execute,capture')
        .setLabel('Capture')
        .setStyle(ButtonStyle.Success);

    const save = new ButtonBuilder()
        .setCustomId('execute,save')
        .setLabel('Save')
        .setStyle(ButtonStyle.Success);

    return {
        content: '',
        embeds: [embed],
        components: [wrapInRow(edit, capture, save)],
    };
}

export function buildInvalidLanguagePayload() {
    const embed = new EmbedBuilder()
        .setTitle('Invalid Language')
        .setDescription(
            'The language you provided was invalid, please try again.'
        )
        .setColor(0xff0000);

    const button = new ButtonBuilder()
        .setCustomId('execute,edit')
        .setLabel('Try Again')
        .setStyle(ButtonStyle.Danger);

    return { content: '', embeds: [embed], components: [wrapInRow(button)] };
}

export async function buildOutput(output: string) {
    if (output.length === 0)
        return 'No output, ensure something was printed to the console.';

    if (output.length > 1_000) {
        await Pastebin.waitFor();

        const pasteUrl = await container.pastebin.createPaste({
            content: output,
            lifetime: 1_000 * 60 * 60,
        });

        return `Output was too long, so it was uploaded to [pastebin](${pasteUrl}).`;
    }

    return codeBlock(output);
}

// HELPERS

function formatArgs(args: string[]) {
    return codeBlock(args.map(arg => `"${arg}"`).join(' '));
}

function wrapInRow<T extends AnyComponentBuilder>(...components: T[]) {
    return new ActionRowBuilder<T>().addComponents(...components);
}
