import { Command, MaclaryClient } from 'maclary';
import { Context } from '@maclary/context';
import { ButtonStyle } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import _ from 'lodash';
import { IncrementCommandCount } from '@lib/preconditions/IncrementCommandCount';

export default class Help extends Command {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'help',
            description: 'Show a list of commands that Evaluate has.',
            preconditions: [IncrementCommandCount],
        });
    }

    public override async onChatInput(interaction: Command.ChatInput) {
        return this.sharedRun(new Context(interaction));
    }

    public override async onMessage(message: Command.Message) {
        return this.sharedRun(new Context(message));
    }

    private async sharedRun(context: Context) {
        await context.deferReply();

        const mention = context.client.user?.toString() ?? '@me';
        let messagePrefix = [this.container.client.options.defaultPrefix].flat()[0];
        messagePrefix ||= mention;

        const commands = [...Array.from(this.container.client.commands.cache.values())];
        const rawList = commands.map((c) => loopOverCommand(c, messagePrefix, ''));
        const commandsList = rawList.flat().filter((c) => c.category !== 'developer');

        const categoriesList = commandsList.reduce((acc: any, cur: any) => {
            acc[cur.category] ||= [];
            acc[cur.category].push(cur);
            return acc;
        }, {});

        const preSorted = Object.values<Command[]>(categoriesList);
        const commandRows = buildCommandRows(preSorted);

        const commandFields = commandRows.map((row) => ({
            inline: true,
            name: `${_.startCase(row[0].category)} Commands`,
            value: row.map((c) => Reflect.get(c, 'toString')?.(c)).join('\n\n'),
        }));

        const { client } = this.container;

        const embed = new EmbedBuilder()
            .setTitle(`${client.user?.username} Help`)
            .setDescription(client.application?.description || null)
            .setTimestamp()
            .setColor(0x2fc086)
            .setFields(commandFields);

        const invites = await getClientInvites(client);
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            [
                invites.bot
                    ? new ButtonBuilder()
                          .setStyle(ButtonStyle.Link)
                          .setLabel('Add Bot')
                          .setURL(invites.bot ?? '')
                    : undefined,
                invites.server
                    ? new ButtonBuilder()
                          .setStyle(ButtonStyle.Link)
                          .setLabel('Join Support')
                          .setURL(invites.server ?? '')
                    : undefined,
            ].filter((b) => b !== undefined) as any,
        );

        await context.editReply({ embeds: [embed], components: [actionRow] });
    }
}

function loopOverCommand(command: Command, prefix: string, namePrefix: string): any[] {
    namePrefix += `${command.name} `;
    if (command.subType === Command.SubType.Command) {
        return [
            {
                prefix: resolvePrefix(command, prefix),
                name: namePrefix.trim(),
                description: command.description,
                category: command.category || '',
                options: command.options
                    .map((o: any) => (o.required ? `<${o.name}>` : `[${o.name}]`))
                    .join(' '),
                toString: (c: any) =>
                    `**${c.prefix}${c.name}${c.options ? ` ${c.options}` : ''}**\n${c.description}`,
            },
        ];
    }
    return command.options.map((o) => loopOverCommand(o as any, prefix, namePrefix)).flat();
}

function resolvePrefix(command: Command, defaultPrefix: string) {
    const hasUser = command.kinds.includes(Command.Kind.User);
    const hasMessage = command.kinds.includes(Command.Kind.Message);
    const hasSlash = command.kinds.includes(Command.Kind.Slash);
    const hasPrefix = command.kinds.includes(Command.Kind.Prefix);

    if (hasUser && hasMessage) return 'Apps > ';
    else if (hasUser) return 'User > ';
    else if (hasMessage) return 'Message > ';
    else if (hasSlash) return '/';
    else if (hasPrefix) return defaultPrefix;
    return '';
}

async function getClientInvites(client: MaclaryClient) {
    const addParams = client.application?.installParams;
    const botInvite = addParams ? client.generateInvite(addParams) : undefined;

    const guildId = client.options.developmentGuildId;
    const guild = await client.guilds.fetch(guildId);
    const findChannel = (c: any) => c.name === 'information';
    const channelId = guild.channels.cache.find(findChannel)?.id;
    const guildInvite = await guild?.invites.create(channelId as string, { maxAge: 0 });
    const inviteUrl = guildInvite?.url;

    return { bot: botInvite, server: inviteUrl };
}

function buildCommandRows(commands: Record<string, any>[][]) {
    const lengths: Record<number, Record<string, any>[][]> = {};
    for (const items of commands) {
        lengths[items.length] ||= [];
        lengths[items.length].push(items);
    }

    const chunks = [];
    for (const items of Object.values(lengths)) {
        if (items.length <= 3) chunks.push(items);
        else chunks.push(..._.chunk(items, 3));
    }

    return chunks.flat().sort((a, b) => b.length - a.length);
}
