import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { ButtonStyle, TextInputStyle } from 'discord.js';
import type { HSnippet } from '@models/Snippet';
import { container } from 'maclary';
import { codeBlock } from './stringFormatting';

/**
 * Build the snippet modal.
 */
export function buildSnippetModal(): ModalBuilder {
    const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(4)
        .setMaxLength(25)
        .setPlaceholder('Type the name of the snippet...');

    const row = new ActionRowBuilder<TextInputBuilder>().setComponents([nameInput]);

    return new ModalBuilder().setTitle('Create Snippet').setComponents([row]);
}

/**
 * Build the snippet message.
 * @param ownerId The ID of the owner of the snippet
 * @param snippet The snippet to build the embed for
 */
export async function buildSnippetMessage(
    ownerId: string,
    snippet: HSnippet,
): Promise<{ content: string; embeds: EmbedBuilder[]; components: ActionRowBuilder<any>[] }> {
    const owner = snippet.owners.find((o) => o.id === ownerId)!;
    const provider = container.providers.cache.get(snippet.providerId)!;
    const language = await provider.resolveLanguage(snippet.options.language);
    const { options } = snippet;

    const embed = new EmbedBuilder()
        .setTitle('Snippet')
        .setDescription(`Your snippet ${owner.name}.`)
        .setColor(0x2fc086)
        .setFields(
            [
                { name: 'Language', value: language ? language.pretty : '' },
                { name: 'Code', value: codeBlock(options.code, language?.id) },
                {
                    name: 'Arguments',
                    value: options.args?.length
                        ? codeBlock(options.args.map((a) => `"${a}"`).join(' '))
                        : '',
                },
                { name: 'Input', value: options.input?.length ? codeBlock(options.input) : '' },
            ].filter((f) => f.value.length > 0),
        );

    const runButton = new ButtonBuilder()
        .setLabel('Evaluate')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`snippet,${snippet._id},${ownerId},run`);

    const row = new ActionRowBuilder<any>() //
        .setComponents(language ? [runButton] : []);

    return { content: '', embeds: [embed], components: [row] };
}

/**
 * Build a confirm button.
 * @param returnRow Whether to return a row or a button
 * @param snippetId The ID of the snippet
 */
export function buildDeleteButton(
    snippetId: string,
    returnRow: true,
): ActionRowBuilder<ButtonBuilder>;
export function buildDeleteButton(snippetId: string, returnRow: false): ButtonBuilder;
export function buildDeleteButton(snippetId: string, returnRow: boolean) {
    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel('Confirm')
        .setCustomId(`snippet,${snippetId},delete`);
    return returnRow ? new ActionRowBuilder<ButtonBuilder>().setComponents([button]) : button;
}
