const Command = require('../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'commands',
            description: 'List of all available Evaluate commands.',
        });
    }

    async run({ context }) {
        const commands = [];
        for (const [, c] of this.client.commands.cache) {
            addCommand(commands, c);
        }

        const embed = new MessageEmbed()
            .setTitle(':flag_ua: Evaluate Commands')
            .setFields(commands.map(c => ({
                name: `/${c.name}`,
                value: c.description,
                inline: true,
            })))
            .setColor('WHITE')
            .setTimestamp();
        return context.reply({ embeds: [embed] });
    }
}

function addCommand(commands, command, fullName = command.name) {
    const hasSubCommands = command.options?.
        find(o => ['SUB_COMMAND', 'SUB_COMMAND_GROUP', 1, 2].includes(o.type));

    if (hasSubCommands) {
        for (const cmd of command.options)
            addCommand(commands, cmd, `${fullName} ${cmd.name}`);
        return;
    }

    commands.push({
        name: fullName,
        description: command.description,
        inline: true,
    });
}
