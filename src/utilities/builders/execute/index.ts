import { InvalidLanguageComponents, InvalidLanguageEmbed } from './invalid';
import { ResultComponents, ResultEmbed } from './result';
import { CreateModal, EditModal, StartButton } from './start';
import type { New } from '&functions/builderHelpers';

export const Constants = {
    lengths: {
        language: [0, 100],
        code: [0, 900],
        input: [0, 450],
        args: [0, 450],
    },
};

export const Execute = {
    Constants,

    // Start
    CreateModal: CreateModal as unknown as New<typeof CreateModal>,
    EditModal: EditModal as unknown as New<typeof EditModal>,
    StartButton: StartButton as unknown as New<typeof StartButton>,

    // Result
    ResultEmbed: ResultEmbed as unknown as New<typeof ResultEmbed>,
    ResultComponents: ResultComponents as unknown as New<
        typeof ResultComponents
    >,

    // Invalid Language
    InvalidLanguageEmbed: InvalidLanguageEmbed as unknown as New<
        typeof InvalidLanguageEmbed
    >,
    InvalidLanguageComponents: InvalidLanguageComponents as unknown as New<
        typeof InvalidLanguageComponents
    >,
};
