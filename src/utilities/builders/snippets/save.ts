import { ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { TextInputStyle } from 'discord.js';
import { Constants } from '.';
import { wrapInRow } from '&functions/builderHelpers';

export function SaveModal() {
    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder('Name for your snippet...')
        .setMinLength(Constants.lengths.name[0])
        .setMaxLength(Constants.lengths.name[1]);

    return new ModalBuilder()
        .setTitle('Save Snippet')
        .setComponents(wrapInRow(name))
        .setCustomId(`_,save`);
}
