import { EmbedBuilder } from '@discordjs/builders';
import { Command } from 'maclary';
import { detectLanguage } from '@lib/util/detectLanguage';
import { codeBlock, extractCodeBlock } from '@lib/util/stringFormatting';
import { Piston } from '@lib/providers/Piston';
import { IncrementCommandCount } from '@lib/preconditions/IncrementCommandCount';

export default class Detect extends Command {
    public constructor() {
        super({
            type: Command.Type.ContextMenu,
            kinds: [Command.Kind.Message],
            name: 'Identify Language',
            description: 'Use AI to identify the language of a piece of code in a message.',
            preconditions: [IncrementCommandCount],
        });
    }

    public override async onMessageContextMenu(menu: Command.MessageContextMenu): Promise<unknown> {
        const { content } = menu.targetMessage;
        let { code } = extractCodeBlock(content);
        if (!code) code = content;

        const piston = this.container.providers.cache.get(Piston.id)!;
        const language = await detectLanguage(code, piston);

        const detected = language
            ? `Identified this code as ${language.name}.`
            : "Could not identify this codes language, either there isn't enough information or I don't support it.";

        const embed = new EmbedBuilder()
            .setTitle('Language Detection')
            .setColor(0x2fc086)
            .setFields([
                { name: 'Code', value: codeBlock(code, language?.id) },
                { name: 'Prediction', value: detected },
            ]);

        return menu.reply({ embeds: [embed] });
    }
}
