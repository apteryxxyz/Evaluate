import { Command } from 'maclary';
import { buildExecuteModal } from '&factories/executor';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class EvaluateCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'evaluate',
            description:
                'Evaluate any piece of code, specify the language or let the bot attempt to detect it automatically.',

            preconditions: [BeforeCommand],
            options: [
                {
                    type: Command.OptionType.String,
                    autocomplete: true,
                    name: 'language',
                    description:
                        'Specify the programming language to evaluate in, or let the bot detect it.',
                    required: true,
                    maxLength: 100,
                },
                {
                    type: Command.OptionType.String,
                    name: 'code',
                    description:
                        'The code to evaluate, emitting this will cause a modal to appear.',
                    maxLength: 900,
                },
                {
                    type: Command.OptionType.String,
                    name: 'input',
                    description: 'The input to provide to the program, if any.',
                    maxLength: 450,
                },

                {
                    type: Command.OptionType.String,
                    name: 'args',
                    description:
                        'The additional command line arguments to provide to the program, if any.',
                    maxLength: 450,
                },
            ],
        });
    }

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const query = autocomplete.options.getFocused();
        const langs = await this.container.executor.searchLanguages(query);

        return autocomplete.respond(
            langs.map(lang => ({
                name: lang.name,
                value: lang.key,
            }))
        );
    }

    public override async onSlash(input: Command.ChatInput) {
        return input.showModal(
            buildExecuteModal({
                language: await this.container.executor.findLanguage(
                    input.options.getString('language', true)
                ),
                code: input.options.getString('code') ?? '',
                input: input.options.getString('input') ?? '',
                args: input.options.getString('args') ?? '',
            })
        );
    }
}
