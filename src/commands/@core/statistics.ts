import { EmbedBuilder } from '@discordjs/builders';
import { Command } from 'maclary';
import { connection } from 'mongoose';
import { IncrementCommandCount } from '@lib/preconditions/IncrementCommandCount';
import { getTotals } from '@lib/util/statisticsTracking';

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
        await interaction.deferReply();
        const { client } = this.container;
        const user = client.user!;

        const serverCount = client.guilds.cache.size;
        const userCount = client.guilds.cache.reduce((a, c) => a + c.memberCount, 0);
        const snippetsCount = await connection.models.Snippet.countDocuments();
        const { commandCount, evaluatorCount, mostUsedLanguage } = await getTotals();
        const activeCount = this.container.evaluators.cache.size;

        const fields = [
            { name: 'Server Count', value: serverCount.toString() },
            { name: 'User Count', value: userCount.toString() },
            { name: 'Command Count', value: commandCount.toString() },
            { name: 'Unique Snippet Count', value: snippetsCount.toString() },
            { name: 'Evaluator Count', value: `${evaluatorCount} (${activeCount} active)` },
            { name: 'Most Used Language', value: mostUsedLanguage, inline: false },
        ].map((f) => ({ ...f, inline: f.inline !== undefined ? f.inline : true }));

        const embed = new EmbedBuilder()
            .setTitle(`${user.username} Statistics`)
            .setTimestamp()
            .setColor(0x2fc086)
            .setFields(fields);

        return interaction.editReply({ embeds: [embed] });
    }
}
