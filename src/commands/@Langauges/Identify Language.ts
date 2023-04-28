import type { EmbedBuilder } from '@discordjs/builders';
import { Command } from 'maclary';
import { IdentifyBuilder } from '&builders/IdentifyBuilder';
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
        let results = extractCodeBlocks(content);
        if (results.length === 0) results = [{ language: null, code: content }];
        console.log(results);

        await menu.deferReply();

        const embeds: EmbedBuilder[] = [];
        for (const result of results)
            embeds.push(
                await IdentifyBuilder.identifyAndBuildEmbed(result.code)
            );

        return menu.editReply({ embeds });
    }
}
