/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-eval */
import { inspect } from 'node:util';
import { EmbedBuilder } from 'discord.js';
import { Command, Preconditions } from 'maclary';
import { env } from '../../env';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class EvalCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Prefix]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Prefix],
            name: 'eval',
            description:
                'Evaluate JavaScript code in the context of this command.',

            preconditions: [Preconditions.BotOwnerOnly, BeforeCommand],
            options: [
                {
                    type: Command.OptionType.String,
                    name: 'script',
                    description: 'The script to evaluate.',
                    required: true,
                },
            ],
        });
    }

    public override async onPrefix(message: Command.Message) {
        const script = message.content.split('eval')[1].trim();
        if (!script) return void message.reply('No script was provided.');

        let isSuccess = true;
        let output: unknown = '';

        const hasAwait = script.match(/await /g);
        const hasReturn = script.match(/return /g);
        const hasResolve = script.match(/(!<?\.)resolve\(/g);

        if (hasAwait && !hasReturn && !hasResolve)
            return void message.reply(
                'Script has await but is missing a way to return.'
            );

        const container = this.container;
        void container;

        try {
            if (!hasAwait && !hasResolve) {
                output = eval(script);
            } else if (hasReturn) {
                output = eval(`(async()=>{${script}})()`);
            } else if (hasResolve) {
                output = new Promise((resolve, reject) => {
                    void [resolve, reject];
                    return eval(`(async()=>{${script}})()`);
                });
            }

            if (isPromiseLike(output)) {
                output = await Promise.resolve(output);
            }

            if (typeof output !== 'string') {
                output = inspect(output);
            }

            output = censorSecretsInString(String(output));
        } catch (error) {
            output = error;
        }

        if (output instanceof Error) {
            isSuccess = false;
            output = output.message;
        }

        const resultEmbed = new EmbedBuilder()
            .setTitle('Evaluation Result')
            .setColor(isSuccess ? 0x2fc086 : 0xff0000)
            .addFields([
                {
                    name: 'Input',
                    value: convertToCodeBlock(script, 'js'),
                },
                {
                    name: 'Output',
                    value: convertToCodeBlock(String(output)),
                },
            ]);

        return void message.reply({ embeds: [resultEmbed] });
    }
}

function censorSecretsInString(input: string) {
    const secrets = Object.values(env);
    for (const secret of secrets)
        input = input.replaceAll(String(secret ?? ''), '******');
    return input;
}

function convertToCodeBlock(input: string, language = '') {
    return '```' + language + '\n' + input.slice(0, 1_000) + '\n```';
}

function isPromiseLike(value: unknown) {
    return (
        value instanceof Promise ||
        (value &&
            typeof value === 'object' &&
            typeof (value as Promise<unknown>).then === 'function' &&
            typeof (value as Promise<unknown>).catch === 'function')
    );
}
