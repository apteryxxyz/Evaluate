import {
  type APIInteraction,
  type APIModalSubmitInteraction,
  InteractionType,
} from 'discord-api-types/v10';

export interface ModalComponent {
  type: InteractionType.ModalSubmit;
  check(interaction: APIModalSubmitInteraction): boolean;
  handler(interaction: APIModalSubmitInteraction): Promise<unknown>;
}

/**
 * Create a new modal component.
 * @param check function that checks if the interaction is for this modal
 * @param handler function that handles the interaction
 * @returns a new modal component
 */
export function createModalComponent(
  check: ModalComponent['check'],
  handler: ModalComponent['handler'],
): ModalComponent {
  return { type: InteractionType.ModalSubmit, check, handler };
}

/**
 * Check if an interaction is a modal interaction.
 * @param interaction the interaction to check
 * @returns whether the interaction is a modal interaction
 */
export function isModal(
  interaction: APIInteraction,
): interaction is APIModalSubmitInteraction {
  return interaction.type === InteractionType.ModalSubmit;
}

/**
 * Check if an interaction is a message modal interaction.
 * @param interaction the interaction to check
 * @returns whether the interaction is a message modal interaction
 */
export function isMessageModal(
  interaction: APIInteraction,
): interaction is APIModalSubmitInteraction &
  Required<Pick<APIModalSubmitInteraction, 'message' | 'channel_id'>> {
  return isModal(interaction) && Boolean(interaction.message);
}
