import { EmbedBuilder } from '@discordjs/builders';
import { oneLine } from 'common-tags';
import type { Challenge } from '&entities/Challenge';
import type { Submission } from '&entities/Submission';

export function ResultEmbed(challenge: Challenge, submission: Submission) {
    const wasSuccess = submission.score > 0;

    return new EmbedBuilder()
        .setTitle(`Challenge #${challenge.id} Result`)
        .setColor(wasSuccess ? 0x2fc086 : 0xff0000)
        .setDescription(
            oneLine`Your submission to "${challenge}"
            **${wasSuccess ? 'passed' : 'failed'}**!` +
                `\nYou scored **${submission.score}** points.`
        );
}
