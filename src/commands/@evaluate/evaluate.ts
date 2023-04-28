import { Command } from 'maclary';
import { EvaluateBuilder } from '&builders/EvaluateBuilder';
import { detectLanguage } from '&functions/detectLanguage';
import { IncrementCommandCount } from '&preconditions/IncrementCommandCount';

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

            preconditions: [IncrementCommandCount],
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'code',
                    description:
                        'The code to evaluate, emitting this will cause a modal to appear.',
                    maxLength: 900,
                },
                {
                    type: Command.OptionType.String,
                    autocomplete: true,
                    name: 'language',
                    description:
                        'Specify the programming language to evaluate in, or let the bot detect it.',
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
        const code = input.options.getString('code') ?? '';

        let rawLang = input.options.getString('language') ?? undefined;
        if (!rawLang && code.length > 0) rawLang = await detectLanguage(code);
        const language = rawLang
            ? await this.container.executor.resolveLanguage(rawLang)
            : undefined;

        if (code && language) {
            const message = await input.deferReply({ fetchReply: true });
            const params = [input.user, message] as const;
            const evaluator = this.container.evaluators.create(...params);

            const options = { language, code, input: '', args: [] };
            const result = await evaluator.runWithOptions(options);
            const payload = await EvaluateBuilder.buildResultPayload(result);
            return input.editReply(payload);
        }

        const modal = EvaluateBuilder.buildEditModal({ language, code });
        return input.showModal(modal);
    }
}
