import type {
  APIApplicationCommandAutocompleteInteraction,
  APIAttachment,
  APIChatInputApplicationCommandInteraction,
  APIGuildMember,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIModalSubmitInteraction,
  APIRole,
  APIUser,
  ApplicationCommandOptionType,
  ComponentType,
  ModalSubmitComponent,
} from 'discord-api-types/v10';

type Value = string | number | boolean | undefined;

interface Option<TValue extends Value> {
  type: ApplicationCommandOptionType;
  name: string;
  value: TValue;
  focused?: true;
}

interface ResolvedOption<TValue extends Value> extends Option<TValue> {
  user?: APIUser;
  role?: APIRole;
  member?: APIInteractionDataResolvedGuildMember & { user?: APIUser };
  channel?: APIInteractionDataResolvedChannel;
  attachment?: APIAttachment;
}

export function getOption<TValue extends Value>(
  interaction:
    | APIChatInputApplicationCommandInteraction
    | APIApplicationCommandAutocompleteInteraction,
  name: string,
  required: true,
): ResolvedOption<TValue>;
export function getOption<TValue extends Value>(
  interaction:
    | APIChatInputApplicationCommandInteraction
    | APIApplicationCommandAutocompleteInteraction,
  name: string,
  required?: false,
): ResolvedOption<TValue> | undefined;

/**
 * Get an option from an interaction.
 * @param interaction The interaction to get the option from
 * @param name The name of the option
 * @param required Whether the option is required
 */
export function getOption<TValue extends Value>(
  interaction:
    | APIChatInputApplicationCommandInteraction
    | APIApplicationCommandAutocompleteInteraction,
  name: string,
  required?: boolean,
) {
  const option = interaction.data.options?.find((o) => o.name === name);
  if (!option) {
    if (required) throw new Error(`Missing required option: ${name}`);
    return undefined;
  }

  const result = {
    type: option.type,
    name: option.name,
    value: 'value' in option ? option.value : undefined,
  } as ResolvedOption<TValue>;

  const resolved = interaction.data.resolved;
  if (resolved && typeof result.value === 'string') {
    const user = resolved.users?.[result.value];
    if (user) result.user = user;

    const member = resolved.members?.[result.value];
    if (member) result.member = { user, ...member };

    const role = resolved.roles?.[result.value];
    if (role) result.role = role;

    const channel = resolved.channels?.[result.value];
    if (channel) result.channel = channel;

    const attachment = resolved.attachments?.[result.value];
    if (attachment) result.attachment = attachment;
  }

  return result;
}

export function getFocusedOption<TValue extends Exclude<Value, boolean>>(
  interaction:
    | APIChatInputApplicationCommandInteraction
    | APIApplicationCommandAutocompleteInteraction,
) {
  return interaction.data.options?.find((o) => 'focused' in o && o.focused) as
    | (Option<TValue> & { focused: true })
    | undefined;
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

interface Field<TValue extends string> {
  type: ComponentType;
  custom_id: string;
  value: TValue;
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
