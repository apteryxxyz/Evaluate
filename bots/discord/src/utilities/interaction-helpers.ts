import type {
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIAttachment,
  APIInteractionDataResolved,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIModalSubmitInteraction,
  APIRole,
  APIUser,
  ApplicationCommandOptionType,
  ComponentType,
  ModalSubmitComponent,
} from 'discord-api-types/v10';

export interface ChatInputData {
  options?: APIApplicationCommandInteractionDataOption[];
  resolved?: APIInteractionDataResolved;
}

// =============== Subcommand ===============

export function getSubcommand(data: ChatInputData) {
  type _ = APIApplicationCommandInteractionDataSubcommandOption;
  const command = data.options![0]! as unknown as _;
  return { ...data, ...command } satisfies ChatInputData;
}

// =============== Option ===============

type Value = string | number | boolean | undefined;

export interface Option<TValue extends Value> {
  type: ApplicationCommandOptionType;
  name: string;
  value: TValue;
  focused?: boolean;
}

export interface ResolvedOption<TValue extends Value> extends Option<TValue> {
  user?: APIUser;
  role?: APIRole;
  member?: APIInteractionDataResolvedGuildMember & { user?: APIUser };
  channel?: APIInteractionDataResolvedChannel;
  attachment?: APIAttachment;
}

/**
 * Get an option from a chat input interaction.
 * @param interaction the interaction to get the option from
 * @param name the name of the option
 * @param required whether the option is required
 * @returns the option, or `undefined` if the option does not exist
 * @throws if the option is required and does not exist
 */
export function getOption<TValue extends Value>(
  data: ChatInputData,
  name: string,
  required: true,
): ResolvedOption<TValue>;

/**
 * Get an option from a chat input interaction.
 * @param interaction the interaction to get the option from
 * @param name the name of the option
 * @param required whether the option is required
 * @returns the option, or `undefined` if the option does not exist
 * @throws if the option is required and does not exist
 */
export function getOption<TValue extends Value>(
  data: ChatInputData,
  name: string,
  required?: false,
): ResolvedOption<TValue> | undefined;

export function getOption<TValue extends Value>(
  { options, resolved }: ChatInputData,
  name: string,
  required?: boolean,
) {
  const option = options?.find((o) => o.name === name);
  if (!option) {
    if (!required) return undefined as never;
    throw new Error(`Missing required option: ${name}`);
  }

  const result = {
    type: option.type,
    name: option.name,
    value: 'value' in option ? option.value : undefined,
  } as ResolvedOption<TValue>;

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

  return result as never;
}

/**
 * Get the focused option from a chat input interaction.
 * @param interaction the interaction to get the option from
 * @returns the focused option, or `undefined` if no option is focused
 */
export function getFocused<TValue extends Exclude<Value, boolean>>({
  options,
}: Pick<ChatInputData, 'options'>) {
  return options?.find((o) => 'focused' in o && o.focused) as
    | (Option<TValue> & { focused: true })
    | undefined;
}

// =============== User ===============

/**
 * Get the user from an interaction.
 * @param interaction the interaction to get the user from
 * @returns the user if it exists, otherwise `undefined`
 */
export function getUser(interaction: {
  user?: APIUser;
  member?: APIInteractionDataResolvedGuildMember & { user?: APIUser };
}) {
  return interaction.member?.user ?? interaction.user;
}

// =============== Field ===============

export interface Field<TValue extends string> {
  type: ComponentType;
  custom_id: string;
  value: TValue;
}

/**
 * Get a field from a modal submit interaction.
 * @param interaction the interaction to get the field from
 * @param name the name of the field
 * @param required whether the field is required
 * @returns the field, or `undefined` if the field does not exist
 * @throws if the field is required and does not exist
 */
export function getField(
  interaction: APIModalSubmitInteraction,
  name: string,
  required: true,
): Field<string>;

/**
 * Get a field from a modal submit interaction.
 * @param interaction the interaction to get the field from
 * @param name the name of the field
 * @param required whether the field is required
 * @returns the field, or `undefined` if the field does not exist
 * @throws if the field is required and does not exist
 */
export function getField(
  interaction: APIModalSubmitInteraction,
  name: string,
  required?: boolean,
): Field<string> | undefined;

export function getField(
  interaction: APIModalSubmitInteraction,
  name: string,
  required?: boolean,
): Field<string> | undefined {
  if (!interaction.data.components) return undefined;

  const components = interaction.data.components.reduce(
    (accumulator, next) => {
      for (const component of next.components)
        accumulator[component.custom_id] = component;
      return accumulator;
    },
    {} as Record<string, ModalSubmitComponent>,
  );

  const result = components[name];
  if (!result && required) throw new Error(`Missing required field: ${name}`);
  return components[name];
}
