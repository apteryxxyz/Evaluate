import Fuse from 'fuse.js';
import { LRUCache } from 'lru-cache';
import { Command } from 'maclary';
import { Snippets } from '&builders/snippets';
import { Snippet } from '&entities/Snippet';
import { User } from '&entities/User';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class SnippetViewCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'view',
            description: 'View any one of your saved code snippets.',

            preconditions: [BeforeCommand],
            options: [
                {
                    type: Command.OptionType.String,
                    autocomplete: true,
                    name: 'name',
                    required: true,
                    description: 'The name of the snippet to view.',
                },
            ],
        });
    }

    private _cache = new LRUCache<string, Snippet[]>({
        ttl: 1_000 * 10,
        ttlAutopurge: true,
    });

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const query = autocomplete.options.getFocused();

        let snippets = this._cache.get(autocomplete.user.id);
        if (!snippets) {
            const user = await this.container.database
                .repository(User)
                .ensureUser(autocomplete.user.id, { relations: ['snippets'] });
            if (!user) return autocomplete.respond([]);

            snippets = user.snippets;
            this._cache.set(autocomplete.user.id, snippets);
        }

        if (!snippets.length) return autocomplete.respond([]);

        let results;
        if (query) {
            const keys = ['name', 'language', 'code'];
            const fuse = new Fuse(snippets, { keys, threshold: 0.3 });
            results = fuse.search(query).map(({ item }) => item);
        } else {
            results = snippets;
        }

        const choices = results.map(snippet => ({
            name: snippet.name,
            value: snippet.id,
        }));

        return autocomplete.respond(choices);
    }

    public override async onSlash(input: Command.ChatInput) {
        this._cache.delete(input.user.id);

        const id = input.options.getString('name', true);
        const snippet = await this.container.database
            .repository(Snippet)
            .findOneBy({ id });

        if (!snippet)
            return input.reply({
                content: 'Could not find that snippet.',
                ephemeral: true,
            });

        return input.reply({
            embeds: [await new Snippets.ViewEmbed(snippet)],
            components: [new Snippets.ViewComponents(snippet)],
        });
    }
}
