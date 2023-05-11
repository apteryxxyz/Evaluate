import { EmbedBuilder } from '@discordjs/builders';
import { ms } from 'enhanced-ms';
import { Command } from 'maclary';
import { User } from '&entities/User';
import { buildField } from '&functions/builderHelpers';
import { deferReply } from '&functions/loadingPrefix';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class UserInformation extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'profile',
            description:
                'View the Evaluate profile for a user, or yourself if no user is specified.',

            preconditions: [BeforeCommand],
            options: [
                {
                    type: Command.OptionType.User,
                    name: 'user',
                    description: 'The user to view the profile of.',
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const user = input.options.getUser('user') ?? input.user;
        if (!user || user.bot)
            return input.reply({
                content: 'You cannot view the profile of a bot.',
                ephemeral: true,
            });

        await deferReply(input, 'Gathering statistics...');
        const entity =
            user.entity ??
            (await this.container.database.repository(User).ensure(user));
        await entity.relations({ snippets: true, submissions: true });

        const { mostUsedLanguage } = entity;
        const language = (mostUsedLanguage
            ? await this.container.executor.findLanguage(mostUsedLanguage)
            : undefined) ?? { name: 'None' };

        const snippetCount = entity.snippets?.length ?? 0;
        const submissionCount = entity.submissions?.length ?? 0;
        const pointsCount =
            entity.submissions?.reduce((acc, sub) => acc + sub.score, 0) ?? 0;

        const premiumString = entity.hasPremium
            ? ms(entity.premiumEndsAt!.getTime() - Date.now(), {
                  shortFormat: true,
              })
            : 'None';

        const informationEmbed = new EmbedBuilder()
            .setTitle(`${user.username} Evaluate Information`)
            .setThumbnail(user.displayAvatarURL())
            .setColor(0x2fc086)
            .setFields(
                buildField('Commands Used', entity.commandCount, true),
                buildField('Code Executed', entity.evaluationCount, true),
                buildField('Captures Rendered', entity.captureCount, true),

                buildField('Snippets Made', snippetCount, true),
                buildField('Submissions Made', submissionCount, true),
                buildField('Points Scored', pointsCount, true),

                buildField('Most Used Language', language.name, true),
                buildField('User Premium Time', premiumString, true)
            );

        return input.editReply({ content: null, embeds: [informationEmbed] });
    }
}
