import { compress } from '@evaluate/compress';
import { executeCode } from '@evaluate/execute';
import { findLanguage } from '@evaluate/languages';
import { TranslateFunctions } from '@evaluate/translate';
import { APIInteraction } from 'discord-api-types/v10';
import { analytics, api } from '~/core';
import { codeBlock } from '~/utilities/discord-formatting';
import { getUser } from '~/utilities/interaction-helpers';
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
      { content: t.language.not_resolved.description(), flags: 64 },
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

  void analytics?.capture({
    distinctId: getUser(interaction)?.id!,
    event: 'code executed',
    properties: {
      platform: 'discord bot',
      'guild id': interaction.guild_id,
      'channel id': interaction.channel?.id,

      'language id': language.id,
      'code length': _options.code.length,
      'output length': output.length,
      'input provided': Boolean(_options.input),
      'args provided': Boolean(_options.args),
      'was successful':
        result.run.success && (!result.compile || result.compile.success),
    },
  });

  if (!output.length) {
    output = t.evaluate.output.no_output();
  } else if (output.length > 1000) {
    const url = new URL(language.id, process.env.WEBSITE_URL);

    const data = compress({
      files: [{ content: _options.code }],
      input: _options.input ?? '',
      args: _options.args ?? '',
    });
    url.searchParams.set('d', data);
    url.searchParams.set('utm_source', 'discord_bot');
    url.searchParams.set('utm_content', 'result_too_long');

    output = t.evaluate.output.too_long.discord_bot({ url: url.toString() });
  } else {
    output = codeBlock(output, 1000);
  }

  return api.interactions.editReply(
    interaction.application_id,
    interaction.token,
    createEvaluateResult(t, options, result, output, settings),
  );
}
