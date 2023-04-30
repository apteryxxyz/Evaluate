import {
    ButtonBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { ButtonStyle, TextInputStyle } from 'discord.js';
import { Constants } from '.';
import { wrapInRow } from '&functions/builderHelpers';
import type { Executor } from '&services/Executor';

export function CreateModal(
    options: Partial<Executor.ExecuteOptions>
): ModalBuilder {
    const language = new TextInputBuilder()
        .setCustomId('language')
        .setLabel('Language')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder(Constants.strings.language + '..')
        .setValue(options.language?.name ?? '')
        .setMinLength(Constants.lengths.language[0])
        .setMaxLength(Constants.lengths.language[1]);

    const code = new TextInputBuilder()
        .setCustomId('code')
        .setLabel('Code')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder(Constants.strings.code + '..')
        .setValue(options.code ?? '')
        .setMinLength(Constants.lengths.code[0])
        .setMaxLength(Constants.lengths.code[1]);

    const input = new TextInputBuilder()
        .setCustomId('input')
        .setLabel('Input')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder(Constants.strings.input + '..')
        .setValue(options.input ?? '')
        .setMinLength(Constants.lengths.input[0])
        .setMaxLength(Constants.lengths.input[1]);

    const args = new TextInputBuilder()
        .setCustomId('args')
        .setLabel('Arguments')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder(Constants.strings.args + '..')
        .setValue(options.args ?? '')
        .setMinLength(Constants.lengths.args[0])
        .setMaxLength(Constants.lengths.args[1]);

    return new ModalBuilder()
        .setTitle('Evaluate Code')
        .setComponents([language, code, input, args].map(_ => wrapInRow(_)))
        .setCustomId('execute,create');
}

export function EditModal(...args: Parameters<typeof CreateModal>) {
    return CreateModal(...args).setCustomId(`execute,edit`);
}

export function StartButton() {
    return wrapInRow(
        new ButtonBuilder()
            .setCustomId('execute,create')
            .setLabel('Start')
            .setStyle(ButtonStyle.Success)
    );
}
