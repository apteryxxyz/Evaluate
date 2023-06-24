import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import type { Evaluator } from '&classes/structures/Evaluator';
import {
    buildField,
    removeNullish,
    wrapInRow,
} from '&functions/builderHelpers';
import { codeBlock } from '&functions/codeBlock';
import { Pastebin } from '&services/Pastebin';

// eslint-disable-next-line @typescript-eslint/promise-function-async
export function ResultEmbed(executor: Evaluator) {
    const result = executor.history.at(-1)!;

    const fields = removeNullish(
        buildField('Code', codeBlock(result.code, result.language.id)),
        buildField('Input', codeBlock(result.input), true),
        buildField('Arguments', codeBlock(result.args), true)
    );

    const embed = new EmbedBuilder()
        .setTitle('Evaluation Result')
        .setDescription(result.language.name)
        .setColor(result.isSuccess ? 0x2fc086 : 0xff0000)
        .setFields(fields);

    return buildOutput(result.output) //
        .then(output => embed.addFields(buildField('Output', output)!));
}

export function ResultComponents(executor: Evaluator, disableAll = false) {
    const result = executor.history.at(-1)!;

    return wrapInRow(
        new ButtonBuilder()
            .setCustomId('execute,edit')
            .setLabel('Edit')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disableAll),
        new ButtonBuilder()
            .setCustomId('execute,undo')
            .setLabel('Undo')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(executor.history.length === 1 || disableAll),
        new ButtonBuilder()
            .setCustomId('execute,capture')
            .setLabel('Capture')
            .setStyle(ButtonStyle.Success)
            .setDisabled(!result.isSuccess || disableAll),
        new ButtonBuilder()
            .setCustomId('execute,save')
            .setLabel('Save')
            .setStyle(ButtonStyle.Success)
            .setDisabled(!result.isSuccess || disableAll)
    );
}

// Helpers

async function buildOutput(output: string) {
    if (output.length === 0)
        return 'No output, ensure something was printed to the console.';

    if (output.length > 1_000) {
        const pastebin = await Pastebin.waitFor();

        const pasteUrl = await pastebin.createPaste({
            content: output,
            lifetime: 1_000 * 60 * 60,
        });

        return `Output was too long, so it was uploaded to a [pastebin](${pasteUrl}).`;
    }

    return codeBlock(output);
}
