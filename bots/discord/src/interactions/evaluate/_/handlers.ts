import { executeCode, findLanguage } from '@evaluate/execute';
import { TranslateFunctions } from '@evaluate/translate';
import { APIInteraction } from 'discord-api-types/v10';
import { api } from '~/core';
import { codeBlock } from '~/utilities/discord-formatting';
import { createEvaluateResult } from './builders';

/**
 * Handle the execution of code.
 * @param action value that changes the interaction reply methods
 * @param t the translate functions to handle localisation
 * @param interaction the interaction this is in response to
 * @param _options the options to execute the code with
 * @param settings the settings for the interaction
 */
export async function handleEvaluating(
  action: 'edit' | 'new',
  t: TranslateFunctions,
  interaction: APIInteraction,
  _options: {
    language: string;
    code: string;
    input?: string;
    args?: string;
  },
  settings: {
    ephemeral?: boolean;
    static?: boolean;
  } = {},
) {
  await api.interactions[action === 'edit' ? 'deferMessageUpdate' : 'defer'](
    interaction.id,
    interaction.token,
    settings.ephemeral ? { flags: 64 } : undefined,
  );

  const language = await findLanguage(_options.language);
  if (!language)
    return api.interactions[action === 'new' ? 'editReply' : 'followUp'](
      interaction.application_id,
      interaction.token,
      { content: t.evaluate.language.not_found(), flags: 64 },
    );

  const options = {
    ..._options,
    language,
    files: [{ content: _options.code }],
  };
  const result = await executeCode(options);

  let output;
  if (result.run.success === false) output = result.run.output;
  else if (result.compile?.success === false) output = result.compile.output;
  else output = result.run.output;

  if (!output.length) {
    output = t.evaluate.output.no_output();
  } else if (output.length > 1000) {
    const url = new URL(language.id, process.env.WEBSITE_URL);

    url.searchParams.set('utm_source', 'discord');
    url.searchParams.set('utm_medium', 'bot');

    url.searchParams.set('code', btoa(_options.code));
    if (_options.input) url.searchParams.set('input', btoa(_options.input));
    if (_options.args) url.searchParams.set('args', btoa(_options.args));

    output = t.evaluate.output.too_long({ url: url.toString() });
  } else {
    output = codeBlock(output, 1000);
  }

  return api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    createEvaluateResult(t, options, result, output, settings),
  );
}
