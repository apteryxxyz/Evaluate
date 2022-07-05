import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { ButtonStyle, TextInputStyle } from 'discord.js';
import type { Evaluator } from '@lib/structures/Evaluator';
import type { Language, Options } from '@lib/structures/Provider';
import { uploadToRentry } from './pasteBin';
import { codeBlock } from './stringFormatting';
import { Command, Component, container } from 'maclary';

/**
 * Build the evaluate modal.
 * @param options The default values for the fields
 */
export function buildEvaluateModal(
    options: Partial<Omit<Options, 'language'>> & { language?: Language | string } = {},
): ModalBuilder {
    const languageInput = new TextInputBuilder()
        .setCustomId('language')
        .setLabel('Language')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder('Type the programming language...')
        .setValue(
            (typeof options.language === 'object' ? options.language?.pretty : options.language) ||
                '',
        );

    const codeInput = new TextInputBuilder()
        .setCustomId('code')
        .setLabel('Code')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000)
        .setPlaceholder('Type the source code...')
        .setValue(options.code ?? '');

    const inputInput = new TextInputBuilder()
        .setCustomId('input')
        .setLabel('Input')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setMaxLength(1000)
        .setPlaceholder('Type the input...')
        .setValue(options.input ?? '');

    const argsInput = new TextInputBuilder()
        .setCustomId('args')
        .setLabel('Arguments')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setMaxLength(1000)
        .setPlaceholder('Type the arguments here...')
        .setValue(options.args?.map((a) => `"${a}"`).join(' ') ?? '');

    const rows = [languageInput, codeInput, inputInput, argsInput] //
        .map((com) => new ActionRowBuilder<TextInputBuilder>().setComponents([com]));

    return new ModalBuilder() //
        .setTitle('Evaluate Code')
        .setComponents(rows);
}

/**
 * Build a evaluate result message.
 * @param evaluator The evaluator to build the message for
 */
export async function buildEvaluateMessage(
    evaluator: Evaluator,
): Promise<{ content: string; embeds: EmbedBuilder[]; components: ActionRowBuilder<any>[] }> {
    const result = evaluator.history.at(-1)!;
    const language = await evaluator.provider.resolveLanguage(result.language);

    const pasteBinUrl = result.output.length > 1000 ? await uploadToRentry(result.output) : '';
    const output = result.output
        ? result.output.length > 1000
            ? `Output was too large for Discord, uploaded to a [pastebin](${pasteBinUrl}) instead.`
            : codeBlock(result.output, 'ansi')
        : 'No output, ensure something was printed to the console.';

    const embed = new EmbedBuilder()
        .setTitle('Evaluation Result')
        .setTimestamp()
        .setColor(0x2fc086)
        .setFields(
            [
                { name: 'Language', value: language ? language.pretty : '' },
                { name: 'Code', value: codeBlock(result.code, language?.id) },
                {
                    name: 'Arguments',
                    value:
                        result.args.length > 0
                            ? codeBlock(result.args.map((a) => `"${a}"`).join(' '))
                            : '',
                },
                { name: 'Input', value: result.input.length > 0 ? codeBlock(result.input) : '' },
                { name: 'Output', value: output },
            ].filter((f) => f.value.length > 0),
        );

    // TODO: Buttons
    const editButton = new ButtonBuilder()
        .setLabel('Edit')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('eval,edit');

    const saveSnippet = new ButtonBuilder()
        .setCustomId('eval,snippet')
        .setLabel('Save As Snippet')
        .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder<any>() //
        .setComponents([editButton, saveSnippet]);

    return { content: '', embeds: [embed], components: [actionRow] };
}

/**
 * Build a try again button.
 * @param returnRow Whether to return a row or a button
 */
export function buildTryAgainButton(returnRow: true): ActionRowBuilder<ButtonBuilder>;
export function buildTryAgainButton(returnRow: false): ButtonBuilder;
export function buildTryAgainButton(returnRow: boolean) {
    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('Try Again')
        .setCustomId('eval,edit');
    return returnRow ? new ActionRowBuilder<ButtonBuilder>().setComponents([button]) : button;
}

/**
 * Build a start button.
 * @param returnRow Whether to return a row or a button
 */
export function buildStartButton(returnRow: true): ActionRowBuilder<ButtonBuilder>;
export function buildStartButton(returnRow: false): ButtonBuilder;
export function buildStartButton(returnRow: boolean) {
    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('Start')
        .setCustomId('eval,start');
    return returnRow ? new ActionRowBuilder<ButtonBuilder>().setComponents([button]) : button;
}

/**
 * Get and verify an evaluator.
 * @param interaction The interaction to get message and user from
 */
export function getAndVerifyEvaluator(
    interaction: Component.Button | Component.ModalSubmit | Component.SelectMenu,
): Evaluator | undefined {
    if (!(interaction.message instanceof Command.Message))
        return void interaction.reply({
            content:
                'This evaluation command has failed to load, ' +
                'create a new one using the button below.',
            components: [buildStartButton(true)],
            ephemeral: true,
        });

    const evaluator = container.evaluators.cache.get(interaction.message.id);

    if (!evaluator)
        return void interaction.reply({
            content:
                'This evaluation command has timed out, ' +
                'create a new one using the button below.',
            components: [buildStartButton(true)],
            ephemeral: true,
        });

    if (interaction.user.id !== evaluator.user.id)
        return void interaction.reply({
            content: 'You do not have access to this, create a your own using the button below.',
            components: [buildStartButton(true)],
            ephemeral: true,
        });

    return evaluator;
}
