import { ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import { container } from 'maclary';
import type { Snippet } from '&entities/Snippet';
import {
    buildField,
    removeNullish,
    wrapInRow,
} from '&functions/builderHelpers';
import { codeBlock } from '&functions/codeBlock';

export function ViewEmbed(snippet: Snippet) {
    const fields = removeNullish(
        buildField('Input', codeBlock(snippet.input), true),
        buildField('Arguments', codeBlock(snippet.args), true)
    );

    const embed = new EmbedBuilder()
        .setTitle(`Snippet "${snippet.name}"`)
        .setColor(0x2fc086);

    return container.executor.findLanguage(snippet.language).then(language => {
        const field = buildField('Code', codeBlock(snippet.code, language?.id));
        if (field) fields.unshift(field);
        return embed
            .setDescription(language?.name ?? snippet.language)
            .setFields(fields);
    });
}

export function ViewComponents(snippet: Snippet) {
    return wrapInRow(
        new ButtonBuilder()
            .setCustomId(`snippet,${snippet.id},run`)
            .setLabel('Run')
            .setStyle(ButtonStyle.Success)
    );
}
