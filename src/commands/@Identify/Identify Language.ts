import type { EmbedBuilder } from '@discordjs/builders';
import { Command } from 'maclary';
import { Identify } from '&builders/identify';
import { extractCodeBlocks } from '&functions/codeBlock';
import { deferReply } from '&functions/loadingPrefix';
import { BeforeCommand } from '&preconditions/BeforeCommand';
import premium from '&premium';

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

            preconditions: [BeforeCommand],
        });
    }

    public override async onMessageMenu(menu: Command.MessageContextMenu) {
        const { content } = menu.targetMessage;
        let matches = extractCodeBlocks(content);
        if (matches.length === 0) matches = [{ language: null, code: content }];

        await deferReply(
            menu,
            'Attempting to identify language, please wait...'
        );
        const embeds: EmbedBuilder[] = [];
        for (const { code, language } of matches) {
            const options = {
                code,
                language: language ?? undefined,
                usePaid: premium.identify.ai.determine(
                    menu.user.entity.hasPremium
                ),
            };
            embeds.push(
                new Identify.ResultEmbed({
                    ...options,
                    result: await this.container.detector //
                        .detectLanguage(options),
                })
            );
        }

        return menu.editReply({ content: null, embeds });
    }
}
