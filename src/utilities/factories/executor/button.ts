import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';

export function buildExecuteStartButton() {
    return new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
            .setCustomId('execute,create')
            .setLabel('Start')
            .setStyle(ButtonStyle.Primary),
    ]);
}
