import {
    ActionRowBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { Command, Component, container } from 'maclary';
import { TextInputStyle } from 'discord.js';
import { Piston } from '@lib/providers/Piston';
import { detectLanguage } from '@lib/util/detectLanguage';
import { codeBlock } from '@lib/util/stringFormatting';
import { IncrementCommandCount } from '@lib/preconditions/IncrementCommandCount';

export default class Detect extends Command {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'identify',
            description: 'Attempt to identify the programming language of a piece of code.',
            preconditions: [IncrementCommandCount],
        });
    }

    public override async onChatInput(interaction: Command.ChatInput): Promise<unknown> {
        const inputInput = new TextInputBuilder()
            .setCustomId('input')
            .setLabel('Input')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMinLength(20)
            .setMaxLength(1000)
            .setPlaceholder('Type the code input...');

        const modal = new ModalBuilder()
            .setTitle('Detect Language')
            .setCustomId('_,languageDetect')
            .setComponents(new ActionRowBuilder<any>().addComponents([inputInput]));

        await interaction.showModal(modal);

        const filter = (i: any) => i.customId === '_,languageDetect';
        const submit = await interaction.awaitModalSubmit({ filter, time: 2_147_483_647 });
        if (!submit) return;

        return this.onModalSubmit(submit);
    }

    private async onModalSubmit(modal: Component.ModalSubmit): Promise<unknown> {
        const code = modal.fields.getTextInputValue('input');
        const provider = container.providers.cache.get(Piston.id)!;
        const language = await detectLanguage(code, provider);

        const detected = language
            ? `Identified this code as ${language.name}.`
            : "Could not identify this codes language, either there isn't enough information or I don't support it.";

        const embed = new EmbedBuilder()
            .setTitle('Language Detection')
            .setColor(0x2fc086)
            .setFields([
                { name: 'Code', value: codeBlock(code, language?.id) },
                { name: 'Prediction', value: detected },
            ]);

        return modal.reply({ embeds: [embed] });
    }
}
