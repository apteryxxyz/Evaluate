import { Command, Preconditions } from 'maclary';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class DisableChallengeChannelCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'disable',
            description:
                'Disable the automatically code challenge announcements posting.',

            preconditions: [
                BeforeCommand,
                Preconditions.UserPermissions('ManageGuild'),
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const guild = input.guild!.entity!;
        guild.challengeChannelId = null;
        guild.challengeRoleId = null;
        await guild.save();

        return input.reply({
            content: 'Challenge announcements have been disabled.',
            ephemeral: true,
        });
    }
}
