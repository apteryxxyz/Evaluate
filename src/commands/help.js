const Command = require('../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Help and information for the Evaluate bot.',
        });
    }

    async run({ context }) {
        const embed = new MessageEmbed()
            .setTitle(':flag_ua: Welcome to Evaluate')
            .setDescription('Evaluate is a Discord that allows you to run' +
                'code in over 70 different languages. Save code as snippets ' +
                'for lately use or create custom commands in a language you know!')
            .addField('Languages', 'Use the `languages` command to view the list of languages.')
            .addField('Commands', 'Use the `commands` command to view the list of commands.')
            .addField('Support', `If you need any help, join the [support server](${process.env.DISCORD_GUILD_INVITE}).`)
            .addField('Invite', `You can invite Evaluate to your server by using the [invite link](${process.env.DISCORD_BOT_INVITE}).`)
            .setColor('WHITE')
            .setTimestamp();
        return context.reply({ embeds: [embed] });
    }
}
