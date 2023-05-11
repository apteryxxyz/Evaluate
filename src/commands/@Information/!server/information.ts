import { EmbedBuilder } from '@discordjs/builders';
import { ms } from 'enhanced-ms';
import { Command, Preconditions } from 'maclary';
import { buildField } from '&functions/builderHelpers';
import { deferReply } from '&functions/loadingPrefix';
import { BeforeCommand } from '&preconditions/BeforeCommand';

export class ServerInformation extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'information',
            description:
                'Shows statistics and information related to Evaluate for this server.',
            dmPermission: false,

            preconditions: [BeforeCommand, Preconditions.GuildOnly],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        await deferReply(input, 'Gathering statistics...');

        const guild = input.guild!;
        const entity = guild.entity!;

        const { mostUsedLanguage } = entity;
        const language = (mostUsedLanguage
            ? await this.container.executor.findLanguage(mostUsedLanguage)
            : undefined) ?? { name: 'None' };

        const premiumString = entity.hasPremium
            ? ms(entity.premiumEndsAt!.getTime() - Date.now(), {
                  shortFormat: true,
              })
            : 'None';

        const informationEmbed = new EmbedBuilder()
            .setTitle(`${guild.name} Evaluate Information`)
            .setThumbnail(guild.iconURL()!)
            .setColor(0x2fc086)
            .setFields(
                buildField('Commands Used', entity.commandCount, true),
                buildField('Code Executed', entity.evaluationCount, true),
                buildField('Captures Rendered', entity.captureCount, true),

                buildField('Most Used Language', language.name, true),
                buildField('Server Premium Time', premiumString, true)
            );

        return input.editReply({ content: null, embeds: [informationEmbed] });
    }
}
