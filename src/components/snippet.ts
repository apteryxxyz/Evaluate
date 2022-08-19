import { Component } from 'maclary';
import { Snippet } from '@models/Snippet';
import { buildEvaluateMessage } from '@util/evaluateHelpers';

export class SnippetHandler extends Component {
    public constructor() {
        super({ id: 'snippet' });
    }

    public override async onModalSubmit(modal: Component.MessageModalSubmit): Promise<void> {
        const [, snippetId, action] = modal.customId.split(',');

        const snippet = await Snippet.findOne({ _id: snippetId });
        if (!snippet)
            return void modal.reply({
                content: 'Snippet no longer exists, try again.',
                ephemeral: true,
            });

        if (action === 'addOwner') {
            const { id } = modal.user;
            const name = modal.fields.getTextInputValue('name');

            if (snippet.owners.some((owner) => owner.id === id))
                return void modal.reply({
                    content: 'You already have this as a snippet.',
                    ephemeral: true,
                });

            const existingAll = await Snippet.find({ owners: { $elemMatch: { id } } });
            if (existingAll.length >= 25) {
                return void modal.reply({
                    content: 'You already have the max 25 snippets, remove one to add more.',
                    ephemeral: true,
                });
            }

            const existingName = existingAll.find((owned) =>
                owned.owners.some((o) => o.name === name),
            );
            if (existingName)
                return void modal.reply({
                    content: 'You already have a snippet with that name.',
                    ephemeral: true,
                });

            snippet.owners.push({ id, name, addedAt: new Date() });
            await snippet.save();

            return void modal.reply({
                content: `Successfully created snippet!`,
                ephemeral: true,
            });
        }
    }

    public override async onButton(button: Component.Button): Promise<void> {
        const [, snippetId, userId, action] = button.customId.split(',');

        const snippet = await Snippet.findById(snippetId);
        if (!snippet)
            return void button.reply({
                content: 'Snippet no longer exists, try again.',
                ephemeral: true,
            });

        if (userId !== button.user.id)
            return void button.reply({
                content: 'You do not have permission to edit this snippet.',
                ephemeral: true,
            });

        if (action === 'run') {
            const { providerId, options } = snippet;
            const message = await button.deferReply({ fetchReply: true });
            const provider = this.container.providers.cache.get(providerId)!;

            const evaluator = await this.container.evaluators.create(button.user, message, button);
            evaluator.setProvider(provider, false);

            const success = await evaluator.updateInputs(options);
            if (!success) return;

            await evaluator.evaluate(false);
            const opts = await buildEvaluateMessage(evaluator);
            opts.components[0].components.length = 1;
            await button.editReply(opts);
            return void 0;
        }
    }
}
