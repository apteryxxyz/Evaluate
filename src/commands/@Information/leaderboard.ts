import { Command } from 'maclary';
import { Challenges } from '&builders/challenges';
import { deferReply } from '&functions/loadingPrefix';

export class LeaderboardCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'leaderboard',
            description: 'Shows the top 10 users with the most points.',
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await deferReply(input, 'Gathering leaderboard...');
        return input.editReply({
            content: null,
            embeds: [await new Challenges.LeaderboardEmbed(input.user.id)],
        });
    }
}
