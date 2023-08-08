import type {
  APIInteraction,
  APIMessageComponentInteraction,
} from 'discord-api-types/v10';
import { InteractionType } from 'discord-api-types/v10';
import type { ButtonComponent } from './button';
import type { ModalComponent } from './modal';
import type { SelectMenuComponent } from './select-menu';

export * from './button';
export * from './modal';
export * from './select-menu';

export function isMessageComponent(
  interaction: APIInteraction,
): interaction is APIMessageComponentInteraction {
  return interaction.type === InteractionType.MessageComponent;
}

export type Component = ButtonComponent | ModalComponent | SelectMenuComponent;
export namespace Component {
  export enum Type {
    Button = 'button',
    Modal = 'modal',
    SelectMenu = 'select-menu',
  }
}
