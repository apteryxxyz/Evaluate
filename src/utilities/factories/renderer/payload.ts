import type { Buffer } from 'node:buffer';
import { AttachmentBuilder } from 'discord.js';

export function buildRenderAttachmentPayload(
    image: string | Buffer,
    showPremiumMessage = false
) {
    return {
        content: showPremiumMessage
            ? 'Unlock different themes and dark mode with premium.'
            : undefined,
        files: [new AttachmentBuilder(image).setName('render.png')],
    };
}
