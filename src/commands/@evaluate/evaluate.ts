import { IncrementCommandCount } from '@lib/preconditions/IncrementCommandCount';
import { Piston } from '@lib/providers/Piston';
import { buildEvaluateModal } from '@lib/util/evaluateHelpers';
import { mostPopularLanguages } from '@lib/util/statisticsTracking';
import { Command } from 'maclary';

let CACHE: { name: string; value: string }[] = [];
const CACHE_INTERVAL = 10_000;

export default class Evaluate extends Command {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'evaluate',
            description: 'Evaluate a piece of code in a given programming language.',
            preconditions: [IncrementCommandCount],

            options: [
                {
                    type: Command.OptionType.String,
                    autocomplete: true,
                    name: 'language',
                    description: 'The language to evaluate the code in.',
                    required: true,
                },
            ],
        });

        setInterval(async function _() {
            const latest = await mostPopularLanguages();
            CACHE = latest.slice(0, 5).map((l) => ({ name: l, value: l }));
        }, CACHE_INTERVAL);
    }

    public override async onAutocomplete(autocomplete: Command.Autocomplete): Promise<void> {
        const query = autocomplete.options.getFocused();
        if (query.length < 3) return void (await autocomplete.respond(CACHE));

        const piston = this.container.providers.cache.get(Piston.id)!;
        const choices = await piston.languageAutocomplete(query);
        return void (await autocomplete.respond(choices));
    }

    public override async onChatInput(interaction: Command.ChatInput): Promise<void> {
        const language = interaction.options.getString('language') ?? undefined;
        const modal = buildEvaluateModal({ language }).setCustomId(`eval,initial,${Piston.id}`);
        return void (await interaction.showModal(modal));
    }
}
