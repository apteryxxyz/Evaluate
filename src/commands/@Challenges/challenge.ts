import { LRUCache } from 'lru-cache';
import { Command } from 'maclary';
import { Challenges } from '&builders/challenges';
import { Challenge } from '&entities/Challenge';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class ChallengeCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'challenge',
            description:
                'See the latest code challenge and submit your solution.',

            preconditions: [BeforeCommand],
            options: [
                {
                    name: 'challenge',
                    description: 'The challenge to view, defaults to latest.',
                    type: Command.OptionType.Number,
                    autocomplete: true,
                },
            ],
        });
    }

    private _challengeListCache = new LRUCache<string, Challenge[]>({
        ttl: 1_000 * 60 * 5,
        ttlAutopurge: true,
    });

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const query = autocomplete.options.getFocused();

        let challenges = this._challengeListCache.get(query);
        if (!challenges) {
            challenges = await this.container.database
                .repository(Challenge)
                .searchQuery(query);
            this._challengeListCache.set(query, challenges);
        }

        return autocomplete.respond(
            challenges.map(challenge => ({
                name: challenge.toString(),
                value: challenge.id,
            }))
        );
    }

    public override async onSlash(input: Command.ChatInput) {
        const repository = this.container.database.repository(Challenge);
        const challengeId = input.options.getNumber('challenge');
        const challenge = challengeId
            ? await repository.findOne({
                  where: { id: challengeId },
                  relations: ['submissions'],
              })
            : await repository.getLatest();

        if (!challenge)
            return input.reply('Could not find a challenge with that ID.');

        return input.reply({
            embeds: [new Challenges.ViewEmbed(challenge)],
            components: [new Challenges.ViewComponents(challenge)],
        });
    }
}
