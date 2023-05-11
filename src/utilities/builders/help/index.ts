import process from 'node:process';
import { URL } from 'node:url';
import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { oneLine } from 'common-tags';
import { ButtonStyle, OAuth2Scopes } from 'discord.js';
import { container } from 'maclary';
import { CommandsEmbed } from './commands';
import { PremiumEmbed, VoteComponents } from './premium';
import type { New } from '&functions/builderHelpers';
import { wrapInRow } from '&functions/builderHelpers';

export const Help = {
    Embed: Embed as unknown as New<typeof Embed>,
    SectionComponents: SectionComponents as unknown as New<
        typeof SectionComponents
    >,
    LinkComponents: LinkComponents as unknown as New<typeof LinkComponents>,

    // Commands
    CommandsEmbed: CommandsEmbed as unknown as New<typeof CommandsEmbed>,

    // Premium
    PremiumEmbed: PremiumEmbed as unknown as New<typeof PremiumEmbed>,
    VoteComponents: VoteComponents as unknown as New<typeof VoteComponents>,
};

function Embed() {
    return new EmbedBuilder()
        .setTitle('Evaluate Help')
        .setDescription(makeDescription())
        .setColor(0x2fc086);
}

function makeDescription() {
    return (
        oneLine`
        Hello there! :wave:` +
        '\n\n' +
        //
        oneLine`
        I am Evaluate, an intelligent bot designed to **execute code** in
        over 80 different programming langauges. My skills don't stop there
        though, I'm also equipped to **identify the language** of any code
        snippet, or convert it into **beautiful images**. In addition to
        that, I'm a handy tool for saving your **code snippets**.` +
        '\n\n' +
        //
        oneLine`
        But that's not all! I offer the occasional **code challenge** for you
        to practice your coding skills and earn points! And if you're a server
        manager you can even set a channel for me to post them in when they
        are announced, a great way to **promote activity** in your server.` +
        '\n\n' +
        //
        oneLine`
        Use the buttons below to navigate through my commands and features!`
    );
}

function SectionComponents() {
    return wrapInRow(
        new ButtonBuilder()
            .setLabel('Commands')
            .setStyle(ButtonStyle.Success)
            .setCustomId('help,commands'),
        new ButtonBuilder()
            .setLabel('Premium (its free)')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('help,premium')
    );
}

function LinkComponents() {
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

// Helpers

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
