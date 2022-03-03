const Command = require('../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Languages extends Command {
    constructor(client) {
        super(client, {
            name: 'languages',
            description: 'View a list of avaiable languages.',
        });
    }

    async run({ context }) {
        const languages = this.client.languages.cache
            .sort((a, b) => a.name.localeCompare(b.name));

        const first = [], second = [], third = [];
        for (const [name, language] of this.client.languages.cache) {
            if ('abcdef'.includes(name[0].toLowerCase())) {
                first.push(`${name} (v${language.version})`);
            } else if ('ghijklmno'.includes(name[0].toLowerCase())) {
                second.push(`${name} (v${language.version})`);
            } else {
                third.push(`${name} (v${language.version})`);
            }
        }

        const embed = new MessageEmbed()
            .setColor('WHITE')
            .setTitle(':flag_ua: Avaiable Languages')
            .setFooter({ text: `A total of ${languages.size}` })
            .addField('A - F', first.join('\n'), true)
            .addField('G - O', second.join('\n'), true)
            .addField('P - Z', third.join('\n'), true);
        return context.reply({ embeds: [embed] });
    }
}
