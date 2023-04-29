import type { AnyComponentBuilder } from '@discordjs/builders';
import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { TextInputStyle } from 'discord.js';
import type { Renderer } from '&services/Renderer';

const strings = {
    langauge:
        'Type the language for syntax highlighting, or let the bot auto detect it...',
    code: 'Type the code to render...',
};

export function buildCreateRenderModal(
    options: Partial<Renderer.CreateOptions>
) {
    const language = new TextInputBuilder()
        .setCustomId('language')
        .setLabel('Language')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder(strings.langauge)
        .setValue(options.language?.name ?? '')
        .setMaxLength(100);

    const code = new TextInputBuilder()
        .setCustomId('code')
        .setLabel('Code')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder(strings.code)
        .setValue(options.code ?? '')
        .setMaxLength(900);

    return new ModalBuilder()
        .setTitle('Capture Code')
        .setComponents([wrapInRow(language), wrapInRow(code)])
        .setCustomId(`render,create,${options.theme},${options.mode}`);
}

// HELPERS

function wrapInRow<T extends AnyComponentBuilder>(...components: T[]) {
    return new ActionRowBuilder<T>().addComponents(...components);
}
