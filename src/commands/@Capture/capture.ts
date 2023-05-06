import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { TextInputStyle } from 'discord.js';
import type { Action } from 'maclary';
import { Command } from 'maclary';
import { BeforeCommand } from '&preconditions/BeforeCommand';
import { Renderer } from '&services/Renderer';

export class Capture extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'capture',
            description: 'Convert a piece of code into a beautiful image.',

            preconditions: [BeforeCommand],
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'code',
                    description:
                        'The code to convert into an image, for multi-line code omit this option.',
                    maxLength: 900,
                },
                {
                    type: Command.OptionType.String,
                    name: 'mode',
                    description: 'Dark or light mode, defaults to light.',
                    choices: Object.entries(Renderer.Mode) //
                        .map(([name, value]) => ({ name, value })),
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        let action: Action.AnyInteraction | Command.AnyInteraction = input;
        let code = input.options.getString('code');
        const mode = (input.options.getString('mode') ?? undefined) as
            | Renderer.Mode
            | undefined;

        if (!code) {
            await input.showModal(this._buildModal());

            const submit = await input
                .awaitModalSubmit({ time: 3_600_000 })
                .catch(() => null);
            if (submit === null) return void 0;

            code = submit.fields.getTextInputValue('code');
            action = submit;
        }

        await action.deferReply();
        const image = await this.container.renderer //
            .createRender({ code, mode }, input.user.id);
        return action.editReply({
            files: [image],
        });
    }

    private _buildModal() {
        const code = new TextInputBuilder()
            .setCustomId('code')
            .setLabel('Code')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(900)
            .setPlaceholder('Type the code to render...');

        return new ModalBuilder()
            .setCustomId('_')
            .setTitle('Capture COde')
            .setComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(code)
            );
    }
}
