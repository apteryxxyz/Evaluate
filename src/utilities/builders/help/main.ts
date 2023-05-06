import process from 'node:process';
import { URL } from 'node:url';
import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { oneLine } from 'common-tags';
import { ButtonStyle, OAuth2Scopes } from 'discord.js';
import { container } from 'maclary';
import { wrapInRow } from '&functions/builderHelpers';

export function MainEmbed() {
    return new EmbedBuilder()
        .setTitle(`${container.client.user?.username} Help`)
        .setColor(0x2fc086)
        .setDescription(makeDescription());
}

export function ActionComponents() {
    return wrapInRow(
        new ButtonBuilder()
            .setLabel('Commands')
            .setStyle(ButtonStyle.Success)
            .setCustomId('help,commands')
        // new ButtonBuilder()
        //     .setLabel('Premium')
        //     .setStyle(ButtonStyle.Primary)
        //     .setCustomId('help,premium')
    );
}

export function LinkComponents() {
    return wrapInRow(
        new ButtonBuilder()
            .setLabel('Invite Me')
            .setStyle(ButtonStyle.Link)
            .setURL(getBotInvite()),
        new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link)
            .setURL(getServerInvite())
    );
}

// HELPERS

function makeDescription() {
    return (
        oneLine`
        Hello there! :wave:` +
        '\n\n' +
        oneLine`
        I'm Evaluate, an intelligent bot designed to execute code in over 80
        different programming languages. My skills don't stop there though.
        I'm also equipped to identify the language of any code snippet, or
        convert it into beautiful images. In addition to that, I'm a handy
        tool for saving your code snippets.` +
        '\n\n' +
        oneLine`
        Use the buttons below to navigate through my commands and features!`
    );
}

function getBotInvite() {
    const addParams = container.client.application.installParams ?? {
        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
        permissions: 0n,
    };

    return container.client.generateInvite(addParams);
}

function getServerInvite() {
    const code = process.env.DISCORD_SUPPORT_CODE ?? 'discord-developers';
    return new URL(code, 'https://discord.gg/').toString();
}
