const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const Command = require('../structures/Command');
const Rentry = require('../util/Rentry');
const CustomId = require('../util/CustomId');
const Snippets = require('../util/Snippets');

module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            description: 'Evaluate code. Command will open a modal.',
            types: [Command.TYPES.INTERACTION],
        });
    }

    async run({ interaction, edits = -1, ...defaults }) {
        const options = { id: interaction.id, edits };

        const modal = new Modal()
            .setCustomId(CustomId.create('eval', options))
            .setTitle(':flag_ua: Evaluate Code')
            .addComponents(
                new TextInputComponent()
                    .setCustomId('language')
                    .setLabel('Language')
                    .setStyle('SHORT')
                    .setDefaultValue(defaults.language ?? '')
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('input')
                    .setLabel('Code')
                    .setStyle('LONG')
                    .setDefaultValue(defaults.input ?? '')
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('args')
                    .setLabel('Arguments')
                    .setStyle('SHORT')
                    .setDefaultValue(defaults.arguments ?? ''),
            );

        const client = this.client;
        return showModal(modal, { client, interaction })
    }

    async button(button) {
        const isNotAuthor = button.user.id !== button.message.interaction?.user.id;
        if (isNotAuthor) return deferUpdate();

        const inputs = button.message.embeds[0].fields
            .reduce((a, f) => Object.assign(a, {
                [f.name.toLowerCase()]: f.value.replace(/(^```([a-z0-9]+\n)?|```$)/gi, '')
            }), {});

        const { edits } = CustomId.parse(button.customId);
        const interaction = button;

        return this.run({ interaction, ...inputs, edits })
            .then(() => button.message.delete());
    }

    async modal(modal) {
        const data = CustomId.parse(modal.customId);
        data.edits++;
        let allowEditing = data.edits < 5;

        const languageInput = modal.getTextInputValue('language');
        const language = this.client.languages.resolve(languageInput);
        if (!language) return modal.reply('Invalid language!');

        let input = modal.getTextInputValue('input');
        input = await Snippets.apply(modal.user.id, input);
        const args = modal.getTextInputValue('args')
            ?.split(' ').filter(Boolean);

        await modal.deferReply();
        const result = await language.execute({ input, args });
        const colour = result.success ? 'GREEN' : 'RED';

        if (input.length > 1000) {
            const url = await Rentry.upload(input);
            input = `Input was too long for Discord, uploaded to a [pastebin](${url}).`;
            allowEditing = false;
        } else input = `\`\`\`${language.name}\n${input}\n\`\`\``;

        let output = !result.success ? result.error.message : result.data.output;
        if (!output.length) output = 'No output, ensure you log to the console!';
        if (output.length > 1000) {
            const url = await Rentry.upload(output);
            output = `Output was too long for Discord, uploaded to a [pastebin](${url}).`;
        } else output = `\`\`\`${output}\`\`\``;

        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(CustomId.create('eval', data))
                    .setLabel('Try Again')
                    .setStyle('SECONDARY')
                    .setDisabled(!allowEditing),
            );

        const embed = new MessageEmbed()
            .setTitle(':flag_ua: Evaluation')
            .addField('Language', language.name)
            .addField('Input', input)
            .addField('Output', output)
            .setColor(colour)
            .setTimestamp();
        if (!result.success) embed.setFooter({ text: 'Edit count: ' + data.edits + (data.edits === 5 ? ' (max)' : '') })
        if (args.length) embed.addField('Arguments', '```' + args.join(' ') + '```');

        if (result.success) {
            return modal.editReply({ embeds: [embed] });
        } else {
            return modal.editReply({ embeds: [embed], components: [buttons] });
        }
    }
};