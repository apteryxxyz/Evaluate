import {
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { ButtonStyle, TextInputStyle } from 'discord.js';
import { container } from 'maclary';
import { codeBlock } from '&functions/codeBlock';
import type { Executor } from '&services/Executor';

export class EvaluateBuilder extends null {
    public static buildEditModal(options: Partial<Executor.ExecuteOptions>) {
        const language = new TextInputBuilder()
            .setCustomId('language')
            .setLabel('Language')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder('Type the programming language...')
            .setValue(options.language?.name ?? '')
            .setMaxLength(100);

        const code = new TextInputBuilder()
            .setCustomId('code')
            .setLabel('Code')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder('Type the source code...')
            .setValue(options.code ?? '')
            .setMaxLength(900);

        const input = new TextInputBuilder()
            .setCustomId('input')
            .setLabel('Input')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setPlaceholder('Type the input...')
            .setValue(options.input ?? '')
            .setMaxLength(500);

        const args = new TextInputBuilder()
            .setCustomId('args')
            .setLabel('Arguments')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder('Type the arguments...')
            .setValue(options.args?.map(a => `"${a}"`).join(' ') ?? '')
            .setMaxLength(500);

        const rows = [language, code, input, args] //
            .map(put => new ActionRowBuilder<typeof put>().addComponents(put));

        return new ModalBuilder()
            .setTitle('Evaluate Code')
            .setComponents(rows)
            .setCustomId(`evaluator,create`);
    }

    public static async buildResultPayload(result: Executor.ExecuteResult) {
        let output = result.output.trim();

        if (output.length === 0) {
            output =
                'No output, ensure something is being printed to the console.';
        } else if (output.length > 1_000) {
            const pasteUrl = await container.pastebin.createPaste({
                content: output,
                lifetime: 1_000 * 60 * 60,
            });

            output = pasteUrl
                ? `Output was too long, so it was uploaded to a [pastebin](${pasteUrl}).`
                : 'Failed to upload to pastebin.';
        } else {
            output = codeBlock(output);
        }

        const embed = new EmbedBuilder()
            .setTitle('Evaluation Result')
            .setDescription(result.language.name)
            .setColor(result.isSuccess ? 0x2fc086 : 0xff0000);

        embed.addFields([
            buildField('Code', codeBlock(result.code, result.language.id)),
        ]);
        if (result.args.length > 0)
            embed.addFields([
                buildField('Arguments', formatArgs(result.args), true),
            ]);
        if (result.input.length > 0)
            embed.addFields([
                buildField('Input', codeBlock(result.input), true),
            ]);
        embed.addFields([buildField('Output', output)]);

        const edit = new ButtonBuilder()
            .setCustomId('evaluator,edit')
            .setLabel('Edit')
            .setStyle(ButtonStyle.Primary);

        const capture = new ButtonBuilder()
            .setCustomId('evaluator,capture')
            .setLabel('Capture')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<ButtonBuilder>() //
            .setComponents([edit, capture]);

        return { content: '', embeds: [embed], components: [row] };
    }

    public static buildInvalidLanguagePayload() {
        const embed = new EmbedBuilder()
            .setTitle('Invalid Language')
            .setDescription(
                'The language you provided was invalid, please try again.'
            )
            .setColor(0xff0000);

        const button = new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setCustomId('evaluator,edit')
                .setLabel('Try Again')
                .setStyle(ButtonStyle.Danger),
        ]);

        return { content: '', embeds: [embed], components: [button] };
    }

    public static buildStartButton() {
        return new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder()
                .setCustomId('evaluator,create')
                .setLabel('Start')
                .setStyle(ButtonStyle.Primary),
        ]);
    }
}

function buildField(name: string, value: string, inline = false) {
    return { name, value, inline };
}

function formatArgs(args: string[]) {
    return codeBlock(args.map(arg => `"${arg}"`).join(' '));
}
