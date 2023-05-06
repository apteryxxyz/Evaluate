import { CommandsEmbed } from './commands';
import { ActionComponents, LinkComponents, MainEmbed } from './main';
import { PremiumEmbed, VoteComponents } from './premium';
import type { New } from '&functions/builderHelpers';

export const Help = {
    MainEmbed: MainEmbed as unknown as New<typeof MainEmbed>,
    ActionComponents: ActionComponents as unknown as New<
        typeof ActionComponents
    >,
    LinkComponents: LinkComponents as unknown as New<typeof LinkComponents>,

    PremiumEmbed: PremiumEmbed as unknown as New<typeof PremiumEmbed>,
    VoteComponents: VoteComponents as unknown as New<typeof VoteComponents>,

    CommandsEmbed: CommandsEmbed as unknown as New<typeof CommandsEmbed>,
};
