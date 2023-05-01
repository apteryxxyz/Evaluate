import { EmbedBuilder } from '@discordjs/builders';
import { buildField } from '&functions/builderHelpers';
import { codeBlock } from '&functions/codeBlock';
import { formatLanguageName } from '&functions/formatNames';
import type { Detector } from '&services/Detector';

export function ResultEmbed(
    options: Detector.DetectOptions & { result?: string }
) {
    const embed = new EmbedBuilder()
        .setTitle('Programming Language Detection')
        .setColor(options.result ? 0x2fc086 : 0xff0000);

    if (options.result) {
        const field = buildField(
            'Code',
            codeBlock(options.code, options.result)
        );
        if (field) embed.addFields(field);
    }

    const field = buildField('Prediction', buildOutput(options.result));
    if (field) embed.addFields(field);

    return embed;
}

function buildOutput(result?: string) {
    return result
        ? `Identified this code as being **${formatLanguageName(result)}**.`
        : "Could not identify this codes language, either there isn't enough information or it just doesn't exist.";
}
