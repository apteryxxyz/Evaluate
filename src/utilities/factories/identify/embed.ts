import { EmbedBuilder } from '@discordjs/builders';
import { codeBlock } from '&functions/codeBlock';
import { formatLanguageName } from '&functions/formatNames';

export function buildIdenifiedEmbed(code: string, result?: string) {
    const preduction = buildIdentifiedOutput(result);

    const embed = new EmbedBuilder()
        .setTitle('Programming Language Detection')
        .setColor(result ? 0x2fc086 : 0xff0000);

    if (result)
        embed.addFields([{ name: 'Code', value: codeBlock(code, result) }]);
    embed.addFields([{ name: 'Prediction', value: preduction }]);

    return embed;
}

export function buildIdentifiedOutput(result?: string) {
    return result
        ? `Identified this code as being **${formatLanguageName(result)}**.`
        : "Could not identify this codes language, either there isn't enough information or it just doesn't exist.";
}
