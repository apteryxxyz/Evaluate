import { SaveModal } from './save';
import type { New } from '&functions/builderHelpers';

export const Constants = {
    strings: {
        name: 'Name for your snippet.',
    },

    lengths: {
        name: [4, 25],
    },
};

// I don't like the name but it's to prevent conflicts with the entity
export const Snip = {
    Constants,

    SaveModal: SaveModal as unknown as New<typeof SaveModal>,
};
