import { setTimeout } from 'node:timers';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord.js';
import Fuse from 'fuse.js';
import { Command } from 'maclary';
import { Snippet } from '&entities/Snippet';
import { User } from '&entities/User';
import { IncrementCommandCount } from '&preconditions/IncrementCommandCount';

export class SnippetDeleteCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'delete',
            description: 'Delete any one of your saved code snippets.',

            preconditions: [IncrementCommandCount],
            options: [
                {
                    type: Command.OptionType.String,
                    autocomplete: true,
                    name: 'name',
                    required: true,
                    description: 'The name of the snippet to delete.',
                },
            ],
        });
    }

    private _cache: Map<string, Snippet[]> = new Map();

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const query = autocomplete.options.getFocused();

        let snippets = this._cache.get(autocomplete.user.id);
        if (!snippets) {
            const user = await this.container.database
                .repository(User)
                .findOne({
                    where: { id: autocomplete.user.id },
                    relations: ['snippets'],
                });
            if (!user) return autocomplete.respond([]);

            snippets = user.snippets;

            this._cache.set(autocomplete.user.id, snippets);
            setTimeout(
                () => this._cache.delete(autocomplete.user.id),
                1_000 * 60 * 5
            );
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
        const repository = this.container.database.repository(Snippet);
        const snippet = await repository.findOneBy({ id });

        if (!snippet)
            return input.reply({
                content: 'Could not find that snippet.',
                ephemeral: true,
            });

        // const payload = buildDeleteSnippetPayload(snippet);
        const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
                .setCustomId('_')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger)
        );

        const reply = await input.reply({
            content: 'Are you sure you want to delete this snippet?',
            components: [button],
            fetchReply: true,
        });

        return reply
            .awaitMessageComponent({
                componentType: ComponentType.Button,
                filter: ({ user }) => user.id === input.user.id,
                time: 1_000 * 60 * 5,
            })
            .then(async click => {
                await click.deferUpdate();
                await repository.remove(snippet);
                return input.editReply({
                    content: 'Snippet successfully deleted.',
                    components: [],
                });
            })
            .catch(() => null);
    }
}
