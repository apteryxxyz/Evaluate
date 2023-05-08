import { LRUCache } from 'lru-cache';
import { Command } from 'maclary';
import { Execute } from '&builders/execute';
import { BeforeCommand } from '&preconditions/BeforeCommand';
import type { Executor } from '&services/Executor';

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
                'Evaluate any piece of code in any language with optional input and command line arguments.',

            preconditions: [BeforeCommand],
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'language',
                    description: 'The language to execute in.',
                    autocomplete: true,
                    required: true,
                    minLength: Execute.Constants.lengths.language[0],
                    maxLength: Execute.Constants.lengths.language[1],
                },
                {
                    type: Command.OptionType.String,
                    name: 'code',
                    description:
                        'The code to execute, omitting this option will prompt you for the code.',
                    minLength: Execute.Constants.lengths.code[0],
                    maxLength: Execute.Constants.lengths.code[1],
                },
                {
                    type: Command.OptionType.String,
                    name: 'input',
                    description: 'The input to provide to the program.',
                    minLength: Execute.Constants.lengths.input[0],
                    maxLength: Execute.Constants.lengths.input[1],
                },
                {
                    type: Command.OptionType.String,
                    name: 'args',
                    description:
                        'Additional command line arguments to provide to the program.',
                    minLength: Execute.Constants.lengths.args[0],
                    maxLength: Execute.Constants.lengths.args[1],
                },
            ],
        });
    }

    private _languageListCache = new LRUCache<string, Executor.Language[]>({
        ttl: 1_000 * 60 * 5,
        ttlAutopurge: true,
    });

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const query = autocomplete.options.getFocused();

        let languages = this._languageListCache.get(query);
        if (!languages) {
            languages = await this.container.executor.searchLanguages(query);
            this._languageListCache.set(query, languages);
        }

        return autocomplete.respond(
            languages.map(lang => ({
                name: lang.name,
                value: lang.key,
            }))
        );
    }

    public override async onSlash(input: Command.ChatInput) {
        return input.showModal(
            new Execute.CreateModal({
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
