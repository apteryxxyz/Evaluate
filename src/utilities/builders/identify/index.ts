import { ResultEmbed } from './result';
import { StartModal } from './start';
import type { New } from '&functions/builderHelpers';

export const Constants = {
    strings: {
        code: 'The code to identify.',
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
