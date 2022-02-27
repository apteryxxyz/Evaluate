const { MessageEmbed } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const Snippet = require('../database/models/Snippet');
const Command = require('../structures/Command');
const CustomId = require('../util/CustomId');

module.exports = class Snippets extends Command {
    constructor(client) {
        super(client, {
            name: 'snippets',
            description: 'View and manage your code snippets.',
            types: [Command.TYPES.INTERACTION],

            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'list',
                    description: 'View a list of your snippets.',
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'view',
                    description: 'View one of your snippets.',
                    options: [
                        {
                            name: 'name',
                            type: 'STRING',
                            description: 'The name of the snippet.',
                            required: true,
                        },
                    ],
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'create',
                    description: 'Create a code snippet, command will open a modal.',
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'delete',
                    description: 'Delete an existing snippet.',
                    options: [
                        {
                            name: 'name',
                            type: 'STRING',
                            description: 'The name of the snippet.',
                            required: true,
                        },
                    ],
                }
            ],
        });
    }

    async run({ interaction, command, ...defaults }) {
        command ??= interaction.options.getSubcommand();
        const options = { id: interaction.id };

        if (command === 'list') {
            const snippets = await Snippet.find({ ownerId: interaction.user.id }).exec();
            const fields = snippets.map(s => {
                const code = s.code.length > 100 ? `${s.code.slice(0, 100)}...` : s.code;
                const value = `Language: ${s.language}\n\`\`\`${s.language}\n${code}\`\`\``;
                return { name: 'Name: ' + s.name, value };
            });

            const embed = new MessageEmbed()
                .setTitle(':flag_ua: Your Snippets')
                .setFields(fields)
                .setColor('DARK_GREEN');
            return interaction.reply({ embeds: [embed] });
        }

        if (command === 'view') {
            const name = interaction.options.getString('name');
            const snippet = await Snippet.findOne({ name, ownerId: interaction.user.id }).exec();
            if (!snippet) return interaction.reply('You do not have a snippet with that name.');

            const embed = new MessageEmbed()
                .setTitle(snippet.name)
                .addField('Language', snippet.language, true)
                .addField('Code', '```' + snippet.language + '\n' + snippet.code + '```')
                .setColor('DARK_GREEN');
            return interaction.reply({ embeds: [embed] });
        }

        if (command === 'create') {
            options.command = command;

            const modal = new Modal()
                .setCustomId(CustomId.create('snippets', options))
                .setTitle(`Create Snippet`)
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('name')
                        .setLabel('Name')
                        .setStyle('SHORT')
                        .setRequired(true),
                    new TextInputComponent()
                        .setCustomId('language')
                        .setLabel('Language')
                        .setStyle('SHORT')
                        .setDefaultValue(defaults.language)
                        .setRequired(true),
                    new TextInputComponent()
                        .setCustomId('code')
                        .setLabel('Code')
                        .setStyle('LONG')
                        .setDefaultValue(defaults.input)
                        .setRequired(true),
                );

            const client = interaction.client;
            return showModal(modal, { client, interaction });
        }

        if (command === 'delete') {
            const name = interaction.options.getString('name');
            const snippet = await Snippet.findOne({ name, ownerId: interaction.user.id }).exec();
            if (!snippet) return interaction.reply('You do not have a snippet with that name.');

            Snippet.deleteOne({ name, ownerId: interaction.user.id }).exec();
            return interaction.reply('Snippet deleted.');
        }
    }

    async modal(modal) {
        const { command } = CustomId.parse(modal.customId);

        if (['create', 'edit'].includes(command)) {
            const languageInput = modal.getTextInputValue('language');
            const language = this.client.languages.resolve(languageInput);
            if (!language) return modal.reply('Invalid language!');

            const name = modal.getTextInputValue('name').toLowerCase();
            if (!name.match(/^[a-z_]+$/i)) return modal.reply('Name can only be letters and underscores!');

            await modal.deferReply();
            const snippets = await Snippet.find({ ownerId: modal.user.id }).exec();

            const lenmsg = 'You have reached the maximum number of snippets!';
            if (snippets.length >= 10) return modal.reply(lenmsg);
            const aes = 'You already have a snippet with that name!';
            if (snippets.find(s => s.name === name)) return modal.editReply(aes);

            const code = modal.getTextInputValue('code');

            const snippet = new Snippet({
                name,
                ownerId: modal.user.id,
                language: language.name,
                code,
            });

            const retmsg = command === 'create' ? 'Created snippet!' : 'Edited snippet!';
            return snippet.save()
                .then(() => modal.editReply(retmsg))
                .catch(error => {
                    console.error(error);
                    return modal.editReply('An error occurred while saving the snippet!');
                });
        }
    }
}