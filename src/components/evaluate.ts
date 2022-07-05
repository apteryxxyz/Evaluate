import { Lexer, longShortStrategy, Parser } from 'lexure';
import { Component } from 'maclary';
import { Snippet } from '@lib/models/Snippet';
import { Piston } from '@lib/providers/Piston';
import {
    buildEvaluateMessage,
    buildEvaluateModal,
    getAndVerifyEvaluator,
} from '@lib/util/evaluateHelpers';
import { buildSnippetModal } from '@lib/util/snippetHelpers';

export class EvalHandler extends Component {
    public constructor() {
        super({ id: 'eval' });
    }

    public override async onModalSubmit(modal: Component.MessageModalSubmit): Promise<void> {
        const language = modal.fields.getTextInputValue('language');
        const code = modal.fields.getTextInputValue('code');
        const input = modal.fields.getTextInputValue('input');
        const stringArgs = modal.fields.getTextInputValue('args');

        const tokens = new Lexer(stringArgs)
            .setQuotes([
                ['"', '"'],
                ['“', '”'],
            ])
            .lex();
        const parser = new Parser(tokens).setUnorderedStrategy(longShortStrategy());
        const args = parser.parse().ordered.map((token) => token.value);

        const [, action] = modal.customId.split(',');

        if (action === 'initial') {
            const message = await modal.deferReply({ fetchReply: true });
            const providerId = modal.customId.split(',')[2];
            const provider = this.container.providers.cache.get(providerId)!;
            const evaluator = await this.container.evaluators.create(
                modal.user,
                message,
                modal as any,
            );
            evaluator.setProvider(provider, false);

            const success = await evaluator.updateInputs({ language, code, input, args });
            if (!success) return;

            await evaluator.evaluate(false);
            await modal.editReply(await buildEvaluateMessage(evaluator));
            return void 0;
        }

        if (action === 'edit') {
            await modal.deferUpdate();
            const evaluator = getAndVerifyEvaluator(modal);
            if (!evaluator) return;

            const success = await evaluator.updateInputs({ language, code, input, args });
            if (!success) return;

            await evaluator.evaluate(false);
            await modal.editReply(await buildEvaluateMessage(evaluator));
            return void 0;
        }
    }

    public override async onButton(button: Component.Button): Promise<void> {
        const [, action] = button.customId.split(',');

        if (action === 'start') {
            const modal = buildEvaluateModal().setCustomId(`eval,initial,${Piston.id}`);
            return void (await button.showModal(modal));
        }

        const evalautor = getAndVerifyEvaluator(button);
        if (!evalautor) return;

        const { language, code, input, args } = evalautor;
        const opts = { language: language.pretty, code, input, args } as any;
        Object.keys(opts).forEach((key) => opts[key] === undefined && delete opts[key]);

        if (action === 'edit') {
            const modal = buildEvaluateModal(opts).setCustomId('eval,edit');
            return void (await button.showModal(modal));
        }

        if (action === 'snippet') {
            let snippet = await Snippet.findOne({
                providerId: evalautor.provider.id,
                options: opts,
            });
            if (!snippet)
                snippet = await Snippet.create({
                    providerId: evalautor.provider.id,
                    options: opts,
                });

            if (snippet.owners.some((owner) => owner.id === button.user.id))
                return void button.reply({
                    content: 'You already have this as a snippet.',
                    ephemeral: true,
                });

            const modal = buildSnippetModal().setCustomId(`snippet,${snippet._id},addOwner`);
            await button.showModal(modal);
        }
    }
}
