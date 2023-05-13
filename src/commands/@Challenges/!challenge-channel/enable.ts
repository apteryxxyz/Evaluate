import { oneLine } from 'common-tags';
import { ChannelType, channelMention, roleMention } from 'discord.js';
import { Command, Preconditions } from 'maclary';
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

            preconditions: [
                BeforeCommand,
                Preconditions.UserPermissions('ManageGuild'),
            ],
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

        const isText =
            !channel ||
            (channel.type !== ChannelType.GuildText &&
                channel.type !== ChannelType.GuildAnnouncement);
        if (isText)
            return input.reply({
                content: 'The challenge channel must be a text channel.',
                ephemeral: true,
            });

        const hasPremission = input.guild?.members.me
            ?.permissionsIn(channel.id)
            .has(['SendMessages', 'EmbedLinks']);
        if (!hasPremission)
            return input.reply({
                content:
                    'I do not have permission to send messages in that channel.',
                ephemeral: true,
            });

        if (mention && !mention?.mentionable)
            return input.reply({
                content: 'The mention role must be mentionable.',
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
