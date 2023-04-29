import type { EmbedBuilder } from '@discordjs/builders';
import { Command } from 'maclary';
import { buildIdenifiedEmbed } from '&factories/identify';
import { extractCodeBlocks } from '&functions/codeBlock';
import { IncrementCommandCount } from '&preconditions/IncrementCommandCount';

export class IdentifyLanguageCommand extends Command<
    Command.Type.ContextMenu,
    [Command.Kind.Message]
> {
    public constructor() {
        super({
            type: Command.Type.ContextMenu,
            kinds: [Command.Kind.Message],
            name: 'Identify Language',
            description:
                'Attempt to identify the programming languages in any number of code blocks/message content.',

            preconditions: [IncrementCommandCount],
        });
    }

    public override async onMessageMenu(menu: Command.MessageContextMenu) {
        const { content } = menu.targetMessage;
        let matches = extractCodeBlocks(content);
        if (matches.length === 0) matches = [{ language: null, code: content }];

        await menu.deferReply();

        const embeds: EmbedBuilder[] = [];
        for (const match of matches) {
            const result = await this.container.detector.detectLanguage({
                code: match.code,
            });

            embeds.push(buildIdenifiedEmbed(match.code, result));
        }

        return menu.editReply({ embeds });
    }
}
