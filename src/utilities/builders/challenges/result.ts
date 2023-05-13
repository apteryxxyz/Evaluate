import { EmbedBuilder } from '@discordjs/builders';
import { oneLine } from 'common-tags';
import type { Challenge } from '&entities/Challenge';
import type { Submission } from '&entities/Submission';
import { buildField } from '&functions/builderHelpers';
import { resolveEmoji } from '&functions/resolveEmoji';

export function ResultEmbed(
    challenge: Challenge,
    submission: Submission,
    testResults: (boolean | string)[]
) {
    const wasSuccess = submission.score > 0;
    const testCount = challenge.tests.length;
    const passCount = testResults.filter(result => result === true).length;

    const testResultsString =
        `**${passCount}** out of **${testCount}** tests passed.\n\n` +
        testResults
            .map((result, index) => {
                const test = challenge.tests[index];
                const emoji = resolveEmoji(result === true ? 'pass' : 'fail');
                let output =
                    typeof result === 'string'
                        ? result.trim().replaceAll('\n', '  ') || 'No output'
                        : test.output;
                if (output.length > 100) output = output.slice(0, 97) + '...';

                return `${emoji} \`${test.input}\` -> \`${output}\``;
            })
            .join('\n');

    return new EmbedBuilder()
        .setTitle(`Challenge #${challenge.id} Result`)
        .setColor(wasSuccess ? 0x2fc086 : 0xff0000)
        .setDescription(
            oneLine`Your submission to "${challenge}"
            **${wasSuccess ? 'passed' : 'failed'}**!` +
                `\nYou scored **${submission.score}** points.`
        )
        .setFields(buildField('Test Results', testResultsString, false));
}
