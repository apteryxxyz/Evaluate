import { EmbedBuilder } from '@discordjs/builders';
import { codeBlock } from '@lib/util/stringFormatting';
import { Context } from '@maclary/context';
import { ApplicationCommandOptionType } from 'discord.js';
import { Command, Preconditions, ReplyError } from 'maclary';
import { inspect } from 'util';

export default class Eval extends Command {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Prefix],
            name: 'eval',
            description: 'Evaluate JavaScript code in the context of this command.',
            preconditions: [
                Preconditions.BotOwnerOnly,
                Preconditions.ClientPermissions(['EmbedLinks', 'SendMessages']),
            ],
            options: [
                {
                    name: 'script',
                    description: 'The JavaScript code to evaluate.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }

    public override async onChatInput(interaction: Command.ChatInput) {
        const script = interaction.options.getString('script') || '';
        const context = new Context(interaction);
        return this.sharedRun(context, script);
    }

    public override async onMessage(message: Command.Message, _: Command.Arguments) {
        const script = message.cleanContent
            .split('developer eval')
            .slice(1)
            .join('developer eval')
            .trim();
        if (!script) throw new ReplyError('No script provided!');
        const context = new Context(message);
        return this.sharedRun(context, script);
    }

    public async sharedRun(context: Context, script: string) {
        await context.deferReply();

        let colour = 0x2fc086;
        let output: any = '';
        const hasAwait = script.match(/await /g);
        const hasReturn = script.match(/return /g);
        const hasResolve = script.match(/(!<?\.)resolve\(/g);

        if (hasAwait && !hasReturn && !hasResolve)
            return context.editReply('Script has await but is missing a way to return!');

        // @ts-ignore Easy access of the client in eval
        const { client } = this.container;

        try {
            if (!hasAwait && !hasResolve) output = eval(script);
            else if (hasAwait && !hasResolve) output = eval(`(async()=>{${script}})()`);
            else if (hasResolve) output = eval(`(async()=>{${script}})()`);
            else if (hasResolve) {
                // @ts-ignore Allow use of resolve and reject in eval.
                output = new Promise((resolve, reject) => eval(`(async()=>{${script}})();`));
            }

            if (output instanceof Promise) output = await Promise.resolve(output);
            if (typeof output !== 'string') output = inspect(output);
        } catch (error) {
            output = error;
        }

        if (output instanceof Error) {
            const stack = output.stack?.toString().split('\n') || [output.message];
            output = stack.slice(0, 5).join('\n');
            colour = 0xff0000;
        }

        const embed = new EmbedBuilder()
            .setTitle('Evaluation Result')
            .addFields([
                {
                    name: 'Input',
                    value: codeBlock(script.slice(0, 1000)),
                },
                {
                    name: 'Output',
                    value: codeBlock(output.slice(0, 1000)),
                },
            ])
            .setColor(colour)
            .setTimestamp();

        return context.editReply({ embeds: [embed] });
    }
}
