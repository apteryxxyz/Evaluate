import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { oneLine } from 'common-tags';
import { ButtonStyle } from 'discord.js';
import { container } from 'maclary';
import {
    buildField,
    removeNullish,
    wrapInRow,
} from '&functions/builderHelpers';
import premium from '&premium';

export function PremiumEmbed() {
    const client = container.client;
    const features = removeNullish(
        ...[premium.capture.themes, premium.identify.ai].map(feature =>
            buildField(feature.name, feature.description, true)
        )
    );

    return new EmbedBuilder()
        .setTitle(`${client.user.username} Premium`)
        .setDescription(
            oneLine`Going premium is a great way to support
            ${client.user.username} and unlock some cool features.
            Best of all, **it's completely free!** All you need to
            do is vote for ${client.user.username} on bot lists.`
        )
        .setFields(features)
        .setColor(0x2fc086);
}

export function VoteComponents() {
    return wrapInRow(
        new ButtonBuilder()
            .setLabel("Evaluate isn't on any bot lists yet")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('help,premium,coming-soon')
            .setDisabled(true)
    );
}
