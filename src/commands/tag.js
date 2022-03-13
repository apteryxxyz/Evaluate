const { SlashCommandBuilder } = require('@discordjs/builders');
const Tag = require('../database/models/Tag');
const Command = require('../structures/Command');

module.exports = class Tags extends Command {
    constructor(client) {
        super(client, new SlashCommandBuilder()
            .setName('tag')
            .setDescription('Run a tag in this server.')
            .addStringOption(o => o.setName('name').setDescription('The name of the tag.').setRequired(true))
            .toJSON());
    }

    async run({ interaction }) {
        const name = interaction.options.getString('name');
        const tag = await Tag.findOne({ name, guildId: interaction.guild.id }).exec();
        if (!tag) return interaction.reply('There is no tag with that name in this server.');

        const language = this.client.languages.resolve(tag.language);
        const result = await language.execute({ input: tag.code });
        const string = !result.success ? result.error.message : result.data.output;
        return message.reply(string || 'No output.');
    }
}