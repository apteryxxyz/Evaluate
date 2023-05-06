import { ResultEmbed } from './result';
import { StartModal } from './start';
import type { New } from '&functions/builderHelpers';

export const Constants = {
    descriptions: {
        code: 'The code to identify, omitting this option will prompt you for the code.',
    },

    placeholders: {
        code: 'The code to identify...',
    },

    lengths: {
        code: [4, 900],
    },
};

export const Identify = {
    Constants,

    StartModal: StartModal as unknown as New<typeof StartModal>,

    ResultEmbed: ResultEmbed as unknown as New<typeof ResultEmbed>,
};
