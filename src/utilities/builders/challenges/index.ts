import { LeaderboardEmbed } from './leaderboard';
import { ResultEmbed } from './result';
import {
    ConfirmComponents,
    ConfirmEmbed,
    EditSubmitModal,
    SubmitModal,
} from './submit';
import {
    AnnounceEmbed,
    GettingStartedEmbed,
    ViewComponents,
    ViewEmbed,
} from './view';
import type { New } from '&functions/builderHelpers';

export const Challenges = {
    // View
    ViewEmbed: ViewEmbed as unknown as New<typeof ViewEmbed>,
    AnnounceEmbed: AnnounceEmbed as unknown as New<typeof AnnounceEmbed>,
    ViewComponents: ViewComponents as unknown as New<typeof ViewComponents>,
    GettingStartedEmbed: GettingStartedEmbed as unknown as New<
        typeof GettingStartedEmbed
    >,

    // Leaderboard
    LeaderboardEmbed: LeaderboardEmbed as unknown as New<
        typeof LeaderboardEmbed
    >,

    // Submit
    SubmitModal: SubmitModal as unknown as New<typeof SubmitModal>,
    EditSubmitModal: EditSubmitModal as unknown as New<typeof EditSubmitModal>,
    ConfirmEmbed: ConfirmEmbed as unknown as New<typeof ConfirmEmbed>,
    ConfirmComponents: ConfirmComponents as unknown as New<
        typeof ConfirmComponents
    >,

    // Result
    ResultEmbed: ResultEmbed as unknown as New<typeof ResultEmbed>,
};
