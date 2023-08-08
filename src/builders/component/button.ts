import { ComponentType, InteractionType } from 'discord-api-types/v10';
import type {
  APIInteraction,
  APIMessageComponentButtonInteraction,
} from 'discord-api-types/v10';
import { Component } from '.';

export interface ButtonComponent {
  type: Component.Type.Button;
  check: (interaction: APIMessageComponentButtonInteraction) => boolean;
  handler: (interaction: APIMessageComponentButtonInteraction) => Promise<void>;
}

export function createButtonComponent(
  check: ButtonComponent['check'],
  handler: ButtonComponent['handler'],
) {
  return {
    type: Component.Type.Button,
    check,
    handler,
  } satisfies ButtonComponent;
}

export function isButton(
  interaction: APIInteraction,
): interaction is APIMessageComponentButtonInteraction {
  return (
    interaction.type === InteractionType.MessageComponent &&
    interaction.data.component_type === ComponentType.Button
  );
}
