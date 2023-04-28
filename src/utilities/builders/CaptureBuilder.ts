import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { AttachmentBuilder, TextInputStyle } from 'discord.js';
import { container } from 'maclary';
import { Statistics } from '&entities/Statistics';
import type { Capture } from '&services/Capture';

export class CaptureBuilder extends null {
    public static buildCreateModal(options: Partial<Capture.CreateOptions>) {
        const language = new TextInputBuilder()
            .setCustomId('language')
            .setLabel('Language')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder('Type the programming language...')
            .setValue(options.language?.name ?? '')
            .setMaxLength(100);

        const code = new TextInputBuilder()
            .setCustomId('code')
            .setLabel('Code')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder('Type the source code...')
            .setValue(options.code ?? '')
            .setMaxLength(500);

        const rows = [language, code] //
            .map(put => new ActionRowBuilder<typeof put>().addComponents(put));

        return new ModalBuilder()
            .setTitle('Capture Code')
            .setComponents(rows)
            .setCustomId(`capture,create,${options.theme},${options.mode}`);
    }

    public static async buildCapturePayload(
        userId: string,
        options: Capture.CreateOptions
    ) {
        const repo = container.database.get(Statistics);
        void repo.incrementCaptureCount(userId);

        const capture = await container.capture.createCapture(options);

        const attachment = new AttachmentBuilder(capture) //
            .setName('capture.png');

        return { files: [attachment] };
    }
}
