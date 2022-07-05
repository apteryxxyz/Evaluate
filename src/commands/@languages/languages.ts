import { Command } from 'maclary';
import { IncrementCommandCount } from '@lib/preconditions/IncrementCommandCount';
import { Context } from '@maclary/context';
import { EmbedBuilder } from '@discordjs/builders';

export default class Languages extends Command {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'languages',
            description: 'Show a list of languages that Evaluate supports.',
            preconditions: [IncrementCommandCount],
        });
    }

    public override async onChatInput(interaction: Command.ChatInput) {
        return this.sharedRun(new Context(interaction));
    }

    private async sharedRun(context: Context) {
        const languages = this.container.providers.cache
            .first()!
            .languages.sort((a, b) => a.name.localeCompare(b.name));

        const first = [];
        const second = [];
        const third = [];
        for (const language of languages) {
            if ('abcdef'.includes(language.id[0])) {
                first.push(language.pretty);
            } else if ('ghijklmno'.includes(language.id[0])) {
                second.push(language.pretty);
            } else {
                third.push(language.pretty);
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('Supported Languages')
            .setFooter({ text: `A total of ${languages.length} languages` })
            .setColor(0x2fc086)
            .setTimestamp()
            .setFields([
                { name: 'A - F', value: first.join('\n'), inline: true },
                { name: 'G - O', value: second.join('\n'), inline: true },
                { name: 'P - Z', value: third.join('\n'), inline: true },
            ]);

        return void (await context.reply({ embeds: [embed] }));
    }
}
