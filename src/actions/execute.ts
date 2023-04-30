import { Action } from 'maclary';
import { Snippet } from '&entities/Snippet';
import { User } from '&entities/User';
import {
    buildExecuteModal,
    buildExecuteResultPayload,
    buildInvalidLanguagePayload,
} from '&factories/executor';
import { buildRenderAttachmentPayload } from '&factories/renderer';
import { buildSnippetSaveModal } from '&factories/snippet';

export class EvaluatorAction extends Action {
    public constructor() {
        super({ id: 'execute' });
    }

    public override async onModalSubmit(modal: Action.MessageModalSubmit) {
        const lang = modal.fields.getTextInputValue('language');
        const code = modal.fields.getTextInputValue('code');
        const input = modal.fields.getTextInputValue('input');
        const args = modal.fields.getTextInputValue('args');

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

        const language = await this.container.executor.findLanguage(lang);

        let payload = null;
        if (language) {
            const options = { language, code, input, args };
            const result = await evaluator.runWithOptions(options);
            payload = await buildExecuteResultPayload(result);
        } else {
            payload = buildInvalidLanguagePayload();
        }

        await modal.editReply(payload);

        return void 0;
    }

    public override async onButton(button: Action.Button) {
        const [, action] = button.customId.split(',');

        if (action === 'create') {
            const modal = buildExecuteModal({});
            return button.showModal(modal);
        }

        const evaluator = this.container.evaluators.resolve(button);
        if (!evaluator) return void 0;

        const options = evaluator.history.at(-1)!;

        if (action === 'edit') {
            const modal = buildExecuteModal(options ?? {}) //
                .setCustomId(`execute,edit`);
            return button.showModal(modal);
        }

        if (action === 'capture') {
            await button.deferReply();
            const image = await this.container.renderer.createRender(
                options,
                button.user.id
            );

            const payload = buildRenderAttachmentPayload(image);
            return button.editReply(payload);
        }

        if (action === 'save') {
            const snippetRepository =
                this.container.database.repository(Snippet);
            const user = await this.container.database
                .repository(User)
                .ensureUser(button.user.id, { relations: ['snippets'] });

            if (user.snippets.length >= 25) {
                return button.reply({
                    content:
                        'You have reached the maximum snippet limit, delete some snippets to save more.',
                    ephemeral: true,
                });
            }

            const isExistingSnippet = user.snippets.some(
                snippet =>
                    snippet.language === options.language.key &&
                    snippet.code === options.code &&
                    snippet.input === options.input &&
                    snippet.args === options.args
            );
            if (isExistingSnippet) {
                return button.reply({
                    content: 'You already have this snippet saved.',
                    ephemeral: true,
                });
            }

            const nameModal = buildSnippetSaveModal(button.message.id);
            await button.showModal(nameModal);

            const submit = await button
                .awaitModalSubmit({ time: 3_600_000 })
                .catch(() => null);
            if (!submit) return void 0;

            const name = submit.fields.getTextInputValue('name');
            if (name.length < 4 || name.length > 25) {
                return submit.reply({
                    content:
                        'Snippet names must be between 4 and 25 characters.',
                    ephemeral: true,
                });
            }

            const snippet = new Snippet();
            snippet.id = submit.id;
            snippet.user = user;
            snippet.name = name;
            snippet.language = options.language.key;
            snippet.code = options.code;
            snippet.input = options.input;
            snippet.args = options.args;
            await snippetRepository.save(snippet);

            return submit.reply({
                content: `Snippet saved successfully as \`${name}\`.`,
                ephemeral: true,
            });
        }
    }
}
