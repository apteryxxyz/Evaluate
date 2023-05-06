import { SaveModal } from './save';
import { ViewComponents, ViewEmbed } from './view';
import type { New } from '&functions/builderHelpers';

export const Constants = {
    lengths: {
        name: [4, 25],
    },
};

// I don't like the name but it's to prevent conflicts with the entity
export const Snippets = {
    Constants,

    SaveModal: SaveModal as unknown as New<typeof SaveModal>,

    ViewEmbed: ViewEmbed as unknown as New<typeof ViewEmbed>,
    ViewComponents: ViewComponents as unknown as New<typeof ViewComponents>,
};
