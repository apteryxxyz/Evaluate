import type { AnyComponentBuilder } from '@discordjs/builders';
import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import { container } from 'maclary';
import type { Snippet } from '&entities/Snippet';
import { codeBlock } from '&functions/codeBlock';

export async function buildViewSnippetPayload(snippet: Snippet) {
    const language = await container.executor.findLanguage(snippet.language);

    const embed = new EmbedBuilder()
        .setTitle(`Snippet "${snippet.name}"`)
        .setDescription(language?.name ?? snippet.language)
        .setColor(0x2fc086)
        .setFields([
            { name: 'Code', value: codeBlock(snippet.code, language?.id) },
        ]);

    if (snippet.args.length > 0)
        embed.addFields([
            { name: 'Arguments', value: codeBlock(snippet.args) },
        ]);
    if (snippet.input.length > 0)
        embed.addFields([{ name: 'Input', value: codeBlock(snippet.input) }]);

    const run = new ButtonBuilder()
        .setCustomId(`snippet,${snippet.id},run`)
        .setLabel('Run')
        .setStyle(ButtonStyle.Success);

    return { content: '', embeds: [embed], components: [wrapInRow(run)] };
}

// HELPERS

function wrapInRow<T extends AnyComponentBuilder>(...components: T[]) {
    return new ActionRowBuilder<T>().addComponents(...components);
}
