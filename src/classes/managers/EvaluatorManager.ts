import { Collection } from 'discord.js';
import type { Action } from 'maclary';
import { Command } from 'maclary';
import { Execute } from '&builders/execute';
import { Evaluator } from '&classes/structures/Evaluator';

export class EvaluatorManager {
    public cache = new Collection<string, Evaluator>();

    /** Create a new evaluator and cache it. */
    public create(...args: ConstructorParameters<typeof Evaluator>) {
        const evaluator = new Evaluator(...args);
        this.cache.set(evaluator.message.id, evaluator);
        return evaluator;
    }

    /** Resolve an evaluator from an interaction. */
    public resolve(
        interaction: Action.Button | Action.ModalSubmit | Action.AnySelectMenu
    ) {
        if (!(interaction.message instanceof Command.Message))
            return void interaction.reply({
                content:
                    'This evaluation command has failed to load, ' +
                    'create a new one using the button below.',
                components: [new Execute.StartButton()],
                ephemeral: true,
            });

        const evaluator = this.cache.get(interaction.message.id);

        if (!evaluator)
            return void interaction.reply({
                content:
                    'This evaluate command has failed to load, ' +
                    'create a new one using the button below.',
                components: [new Execute.StartButton()],
                ephemeral: true,
            });

        if (interaction.user.id !== evaluator.user.id)
            return void interaction.reply({
                content:
                    'You do not have access to this evaluate command, ' +
                    'create your own using the button below.',
                components: [new Execute.StartButton()],
                ephemeral: true,
            });

        return evaluator;
    }
}
