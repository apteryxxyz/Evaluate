import type { Message, MessageComponentInteraction, User } from 'discord.js';
import { MapManager } from 'maclary';
import { Evaluator, Events } from '@lib/structures/Evaluator';
import { buildEvaluateMessage, buildTryAgainButton } from '@lib/util/evaluateHelpers';

export class EvaluatorManager extends MapManager<string, Evaluator> {
    /**
     * Create an instance of Evaluator.
     * @param user The user that is creating the evaluator
     * @param message The message that the evaluator is being created for
     * @param interaction The interaction that the evaluator is being created for
     */
    public create(
        user: User,
        message: Message,
        interaction: MessageComponentInteraction,
    ): Promise<Evaluator> {
        const evaluator = new Evaluator(user, message);
        this.cache.set(message.id, evaluator);

        evaluator.on(Events.InvalidLanguage, async (name: string) => {
            const content = `Inputted language/runtime/version \`${name}\` could not be found or it is not supported.`;
            const tryAgain = buildTryAgainButton(true);
            const opts = { content, embeds: [], components: [tryAgain] };

            // In some cases, the interaction may not have been replied to yet
            if (interaction.replied) await message.edit(opts);
            else await interaction.editReply(opts);
        });

        evaluator.on(Events.EvaluationComplete, async () => {
            await message.edit(await buildEvaluateMessage(evaluator));
        });

        evaluator.on(Events.ProviderUpdated, async () => {
            await evaluator.evaluate(true);
        });

        return Promise.resolve(evaluator);
    }
}
