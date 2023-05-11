import { SaveModal } from './save';
import { ViewComponents, ViewEmbed } from './view';
import type { New } from '&functions/builderHelpers';

export const Constants = {
    lengths: {
        name: [4, 25],
    },
};

export const Snippets = {
    Constants,

    // Save
    SaveModal: SaveModal as unknown as New<typeof SaveModal>,

    // View
    ViewEmbed: ViewEmbed as unknown as New<typeof ViewEmbed>,
    ViewComponents: ViewComponents as unknown as New<typeof ViewComponents>,
};
