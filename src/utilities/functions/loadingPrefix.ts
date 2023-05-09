import type {
    InteractionReplyOptions,
    InteractionResponse,
    Message,
    MessageEditOptions,
    RepliableInteraction,
} from 'discord.js';
import { resolveEmoji } from './resolveEmoji';

export function deferReply<T extends boolean>(
    interaction: RepliableInteraction,
    message: string,
    options?: InteractionReplyOptions & { fetchReply?: T }
) {
    return interaction.reply({
        ...options,
        content: `${resolveEmoji('loading')} ${message}`,
    }) as T extends true ? Promise<Message> : Promise<InteractionResponse>;
}

export function editMessage(
    message: Message,
    content: string,
    options?: MessageEditOptions
) {
    return message.edit({
        ...options,
        content,
    });
}
