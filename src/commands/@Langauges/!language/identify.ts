import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { TextInputStyle } from 'discord.js';
import type { Action } from 'maclary';
import { Command } from 'maclary';
import { IdentifyBuilder } from '&builders/IdentifyBuilder';
import { IncrementCommandCount } from '&preconditions/IncrementCommandCount';

export class IdentifyCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'identify',
            description:
                'Attempt to automatically detect the programming language of the provided code.',

            preconditions: [IncrementCommandCount],
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'code',
                    description: 'The code to identify.',
                    minLength: 10,
                    maxLength: 900,
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        let action: Action.AnyInteraction | Command.AnyInteraction = input;
        let code = input.options.getString('code');

        if (!code) {
            await input.showModal(this._buildModal());

            const hour = 3_600_000;
            const submit = await input.awaitModalSubmit({ time: hour });
            code = submit?.fields.getTextInputValue('code');
            action = submit;
        }

        await action.deferReply();
        const embed = await IdentifyBuilder.identifyAndBuildEmbed(code);
        return action.editReply({ embeds: [embed] });
    }

    private _buildModal() {
        const code = new TextInputBuilder()
            .setCustomId('code')
            .setLabel('Code')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMinLength(10)
            .setMaxLength(1_000)
            .setPlaceholder('Type the source code...');

        return new ModalBuilder()
            .setCustomId('_')
            .setTitle('Identify Language')
            .setComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(code)
            );
    }
}
