import { EmbedBuilder } from '@discordjs/builders';
import ms from 'enhanced-ms';
import { Command } from 'maclary';
import { User } from '&entities/User';
import { IncrementCommandCount } from '&preconditions/IncrementCommandCount';

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

            preconditions: [IncrementCommandCount],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await input.deferReply();

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
        } = await this.container.database
            .repository(User)
            .getStatisticsTotals();

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
                buildField('Evaluation Count', evaluationCount),
                buildField('Capture Count', captureCount),
                buildField('Most Used Language', language.name),
            ]);

        return input.editReply({ embeds: [statisticsEmbed] });
    }
}

function buildField(name: string, value: unknown) {
    return { name, value: String(value), inline: true };
}
