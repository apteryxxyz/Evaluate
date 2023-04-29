import { Command } from 'maclary';
import {
    buildExecuteModal,
    buildExecuteResultPayload,
} from '&factories/executor';
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
        const langs = await this.container.executor.searchLanguages(query);

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
        if (!rawLang && code.length > 0)
            rawLang = await this.container.detector.detectLanguage({
                code,
            });
        const language = rawLang
            ? await this.container.executor.findLanguage(rawLang)
            : undefined;

        if (!code || !language) {
            const modal = buildExecuteModal({ language, code });
            return input.showModal(modal);
        }

        const message = await input.deferReply({ fetchReply: true });
        const evaluator = this.container.evaluators.create(input.user, message);

        const options = { language, code, input: '', args: '' };
        const result = await evaluator.runWithOptions(options);
        const payload = await buildExecuteResultPayload(result);
        return input.editReply(payload);
    }
}
