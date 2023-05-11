import {
    ButtonBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
} from '@discordjs/builders';
import { oneLine } from 'common-tags';
import { ButtonStyle, TextInputStyle } from 'discord.js';
import { Constants } from '&builders/execute';
import type { Challenge } from '&entities/Challenge';
import { buildField, wrapInRow } from '&functions/builderHelpers';
import { codeBlock } from '&functions/codeBlock';
import type { Executor } from '&services/Executor';

export function SubmitModal(
    challenge: Challenge,
    options?: {
        language: Executor.Language;
        code: string;
    }
) {
    const language = new TextInputBuilder()
        .setCustomId('language')
        .setLabel('Language')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder('Language to execute in...')
        .setValue(options?.language.name ?? '')
        .setMinLength(Constants.lengths.language[0])
        .setMaxLength(Constants.lengths.language[1]);

    const code = new TextInputBuilder()
        .setCustomId('code')
        .setLabel('Code')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder('Code to execute...')
        .setValue(options?.code ?? '')
        .setMinLength(Constants.lengths.code[0])
        .setMaxLength(Constants.lengths.code[1]);

    return new ModalBuilder()
        .setTitle('Evaluate Code')
        .setComponents([language, code].map(input => wrapInRow(input)))
        .setCustomId(`challenge,${challenge.id},submit`);
}

export function EditSubmitModal(
    submissionId: string,
    ...args: Parameters<typeof SubmitModal>
) {
    return SubmitModal(...args) //
        .setCustomId(`challenge,${args[0].id},edit,${submissionId}`);
}

export function ConfirmEmbed(
    challenge: Challenge,
    submission: { language: Executor.Language; code: string }
) {
    return new EmbedBuilder()
        .setTitle('Confirm Submission')
        .setColor(0x2fc086)
        .setDescription(
            oneLine`Are you sure you want to submit this code for "${challenge}"?
            You will not be able to edit it or submit another solution.`
        )
        .addFields(
            buildField('Language', submission.language.name, true),
            buildField(
                'Code',
                codeBlock(submission.code, submission.language.id)
            )
        );
}

export function ConfirmComponents(challenge: Challenge, submisionId: string) {
    return wrapInRow(
        new ButtonBuilder()
            .setCustomId(`challenge,${challenge.id},confirm,${submisionId}`)
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success)
    );
}
