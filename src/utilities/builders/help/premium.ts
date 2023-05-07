import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { oneLine } from 'common-tags';
import { ButtonStyle } from 'discord.js';
import { container } from 'maclary';
import {
    buildField,
    removeNullish,
    wrapInRow,
} from '&functions/builderHelpers';
import premium, { lists } from '&premium';

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
            do is vote for ${client.user.username} on bot lists,
            use the buttons below to get started!`
        )
        .setFields(features)
        .setColor(0x2fc086);
}

export function VoteComponents() {
    return wrapInRow(
        ...lists.map(list =>
            new ButtonBuilder()
                .setLabel(
                    `Vote for ${list.days} day${list.days === 1 ? '' : 's'}`
                )
                .setStyle(ButtonStyle.Link)
                .setURL(list.url)
        )
    );
}
