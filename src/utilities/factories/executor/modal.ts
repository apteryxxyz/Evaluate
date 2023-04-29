import type { AnyComponentBuilder } from '@discordjs/builders';
import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { TextInputStyle } from 'discord.js';
import type { Executor } from '&services/Executor';

const strings = {
    language: 'Type the language, or let the bot auto detect it...',
    code: 'Type the code to execute...',
    input: 'Type the STDIN input...',
    args: 'Type the additional command line arguments...',
};

export function buildExecuteModal(options: Partial<Executor.ExecuteOptions>) {
    const language = new TextInputBuilder()
        .setCustomId('language')
        .setLabel('Language')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder(strings.language)
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

    const input = new TextInputBuilder()
        .setCustomId('input')
        .setLabel('Input')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder(strings.input)
        .setValue(options.input ?? '')
        .setMaxLength(500);

    const args = new TextInputBuilder()
        .setCustomId('args')
        .setLabel('Arguments')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder(strings.args)
        .setValue(options.args ?? '')
        .setMaxLength(500);

    return new ModalBuilder()
        .setTitle('Evaluate Code')
        .setComponents([
            wrapInRow(language),
            wrapInRow(code),
            wrapInRow(input),
            wrapInRow(args),
        ])
        .setCustomId(`execute,create`);
}

// HELPERS

function wrapInRow<T extends AnyComponentBuilder>(...components: T[]) {
    return new ActionRowBuilder<T>().addComponents(...components);
}
