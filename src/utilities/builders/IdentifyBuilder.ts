import { EmbedBuilder } from '@discordjs/builders';
import { codeBlock } from '&functions/codeBlock';
import { detectLanguage } from '&functions/detectLanguage';
import { formatLanguageName } from '&functions/formatNames';

export class IdentifyBuilder {
    public static async identifyAndBuildEmbed(content: string) {
        const result =
            content.length > 9 ? await detectLanguage(content) : undefined;
        const detected = result
            ? `Identified this code as being **${formatLanguageName(result)}**.`
            : "Could not identify this codes language, either there isn't enough information or it just doesn't exist.";

        const embed = new EmbedBuilder()
            .setTitle('Programming Language Detection')
            .setColor(result ? 0x2fc086 : 0xff0000);

        if (result)
            embed.addFields([
                { name: 'Code', value: codeBlock(content, result) },
            ]);
        embed.addFields([{ name: 'Prediction', value: detected }]);

        return embed;
    }
}
