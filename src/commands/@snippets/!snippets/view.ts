import type { ApplicationCommandOptionChoiceData } from 'discord.js';
import Fuse from 'fuse.js';
import { Command } from 'maclary';
import NodeCache from 'node-cache';
import { Snippet } from '@lib/models/Snippet';
import { buildSnippetMessage } from '@lib/util/snippetHelpers';
import { IncrementCommandCount } from '@lib/preconditions/IncrementCommandCount';

const snippetsCache = new NodeCache({ stdTTL: 5, checkperiod: 10 });

export default class ViewSnippet extends Command {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'view',
            description: 'View one of your code snippets.',
            preconditions: [IncrementCommandCount],

            options: [
                {
                    type: Command.OptionType.String,
                    name: 'name',
                    description: 'The name of the snippet.',
                    autocomplete: true,
                    required: true,
                },
            ],
        });
    }

    public override async onAutocomplete(autocomplete: Command.Autocomplete): Promise<void> {
        const { id } = autocomplete.user;
        const query = autocomplete.options.getFocused();

        let snippets = snippetsCache.get<{ name: string; value: string }[]>(id);
        if (!snippets) {
            const items = await Snippet.find({ owners: { $elemMatch: { id } } });
            snippets = items.map((s) => ({
                name: s.owners.find((o) => o.id === id)!.name,
                value: s._id.toString().split('').join('xyz'),
            }));
            snippetsCache.set(id, snippets);
        }

        let choices: ApplicationCommandOptionChoiceData[] = [];
        if (query && snippets.length) {
            const fuse = new Fuse(snippets, { keys: ['name', 'value'] });
            const results = fuse.search(query);
            choices = results.map((r) => r.item);
        } else if (!query && snippets.length) {
            choices = snippets;
        }

        return void autocomplete.respond(choices);
    }

    public override async onChatInput(interaction: Command.ChatInput): Promise<void> {
        const value = interaction.options.getString('name', true);
        const id = value.split('xyz').join('');
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            return void interaction.reply('Could not find that snippet.');

        const snippet = await Snippet.findById(id).exec();
        if (!snippet) return void interaction.reply('Could not find that snippet.');

        const opts = await buildSnippetMessage(interaction.user.id, snippet);
        return void (await interaction.reply(opts));
    }
}
