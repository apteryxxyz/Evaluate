import { EmbedBuilder } from '@discordjs/builders';
import type { Guild } from 'discord.js';
import { userMention } from 'discord.js';
import { container } from 'maclary';
import { Submission } from '&entities/Submission';

// eslint-disable-next-line @typescript-eslint/promise-function-async
export function LeaderboardEmbed(userId: string, guild?: Guild) {
    return (async () => {
        let leaderboard = await container.database
            .repository(Submission)
            .getLeaderboard();

        if (guild) {
            const ids = leaderboard.map(([id]) => id);
            await guild.members.fetch({ user: ids });
            leaderboard = leaderboard.filter(([id]) =>
                guild.members.cache.has(id)
            );
        }

        const topTen = leaderboard.slice(0, 10);
        const myPosition = leaderboard.findIndex(([id]) => id === userId);

        const topTenString =
            topTen
                .map(([id, score], index) => {
                    const userString = userMention(id);
                    return `**${index + 1}.** ${userString} - ${score} points`;
                })
                .join('\n') || 'No one has submitted anything yet.';
        const positionString =
            myPosition === -1
                ? 'You have not submitted anything yet.'
                : `You are #${myPosition + 1} on the leaderboard.`;

        return new EmbedBuilder()
            .setTitle(`${guild?.name ?? 'Global'} Points Leaderboard`)
            .setDescription(topTenString)
            .setFooter({ text: positionString })
            .setColor(0x2fc086);
    })();
}
