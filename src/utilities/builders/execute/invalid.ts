import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import { wrapInRow } from '&functions/builderHelpers';

export function InvalidLanguageEmbed() {
    return new EmbedBuilder()
        .setTitle('Invalid Language')
        .setDescription(
            'I could not find a language that I support with that name. Please try again.'
        )
        .setColor(0xff0000);
}

export function InvalidLanguageComponents() {
    return wrapInRow(
        new ButtonBuilder()
            .setCustomId('execute,edit')
            .setLabel('Try Again')
            .setStyle(ButtonStyle.Danger)
    );
}
