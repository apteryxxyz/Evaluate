import { InteractionType } from 'discord-api-types/v10';
import type {
  APIInteraction,
  APIModalSubmitInteraction,
} from 'discord-api-types/v10';
import { Component } from '.';

export interface ModalComponent {
  type: Component.Type.Modal;
  check: (interaction: APIModalSubmitInteraction) => boolean;
  handler: (interaction: APIModalSubmitInteraction) => Promise<void>;
}

export function createModalComponent(
  check: ModalComponent['check'],
  handler: ModalComponent['handler'],
) {
  return {
    type: Component.Type.Modal,
    check,
    handler,
  } satisfies ModalComponent;
}

export function isModal(
  interaction: APIInteraction,
): interaction is APIModalSubmitInteraction {
  return interaction.type === InteractionType.ModalSubmit;
}

export function isMessageModal(
  interaction: APIInteraction,
): interaction is APIModalSubmitInteraction &
  Required<Pick<APIModalSubmitInteraction, 'message' | 'channel_id'>> {
  return isModal(interaction) && Boolean(interaction.message);
}
