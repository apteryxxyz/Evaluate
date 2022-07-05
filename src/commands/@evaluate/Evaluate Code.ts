import { Command } from 'maclary';
import { Piston } from '@lib/providers/Piston';
import { extractCodeBlock } from '@lib/util/stringFormatting';
import { detectLanguage } from '@lib/util/detectLanguage';
import { buildEvaluateModal } from '@lib/util/evaluateHelpers';
import type { Language } from '@lib/structures/Provider';
import { IncrementCommandCount } from '@lib/preconditions/IncrementCommandCount';

export default class Evaluate extends Command {
    public constructor() {
        super({
            type: Command.Type.ContextMenu,
            kinds: [Command.Kind.Message],
            name: 'Evaluate Code',
            description:
                'Locales and evaluates the code in a message, attempts to guess the language.',
            preconditions: [IncrementCommandCount],
        });
    }

    public override async onMessageContextMenu(menu: Command.MessageContextMenu): Promise<void> {
        const piston = this.container.providers.cache.get(Piston.id)!;
        const { content } = menu.targetMessage;
        let { language, code } = extractCodeBlock(content);
        if (!code) code = content;

        let struct: Language | undefined;
        if (language) struct = await piston.resolveLanguage(language);
        else struct = await detectLanguage(code, piston);

        const opts = { language: struct, code };
        const modal = buildEvaluateModal(opts).setCustomId(`eval,initial,${Piston.id}`);
        return void (await menu.showModal(modal));
    }
}
