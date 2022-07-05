import { EmbedBuilder } from '@discordjs/builders';
import { IncrementCommandCount } from '@lib/preconditions/IncrementCommandCount';
import { getTotals } from '@lib/util/statisticsTracking';
import { Command } from 'maclary';

export default class ViewStatistics extends Command {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'statistics',
            description: 'View some statistics of Evaluate.',
            preconditions: [IncrementCommandCount],
        });
    }

    public override async onChatInput(interaction: Command.ChatInput) {
        const { client } = this.container;
        const user = client.user!;

        const serverCount = client.guilds.cache.size;
        const userCount = client.guilds.cache.reduce((a, c) => a + c.memberCount, 0);
        const { commandCount, mostUsedLanguage } = await getTotals();

        const fields = [
            { name: 'Server Count', value: serverCount.toString(), inline: true },
            { name: 'User Count', value: userCount.toString(), inline: true },
            { name: 'Command Count', value: commandCount.toString(), inline: true },
            { name: 'Most Used Language', value: mostUsedLanguage, inline: true },
        ];

        const embed = new EmbedBuilder()
            .setTitle(`${user.username} Statistics`)
            .setDescription(client.application?.description || null)
            .setTimestamp()
            .setColor(0x2fc086)
            .setFields(fields);

        return interaction.reply({ embeds: [embed] });
    }
}
