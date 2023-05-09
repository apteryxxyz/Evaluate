import { EmbedBuilder } from '@discordjs/builders';
import ms from 'enhanced-ms';
import { Command } from 'maclary';
import { Snippet } from '&entities/Snippet';
import { User } from '&entities/User';
import { deferReply } from '&functions/loadingPrefix';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class StatisticsCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'statistics',
            description: 'Shows some statistics for the bot.',

            preconditions: [BeforeCommand],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await deferReply(input, 'Gathering statistics...');

        const client = input.client;
        const serverCount = client.guilds.cache.size;
        const userCount = client.guilds.cache.reduce(
            (total, guild) => total + guild.memberCount,
            0
        );

        const {
            commandCount,
            evaluationCount,
            captureCount,
            mostUsedLanguage,
        } = await this.container.database.repository(User).getTotalStatistics();

        const snippetCount = await this.container.database
            .repository(Snippet)
            .count();

        const language = (mostUsedLanguage
            ? await this.container.executor.findLanguage(mostUsedLanguage)
            : undefined) ?? { name: 'None' };

        const statisticsEmbed = new EmbedBuilder()
            .setTitle(`${client.user?.username} Statistics`)
            .setColor(0x2fc086)
            .setFields([
                buildField(
                    'Bot Uptime',
                    ms(client.uptime ?? 0, { shortFormat: true })
                ),
                buildField('Server Count', serverCount),
                buildField('User Count', userCount),
                buildField('Commands Used', commandCount),
                buildField('Code Executed', evaluationCount),
                buildField('Captures Rendered', captureCount),
                buildField('Snippets Saved', snippetCount),
                buildField('Most Used Language', language.name),
            ]);

        return input.editReply({ content: null, embeds: [statisticsEmbed] });
    }
}

function buildField(name: string, value: unknown) {
    return { name, value: String(value), inline: true };
}
