import { oneLine } from 'common-tags';
import {
    ChannelType,
    PermissionsBitField,
    channelMention,
    roleMention,
} from 'discord.js';
import { Command } from 'maclary';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class EnableChallengeChannelCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'enable',
            description:
                'Enable automatic code challenge announcements in a specific channel with a specific mention.',
            defaultMemberPermissions: new PermissionsBitField('ManageChannels'),

            preconditions: [BeforeCommand],
            options: [
                {
                    type: Command.OptionType.Channel,
                    name: 'channel',
                    description:
                        'The channel to send challenge announcements to.',
                    required: true,
                },
                {
                    type: Command.OptionType.Role,
                    name: 'mention',
                    description:
                        'What to mention when a new challenge is announced.',
                },
            ],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        const channel = input.options.getChannel('channel', true);
        const mention = input.options.getRole('mention');

        if (channel.type !== ChannelType.GuildText)
            return input.reply({
                content: 'The challenge channel must be a text channel.',
                ephemeral: true,
            });

        const guild = input.guild!.entity!;
        guild.challengeChannelId = channel.id;
        guild.challengeRoleId = mention?.id ?? null;
        await guild.save();

        const channelString = channelMention(channel.id);
        const mentionString = mention ? roleMention(mention.id) : 'no one';

        return input.reply({
            content: oneLine`Challenge announcements will now be sent to
            ${channelString} and will notify ${mentionString}.`,
            ephemeral: true,
        });
    }
}
