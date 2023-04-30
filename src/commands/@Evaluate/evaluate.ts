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
                    autocomplete: true,
                    required: true,
                    name: 'language',
                    description: Execute.Constants.strings.language,
                    minLength: Execute.Constants.lengths.language[0],
                    maxLength: Execute.Constants.lengths.language[1],
                },
                {
                    type: Command.OptionType.String,
                    name: 'code',
                    description: Execute.Constants.strings.code,
                    minLength: Execute.Constants.lengths.code[0],
                    maxLength: Execute.Constants.lengths.code[1],
                },
                {
                    type: Command.OptionType.String,
                    name: 'input',
                    description: Execute.Constants.strings.input,
                    minLength: Execute.Constants.lengths.input[0],
                    maxLength: Execute.Constants.lengths.input[1],
                },
                {
                    type: Command.OptionType.String,
                    name: 'args',
                    description: Execute.Constants.strings.args,
                    minLength: Execute.Constants.lengths.args[0],
                    maxLength: Execute.Constants.lengths.args[1],
                },
            ],
        });
    }

    private _cache = new LRUCache<string, Executor.Language[]>({
        ttl: 1_000 * 60 * 5,
        ttlAutopurge: true,
    });

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const query = autocomplete.options.getFocused();

        let languages = this._cache.get(autocomplete.user.id);
        if (!languages) {
            languages = await this.container.executor.searchLanguages(query);
            this._cache.set(autocomplete.user.id, languages);
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
