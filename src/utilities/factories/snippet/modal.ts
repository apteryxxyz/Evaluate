import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import type { AnyComponentBuilder } from 'discord.js';
import { TextInputStyle } from 'discord.js';

const strings = { name: 'Type a name for your snippet...' };

export function buildSnippetSaveModal(id: string) {
    const name = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder(strings.name)
        .setMinLength(4)
        .setMaxLength(25);

    return new ModalBuilder()
        .setTitle('Save Snippet')
        .setComponents(wrapInRow(name))
        .setCustomId(`_,${id},save`);
}

// HELPERS

function wrapInRow<T extends AnyComponentBuilder>(...components: T[]) {
    return new ActionRowBuilder<T>().addComponents(...components);
}
