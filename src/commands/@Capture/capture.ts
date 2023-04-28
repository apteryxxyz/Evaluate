import { Command } from 'maclary';
import { CaptureBuilder } from '&builders/CaptureBuilder';
import { IncrementCommandCount } from '&preconditions/IncrementCommandCount';

export class Capture extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'capture',
            description: 'Convert a snippet of code into a beautiful image.',

            preconditions: [IncrementCommandCount],
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'code',
                    description:
                        'The code to convert into an image, emitting this will cause a modal to appear.',
                    maxLength: 900,
                },
                {
                    type: Command.OptionType.String,
                    autocomplete: true,
                    name: 'language',
                    description:
                        'Force the syntax highlighting of a language, or let the bot detect it.',
                    maxLength: 100,
                },
            ],
        });
    }

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const query = autocomplete.options.getFocused();
        const langs = await this.container.executor.autocompleteLanguage(query);

        return autocomplete.respond(
            langs.map(lang => ({
                name: lang.name,
                value: lang.key,
            }))
        );
    }

    public override async onSlash(input: Command.ChatInput) {
        const code = input.options.getString('code') ?? undefined;
        const rawLang = input.options.getString('language');
        const language = rawLang
            ? await this.container.executor.resolveLanguage(rawLang)
            : undefined;

        if (code) {
            await input.deferReply();
            const payload = await CaptureBuilder.buildCapturePayload(
                input.user.id,
                { language, code }
            );
            return input.editReply(payload);
        }

        const modal = CaptureBuilder.buildCreateModal({ language, code });
        return input.showModal(modal);
    }
}
