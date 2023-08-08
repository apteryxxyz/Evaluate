import { createModalComponent } from '@/builders/component';
import { handleCapturing } from '@/functions/capture';
import { determineLocale } from '@/translate/functions';
import { useTranslate } from '@/translate/use';
import { getField } from '@/utilities/interaction-helpers';

export default createModalComponent(
  (i) => i.data.custom_id.startsWith('capture,'),

  async (interaction) => {
    const t = useTranslate(determineLocale(interaction));
    const code = getField(interaction, 'code', true).value;
    return handleCapturing(t, interaction, code);
  },
);
