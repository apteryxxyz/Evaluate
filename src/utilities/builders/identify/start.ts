import { ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { TextInputStyle } from 'discord.js';
import { Constants } from '.';
import { wrapInRow } from '&functions/builderHelpers';

export function StartModal() {
    const code = new TextInputBuilder()
        .setCustomId('code')
        .setLabel('Code')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(Constants.strings.code + '..')
        .setMinLength(Constants.lengths.code[0])
        .setMaxLength(Constants.lengths.code[1]);

    return new ModalBuilder()
        .setTitle('Identify Language')
        .setComponents(wrapInRow(code))
        .setCustomId('identify,ask');
}
