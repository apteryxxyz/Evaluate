import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { TextInputStyle } from 'discord.js';
import Fuse from 'fuse.js';
import { LRUCache } from 'lru-cache';
import type { Action } from 'maclary';
import { Command } from 'maclary';
import { Guild } from '&entities/Guild';
import { User } from '&entities/User';
import { deferReply } from '&functions/loadingPrefix';
import { BeforeCommand } from '&preconditions/BeforeCommand';
import premium from '&premium';
import { Renderer } from '&services/Renderer';

export class Capture extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'capture',
            description: 'Convert a piece of code into a beautiful image.',

            preconditions: [BeforeCommand],
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'code',
                    description:
                        'The code to convert into an image, for multi-line code omit this option.',
                    maxLength: 900,
                },
                {
                    type: Command.OptionType.String,
                    name: 'mode',
                    description: 'Dark or light mode, defaults to light.',
                    choices: Object.entries(Renderer.Mode) //
                        .map(([name, value]) => ({ name, value })),
                },
                {
                    type: Command.OptionType.String,
                    name: 'theme',
                    description: 'The theme to use, unlock more with premium.',
                    autocomplete: true,
                },
            ],
        });
    }

    private _userHasPremiumCache = new LRUCache<string, boolean>({
        ttl: 1_000 * 40,
        ttlAutopurge: true,
    });

    private _guildHasPremiumCache = new LRUCache<string, boolean>({
        ttl: 1_000 * 40,
        ttlAutopurge: true,
    });

    public override async onAutocomplete(autocomplete: Command.Autocomplete) {
        const query = autocomplete.options.getFocused();

        let userHasPremium = this._userHasPremiumCache.get(
            autocomplete.user.id
        );
        let guildHasPremium = autocomplete.guild
            ? this._guildHasPremiumCache.get(autocomplete.guild.id)
            : false;

        if (typeof userHasPremium !== 'boolean') {
            const user = await this.container.database
                .repository(User)
                .findOneBy({ id: autocomplete.user.id });

            userHasPremium = user?.hasPremium ?? false;
            this._userHasPremiumCache.set(autocomplete.user.id, userHasPremium);
        }

        if (typeof guildHasPremium !== 'boolean' && autocomplete.guild) {
            const guild = await this.container.database
                .repository(Guild)
                .findOneBy({ id: autocomplete.guild.id });

            guildHasPremium = guild?.hasPremium ?? false;
            this._guildHasPremiumCache.set(
                autocomplete.guild.id,
                guildHasPremium
            );
        }

        const available = premium.capture.themes
            .determine(userHasPremium, guildHasPremium)
            .map(([name, value]) => ({ name, value }));
        const fuse = new Fuse(available, { keys: ['name'] });

        const themes =
            query.length > 0
                ? fuse.search(query).map(({ item }) => item)
                : available;
        return autocomplete.respond(themes);
    }

    public override async onSlash(input: Command.ChatInput) {
        let action: Action.AnyInteraction | Command.AnyInteraction = input;
        let code = input.options.getString('code');
        const mode = input.options
            .getString('mode')
            ?.toLowerCase() as Renderer.Mode;
        const theme = input.options
            .getString('theme')
            ?.toLowerCase() as Renderer.Theme;

        const available = premium.capture.themes //
            .determine(input.user.entity!.hasPremium);
        if (theme && !available.some(([, value]) => value === theme))
            return void input.reply({
                content:
                    'You do not have access to this theme, ' +
                    'upgrade to premium to unlock more.',
                ephemeral: true,
            });

        if (!code) {
            await input.showModal(this._buildModal());

            const submit = await input
                .awaitModalSubmit({ time: 3_600_000 })
                .catch(() => null);
            if (submit === null) return void 0;

            code = submit.fields.getTextInputValue('code');
            action = submit;
        }

        await deferReply(action, 'Rendering image, this may take a while...');
        const image = await this.container.renderer //
            .createRender({ code, mode, theme }, input.user.id);
        return action.editReply({ content: null, files: [image] });
    }

    private _buildModal() {
        const code = new TextInputBuilder()
            .setCustomId('code')
            .setLabel('Code')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(900)
            .setPlaceholder('Type the code to render...');

        return new ModalBuilder()
            .setCustomId('_')
            .setTitle('Capture Code')
            .setComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(code)
            );
    }
}
