const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const Command = require('../structures/Command');
const Rentry = require('../util/Rentry');
const CustomId = require('../util/CustomId');

module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            description: 'Evaluate a piece of code, command will open a modal.',
            types: [Command.TYPES.INTERACTION],
        });
    }

    async run({ interaction, ...defaults }) {
        const modal = new Modal()
            .setCustomId(CustomId.create('eval', {}))
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
        return showModal(modal, { client, interaction });
    }

    async modal(modal) {
        global.modal = modal;

        const languageInput = modal.getTextInputValue('language');
        const language = this.client.languages.resolve(languageInput);
        if (!language) return modal.reply('Invalid language.');

        let input = modal.getTextInputValue('input');
        const args = modal.getTextInputValue('args')
            ?.split(' ').filter(Boolean);

        await modal.deferReply();
        const result = await language.execute({ input, args });
        const colour = result.success ? 'GREEN' : 'RED';
        let allowEditing = !result.success;

        let output = !result.success ? result.error.message : result.data.output;
        if (!output.length) {
            output = 'No output, ensure you log to the console!';
            allowEditing = true;
        }

        if (input.length > 1000) {
            const url = await Rentry.upload(input);
            input = `Input was too long for Discord, uploaded to a [pastebin](${url}).`;
            allowEditing = false;
        } else input = `\`\`\`${language.name}\n${input}\n\`\`\``;

        if (output.length > 1000) {
            const url = await Rentry.upload(output);
            output = `Output was too long for Discord, uploaded to a [pastebin](${url}).`;
        } else output = `\`\`\`${output}\`\`\``;

        const data = {};
        const buttons = new MessageActionRow();

        if (!result.success) {
            data.click = 'try-again';
            buttons.addComponents(
                new MessageButton()
                    .setCustomId(CustomId.create('eval', data))
                    .setLabel('Try Again')
                    .setStyle('SECONDARY')
                    .setDisabled(!allowEditing),
            );
        } else {
            buttons.addComponents(
                new MessageButton()
                    .setCustomId(CustomId.create('eval', { click: 'save-snippet' }))
                    .setLabel('Save As Snippet')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId(CustomId.create('eval', { click: 'save-tag' }))
                    .setLabel('Save As Tag')
                    .setStyle('SECONDARY'),
            );
        }

        const embed = new MessageEmbed()
            .setTitle(':flag_ua: Evaluation')
            .addField('Language', language.name)
            .addField('Input', input)
            .addField('Output', output)
            .setColor(colour)
            .setTimestamp();

        if (args.length) embed.addField('Arguments', '```' + args.join(' ') + '```');

        return modal.editReply({ embeds: [embed], components: [buttons], fetchReply: true })
            .then(reply => {
                const collector = reply.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
                collector.on('collect', c => this.button(reply, c));
                collector.on('end', () => reply.edit({ components: [] }));
            });
    }

    async button(reply, collected) {
        global.reply = reply;
        global.collected = collected;

        if (!collected) return;
        const { click } = CustomId.parse(collected.customId);

        const inputs = button.message.embeds[0].fields
            .reduce((a, f) => Object.assign(a, {
                [f.name.toLowerCase()]:
                    f.value.replace(/(^```([a-z0-9]+\n)?|```$)/gi, '')
            }), {});

        if (click === 'try-again') {
            const interaction = collected;
            return this.run({ interaction, ...inputs });
        }

        if (click === 'save-snippet') {
            const interaction = collected;
            const command = this.client.commands.cache.get('snippets');
            return command.run({ interaction, command: 'create', ...inputs });
        }

        if (click === 'save-tag') {
            const interaction = collected;
            const command = this.client.commands.cache.get('tags');
            return command.run({ interaction, command: 'create', ...inputs });
        }
    }
}
