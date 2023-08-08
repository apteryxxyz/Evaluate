import type {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIGuildMember,
  APIModalSubmitInteraction,
  APIUser,
  ModalSubmitComponent,
} from 'discord-api-types/v10';

interface Option<TReturns> {
  name: string;
  value: TReturns;
}

interface Field<TReturns> {
  custom_id: string;
  value: TReturns;
}

/**
 * Get an option from an interaction.
 * @param interaction The interaction to get the option from
 * @param name The name of the option
 * @param required Whether the option is required
 */
export function getOption<TReturns>(
  interaction:
    | APIChatInputApplicationCommandInteraction
    | APIApplicationCommandAutocompleteInteraction,
  name: string,
  required: true,
): Option<TReturns>;
export function getOption<TReturns>(
  interaction:
    | APIChatInputApplicationCommandInteraction
    | APIApplicationCommandAutocompleteInteraction,
  name: string,
  required?: boolean,
): Option<TReturns> | undefined;
/**
 * Get an option from an interaction.
 * @param interaction The interaction to get the option from
 * @param name The name of the option
 * @param required Whether the option is required
 */
export function getOption<TReturns>(
  interaction:
    | APIChatInputApplicationCommandInteraction
    | APIApplicationCommandAutocompleteInteraction,
  name: string,
): Option<TReturns> | undefined {
  if (!interaction.data.options) return undefined;
  return interaction.data.options //
    .find((o) => o.name === name) as Option<TReturns> | undefined;
}

/**
 * Get the focused option from an interaction.
 * @param interaction The interaction to get the focused option from
 */
export function getFocusedOption<TReturns>(
  interaction: APIApplicationCommandAutocompleteInteraction,
): Option<TReturns> & { focused: true } {
  return interaction.data.options.find((o) =>
    Reflect.get(o, 'focused'),
  ) as unknown as Option<TReturns> & { focused: true };
}

export function getField(
  interaction: APIModalSubmitInteraction,
  name: string,
  required: true,
): Field<string>;
export function getField(
  interaction: APIModalSubmitInteraction,
  name: string,
  required?: boolean,
): Field<string> | undefined;
export function getField(
  interaction: APIModalSubmitInteraction,
  name: string,
): Field<string> | undefined {
  if (!interaction.data.components) return undefined;

  const components = interaction.data.components.reduce(
    (accumulator, next) => {
      next.components.forEach((c) => (accumulator[c.custom_id] = c));
      return accumulator;
    },
    {} as Record<string, ModalSubmitComponent>,
  );

  return components[name];
}

/**
 * Get the user from an interaction.
 * @param interaction The interaction to get the user from
 */
export function getUser(interaction: {
  user?: APIUser;
  member?: APIGuildMember;
}) {
  return (interaction.user ?? interaction.member?.user)!;
}
