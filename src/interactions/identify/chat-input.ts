import { createChatInputCommand } from '@/builders/command';
import { handleIdentifing } from '@/interactions/handlers/identify';
import { getTranslate } from '@/translations/determine-locale';
import { applyLocalizations } from '@/translations/get-localizations';
import { getOption } from '@/utilities/interaction/interaction-helpers';

export default createChatInputCommand(
  (builder) =>
    applyLocalizations(builder, 'identify').addStringOption((option) =>
      applyLocalizations(option, 'identify.code')
        .setMinLength(1)
        .setMaxLength(1000),
    ),

  async (interaction) => {
    const code = getOption<string>(interaction.data, 'code')?.value;
    const t = getTranslate(interaction);
    return handleIdentifing(t, interaction, { code: [code ?? ''] });
  },
);
