import type {
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIAttachment,
  APIGuildMember,
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

/* SUBCOMMAND */

export function getSubcommand(data: ChatInputData) {
  type _ = APIApplicationCommandInteractionDataSubcommandOption;
  const command = data.options![0]! as unknown as _;
  return { ...data, ...command } satisfies ChatInputData;
}

/* OPTION */

type Value = string | number | boolean | undefined;

export interface Option<TValue extends Value> {
  type: ApplicationCommandOptionType;
  name: string;
  value: TValue;
  focused?: true;
}

export interface ResolvedOption<TValue extends Value> extends Option<TValue> {
  user?: APIUser;
  role?: APIRole;
  member?: APIInteractionDataResolvedGuildMember & { user?: APIUser };
  channel?: APIInteractionDataResolvedChannel;
  attachment?: APIAttachment;
}

export function getOption<TValue extends Value>(
  data: ChatInputData,
  name: string,
  required: true,
): ResolvedOption<TValue>;
export function getOption<TValue extends Value>(
  data: ChatInputData,
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
  { options, resolved }: ChatInputData,
  name: string,
  required?: boolean,
) {
  const option = options?.find((o) => o.name === name);
  if (!option) {
    if (required) throw new Error(`Missing required option: ${name}`);
    return undefined;
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

  return result;
}

export function getFocusedOption<TValue extends Exclude<Value, boolean>>({
  options,
}: Pick<ChatInputData, 'options'>) {
  return options?.find((o) => 'focused' in o && o.focused) as
    | (Option<TValue> & { focused: true })
    | undefined;
}

/* USER */

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

/* FIELD */

export interface Field<TValue extends string> {
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
