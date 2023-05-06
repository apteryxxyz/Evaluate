import type { Action } from 'maclary';
import { Command } from 'maclary';
import { Identify } from '&builders/identify';
import { BeforeCommand } from '&preconditions/BeforeCommand';
import premium from '&premium';

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

            preconditions: [BeforeCommand],
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'code',
                    description:
                        'The code to identify, omitting this option will prompt you for the code.',
                    minLength: Identify.Constants.lengths.code[0],
                    maxLength: Identify.Constants.lengths.code[1],
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        let action: Action.AnyInteraction | Command.AnyInteraction = input;
        let code = input.options.getString('code');

        if (!code) {
            await input.showModal(new Identify.StartModal());

            const hour = 3_600_000;
            const submit = await input.awaitModalSubmit({ time: hour });
            code = submit?.fields.getTextInputValue('code');
            action = submit;
        }

        await action.deferReply();
        const options = {
            code,
            usePaid: premium.identify.ai.determine(
                input.user.entity.hasPremium
            ),
        };
        return action.editReply({
            embeds: [
                new Identify.ResultEmbed({
                    ...options,
                    result: await this.container.detector //
                        .detectLanguage(options),
                }),
            ],
        });
    }
}
