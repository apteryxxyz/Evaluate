import { EmbedBuilder } from '@discordjs/builders';
import { Command } from 'maclary';
import { User } from '&entities/User';
import { deferReply } from '&functions/loadingPrefix';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class UserSubmissionsCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'submissions',
            description: 'View the code challenges submissions of a user.',

            preconditions: [BeforeCommand],
            options: [
                {
                    type: Command.OptionType.User,
                    name: 'user',
                    description: 'The user to view the submissions of.',
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const user = input.options.getUser('user') ?? input.user;
        if (!user || user.bot)
            return input.reply({
                content: 'You cannot view the submissions of a bot.',
                ephemeral: true,
            });

        await deferReply(input, 'Gathering statistics...');
        const entity =
            user.entity ??
            (await this.container.database.repository(User).ensure(user));
        await entity.relations({ submissions: { challenge: true } });

        const submissionCount = entity.submissions?.length ?? 0;
        const totalScore = entity.submissions?.reduce(
            (acc, curr) => acc + curr.score,
            0
        );

        if (submissionCount === 0)
            return input.editReply(
                "This user hasn't made any submissions yet."
            );

        const submissionsString = entity.submissions.map(
            submission =>
                `**${submission.challenge}** - scored ${submission.score} points`
        );
        const totalString = `A total of ${totalScore} points`;

        const submissionsEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s Code Challenge Submissions`)
            .setDescription(submissionsString.join('\n'))
            .setFooter({ text: totalString })
            .setColor(0x2fc086);

        return input.editReply({ content: null, embeds: [submissionsEmbed] });
    }
}

export default null;
