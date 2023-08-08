import type {
  APIInteraction,
  APIMessageComponentSelectMenuInteraction,
} from 'discord-api-types/v10';
import { InteractionType } from 'discord-api-types/v10';
import { Component } from '.';

export interface SelectMenuComponent {
  type: Component.Type.SelectMenu;
  check: (interaction: APIMessageComponentSelectMenuInteraction) => boolean;
  handler: (
    interaction: APIMessageComponentSelectMenuInteraction,
  ) => Promise<void>;
}

export function createSelectMenuComponent(
  check: SelectMenuComponent['check'],
  handler: SelectMenuComponent['handler'],
) {
  return {
    type: Component.Type.SelectMenu,
    check,
    handler,
  } satisfies SelectMenuComponent;
}

export function isSelectMenu(
  interaction: APIInteraction,
): interaction is APIMessageComponentSelectMenuInteraction {
  return interaction.type === InteractionType.MessageComponent;
}
