import { Action } from 'maclary';
import { Execute } from '&builders/execute';
import { Snippet } from '&entities/Snippet';

export class SnippetAction extends Action {
    public constructor() {
        super({ id: 'snippet' });
    }

    public override async onButton(click: Action.Button) {
        const [, snippetId, action] = click.customId.split(',');

        const snippet = await this.container.database
            .repository(Snippet)
            .findOneBy({ id: snippetId });
        if (!snippet)
            return click.reply({
                content: 'Snippet no longer exists, try again.',
                ephemeral: true,
            });

        if (action === 'run') {
            const language = (await this.container.executor //
                .findLanguage(snippet.language))!;
            const options = { ...snippet, language };
            return click.showModal(new Execute.CreateModal(options));
        }

        return void 0;
    }
}
