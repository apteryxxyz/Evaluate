import { Lexer, Parser, longShortStrategy } from 'lexure';
import { Action } from 'maclary';
import { CaptureBuilder } from '&builders/CaptureBuilder';
import { EvaluateBuilder } from '&builders/EvaluateBuilder';

export class EvaluatorAction extends Action {
    public constructor() {
        super({ id: 'evaluator' });
    }

    public override async onModalSubmit(modal: Action.MessageModalSubmit) {
        const lang = modal.fields.getTextInputValue('language');
        const code = modal.fields.getTextInputValue('code');
        const input = modal.fields.getTextInputValue('input');
        const args = this._parseArgs(modal.fields.getTextInputValue('args'));

        const [, action] = modal.customId.split(',');

        let evaluator = null;
        if (action === 'create') {
            const message = await modal.deferReply({ fetchReply: true });
            evaluator = this.container.evaluators.create(modal.user, message);
        } else if (action === 'edit') {
            await modal.deferUpdate();
            evaluator = this.container.evaluators.resolve(modal);
        }

        if (!evaluator) return void 0;

        const language = await this.container.executor.resolveLanguage(lang);

        let payload = null;
        if (language) {
            const options = { language, code, input, args };
            const result = await evaluator.runWithOptions(options);
            payload = await EvaluateBuilder.buildResultPayload(result);
        } else {
            payload = EvaluateBuilder.buildInvalidLanguagePayload();
        }

        await modal.editReply(payload);

        return void 0;
    }

    public override async onButton(button: Action.Button) {
        const [, action] = button.customId.split(',');

        const evaluator = this.container.evaluators.resolve(button);
        if (!evaluator) return void 0;

        const options = evaluator.history.at(-1)!;

        if (action === 'edit') {
            const modal = EvaluateBuilder.buildEditModal(options ?? {}) //
                .setCustomId(`evaluator,edit`);
            return button.showModal(modal);
        }

        if (action === 'capture') {
            await button.deferReply();
            const payload = await CaptureBuilder.buildCapturePayload(
                button.user.id,
                { code: options.code, language: options.language }
            );
            return button.editReply(payload);
        }
    }

    private _parseArgs(args: string) {
        const tokens = new Lexer(args)
            .setQuotes([
                ['"', '"'],
                ['“', '”'],
            ])
            .lex();

        return new Parser(tokens)
            .setUnorderedStrategy(longShortStrategy())
            .parse()
            .ordered.map(token => token.value);
    }
}
