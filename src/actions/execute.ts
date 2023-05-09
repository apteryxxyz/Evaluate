import { Action } from 'maclary';
import { Execute } from '&builders/execute';
import { Snippets } from '&builders/snippets';
import { Snippet } from '&entities/Snippet';
import { User } from '&entities/User';
import { resolveEmoji } from '&functions/resolveEmoji';

export class ExecuteAction extends Action {
    public constructor() {
        super({ id: 'execute' });
    }

    public override async onModalSubmit(submit: Action.ModalSubmit) {
        const rawLang = submit.fields.getTextInputValue('language');
        const code = submit.fields.getTextInputValue('code');
        const input = submit.fields.getTextInputValue('input');
        const args = submit.fields.getTextInputValue('args');

        const [, action] = submit.customId.split(',');

        let evaluator = null;
        if (action === 'create') {
            const message = await submit.reply({
                content: `${resolveEmoji('loading')} Executing...`,
                fetchReply: true,
            });
            evaluator = this.container.evaluators.create(submit.user, message);
        } else if (action === 'edit') {
            evaluator = this.container.evaluators.resolve(submit);
            await submit.deferUpdate();
            await evaluator?.message.edit({
                content: `${resolveEmoji('loading')} Executing...`,
                components: [new Execute.ResultComponents(evaluator, true)],
            });
        }

        if (!evaluator) return void 0;

        const language = await this.container.executor.findLanguage(rawLang);
        if (!language) {
            return evaluator.message.edit({
                embeds: [new Execute.InvalidLanguageEmbed()],
                components: [new Execute.InvalidLanguageComponents()],
            });
        }

        await evaluator.runWithOptions({ language, code, input, args });
        return evaluator.message.edit({
            content: null,
            embeds: [await new Execute.ResultEmbed(evaluator)],
            components: [new Execute.ResultComponents(evaluator)],
        });
    }

    public override async onButton(click: Action.Button) {
        const [, action] = click.customId.split(',');

        if (action === 'create') {
            return click.showModal(new Execute.CreateModal({}));
        }

        const evaluator = this.container.evaluators.resolve(click);
        if (!evaluator) return void 0;

        const result = evaluator.history.at(-1)!;

        if (action === 'edit') {
            return click.showModal(new Execute.EditModal(result ?? {}));
        }

        if (action === 'undo') {
            evaluator.history.pop();
            return click.update({
                embeds: [await new Execute.ResultEmbed(evaluator)],
                components: [new Execute.ResultComponents(evaluator)],
            });
        }

        if (action === 'delete') {
            await click.deferUpdate();
            return evaluator.destroy(true);
        }

        if (action === 'capture') {
            await click.deferReply();
            const image = await evaluator.capture();
            return click.editReply({ files: [image] });
        }

        if (action === 'save') {
            const user = await this.container.database
                .repository(User)
                .ensure(click.user.id, { relations: ['snippets'] });

            if (user.snippets.length >= 25) {
                return click.reply({
                    content:
                        'You have reached the maximum snippet limit, delete some snippets to save more.',
                    ephemeral: true,
                });
            }

            const isExistingSnippet = user.snippets.some(
                snippet =>
                    snippet.language === result.language.key &&
                    snippet.code === result.code &&
                    snippet.input === result.input &&
                    snippet.args === result.args
            );
            if (isExistingSnippet) {
                return click.reply({
                    content: 'You already have this snippet saved.',
                    ephemeral: true,
                });
            }

            await click.showModal(new Snippets.SaveModal());
            const submit = await click
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
            snippet.ownerId = user.id;
            snippet.owner = user;
            snippet.name = name;
            snippet.language = result.language.key;
            snippet.code = result.code;
            snippet.input = result.input;
            snippet.args = result.args;
            await snippet.save();

            return submit.reply({
                content: `Snippet saved successfully as \`${name}\`.`,
                ephemeral: true,
            });
        }
    }
}
