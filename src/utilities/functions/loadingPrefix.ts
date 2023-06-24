import type {
    InteractionEditReplyOptions,
    InteractionReplyOptions,
    InteractionResponse,
    InteractionUpdateOptions,
    Message,
    MessageComponentInteraction,
    MessageEditOptions,
    RepliableInteraction,
} from 'discord.js';
import { resolveEmoji } from './resolveEmoji';

export function deferReply<T extends boolean>(
    interaction: RepliableInteraction,
    content: string,
    options?: InteractionReplyOptions & { fetchReply?: T }
) {
    return interaction.reply({
        ...options,
        content: `${resolveEmoji('loading')} ${content}`,
    }) as T extends true ? Promise<Message> : Promise<InteractionResponse>;
}

export async function editReply(
    interaction: RepliableInteraction,
    content: string,
    options?: InteractionEditReplyOptions
) {
    return interaction.editReply({
        ...options,
        content: `${resolveEmoji('loading')} ${content}`,
    });
}

export async function update(
    interaction: MessageComponentInteraction,
    content: string,
    options?: InteractionUpdateOptions
) {
    return interaction.update({
        ...options,
        content: `${resolveEmoji('loading')} ${content}`,
    });
}

export async function editMessage(
    message: Message,
    content: string,
    options?: MessageEditOptions
) {
    return message.edit({
        ...options,
        content: `${resolveEmoji('loading')} ${content}`,
    });
}
