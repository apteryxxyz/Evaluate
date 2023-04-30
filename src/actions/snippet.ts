import { Action } from 'maclary';
import { Snippet } from '&entities/Snippet';
import { buildExecuteResultPayload } from '&factories/executor';

export class SnippetAction extends Action {
    public constructor() {
        super({ id: 'snippet' });
    }

    public override async onButton(button: Action.Button) {
        const [, snippetId, action] = button.customId.split(',');

        const snippet = await this.container.database
            .repository(Snippet)
            .findOneBy({ id: snippetId });
        if (!snippet)
            return button.reply({
                content: 'Snippet no longer exists, try again.',
                ephemeral: true,
            });

        if (action === 'run') {
            const message = await button.deferReply({ fetchReply: true });
            const params = [button.user, message] as const;
            const evaluator = this.container.evaluators.create(...params);

            const language = (await this.container.executor.findLanguage(
                snippet.language
            ))!;
            const options = { ...snippet, language };

            const result = await evaluator.runWithOptions(options);
            const payload = await buildExecuteResultPayload(result);
            return button.editReply(payload);
        }

        return void 0;
    }
}
