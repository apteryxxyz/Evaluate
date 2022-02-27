const { MessageEmbed } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const Tag = require('../database/models/Tag');
const Command = require('../structures/Command');
const CustomId = require('../util/CustomId');

module.exports = class Tags extends Command {
    constructor(client) {
        super(client, {
            name: 'tags',
            description: 'View and manage this servers tags.',
            types: [Command.TYPES.INTERACTION],

            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'list',
                    description: 'View a list of the servers tags.',
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'view',
                    description: 'View one of the servers tags.',
                    options: [
                        {
                            name: 'name',
                            type: 'STRING',
                            description: 'The name of the tag.',
                            required: true,
                        },
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'create',
                    description: 'Create a new tag, command will open a modal.',
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'delete',
                    description: 'Delete an existing tag.',
                    options: [
                        {
                            name: 'name',
                            type: 'STRING',
                            description: 'The name of the tag.',
                            required: true,
                        },
                    ]
                },
            ],
        });
    }

    async run({ interaction, command, ...defaults }) {
        command ??= interaction.options.getSubcommand();
        const options = { id: interaction.id };

        const hasPermission = interaction.member.permissions.has('MANAGE_GUILD');
        if (!hasPermission) return interaction.reply({ content: 'You do now have permission to do that!', ephemeral: true });

        if (command === 'list') {
            const tags = await Tag.find({ guildId: interaction.guild.id }).exec();
            const fields = tags.map(t => {
                const code = t.code.length > 100 ? `${t.code.slice(0, 100)}...` : t.code;
                const value = `Language: ${t.language}\n\`\`\`${t.language}\n${code}\`\`\``;
                return { name: 'Name: ' + t.name, value };
            });

            const embed = new MessageEmbed()
                .setTitle(':flag_ua: This Servers Tags')
                .setFields(fields)
                .setColor('DARK_GREEN');
            return interaction.reply({ embeds: [embed] });
        }

        if (command === 'view') {
            const name = interaction.options.getString('name');
            const tag = await Tag.findOne({ name, guildId: interaction.guild.id }).exec();
            if (!tag) return interaction.reply('There is no tag with that name in this server.');

            const embed = new MessageEmbed()
                .setTitle(tag.name)
                .addField('Language', tag.language, true)
                .addField('Code', '```' + tag.language + '\n' + tag.code + '```')
                .setColor('DARK_GREEN');
            return interaction.reply({ embeds: [embed] });
        }

        if (command === 'create') {
            options.command = command;

            const modal = new Modal()
                .setCustomId(CustomId.create('tags', options))
                .setTitle(`Create Tag`)
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
            const tag = await Tag.findOne({ name, guildId: interaction.guild.id }).exec();
            if (!tag) return interaction.reply('There is no tag with that name in this server.');

            Tag.deleteOne({ name, guildId: interaction.guild.id }).exec();
            return interaction.reply('Tag deleted.');
        }
    }

    async modal(modal) {
        const { command } = CustomId.parse(modal.customId);

        if (['create', 'edit'].includes(command)) {
            const languageInput = modal.getTextInputValue('language');
            const language = this.client.languages.resolve(languageInput);
            if (!language) return modal.reply('Invalid language!');

            const name = modal.getTextInputValue('name').toLowerCase();
            if (!name.match(/^[a-z_]+$/)) return modal.reply('Name can only be letters and underscores!');

            await modal.deferReply();
            const tags = await Tag.find({ guildId: modal.guild.id }).exec();

            const lenmsg = 'Your server has reached the maximum number of tags!';
            if (tags.length >= 10) return modal.reply(lenmsg);
            const aes = 'A tag with that name already exists in this server!';
            if (tags.find(t => t.name === name)) return modal.editReply(aes);

            const code = modal.getTextInputValue('code');

            const tag = new Tag({
                name,
                guildId: modal.guild.id,
                language: language.name,
                code,
                creatorId: modal.user.id,
            });

            return tag.save()
                .then(() => modal.editReply('Created tag!'))
                .catch(error => {
                    console.error(error);
                    return modal.editReply('An error occurred while saving the tag!');
                });
        }
    }
}