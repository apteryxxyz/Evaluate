import {
  APIInteraction,
  APIMessageComponentButtonInteraction,
  ComponentType,
  InteractionType,
} from 'discord-api-types/v10';

export interface ButtonComponent {
  type: ComponentType.Button;
  check(interaction: APIMessageComponentButtonInteraction): boolean;
  handler(interaction: APIMessageComponentButtonInteraction): Promise<unknown>;
}

/**
 * Create a new button component.
 * @param check function that checks if the interaction is for this button
 * @param handler function that handles the interaction
 * @returns a new button component
 */
export function createButtonComponent(
  check: ButtonComponent['check'],
  handler: ButtonComponent['handler'],
): ButtonComponent {
  return { type: ComponentType.Button, check, handler };
}

/**
 * Check if an interaction is a button interaction.
 * @param interaction the interaction to check
 * @returns whether the interaction is a button interaction
 */
export function isButton(
  interaction: APIInteraction,
): interaction is APIMessageComponentButtonInteraction {
  return (
    interaction.type === InteractionType.MessageComponent &&
    interaction.data.component_type === ComponentType.Button
  );
}
