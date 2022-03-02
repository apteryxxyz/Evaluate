const Command = require('../structures/Command');
const { MessageEmbed } = require('discord.js');
const pkg = require('../../package.json');

module.exports = class About extends Command {
    constructor(client) {
        super(client, {
            name: 'statistics',
            description: 'View statistics about the bot.',
            types: Object.values(Command.TYPES)
        });
    }

    async run({ context }) {
        await context.deferReply();
        const developers = this.client.config.developers
        const memoryUsed = formatBytes(process.memoryUsage().heapUsed);
        const { guildCount, userCount } = await globalStats(this.client);

        const embed = new MessageEmbed()
            .setTitle(':flag_ua: Statistics')
            .addField('Name', 'Evaluate', true)
            .addField('Version', `v${pkg.version}`, true)
            .addField('Developers', developers.map(d => `<@${d}>`).join('\n'), true)
            .addField('Programmed', `NodeJS (${process.version})\nDiscord.js (v${pkg.dependencies['discord.js'].slice(1)})`, true)
            .addField('Source Code', 'Private', true)
            .addField('Memory Used', memoryUsed, true)
            .addField('Guild Count', guildCount.toString(), true)
            .addField('User Count', userCount.toString(), true)
            .addField('Dependencies',
                Object.entries(pkg.dependencies)
                    .map(d => `**${d[0]}** (v${d[1].replaceAll('^', '')})`)
                    .join(', '))
            .setColor('WHITE');

        return context.reply({ embeds: [embed] });
    }
}

async function globalStats(client) {
    if (client.shard) {
        const guildCount = await client.shard.fetchClientValues('guilds.cache.size');
        const memberCount = await client.shard.broadcastEval(checkStats);

        return {
            guildCount: guildCount.reduce((a, b) => a + b, 0),
            userCount: memberCount.reduce((a, b) => a + b.userCount, 0),
        }
    } else {
        return checkStats(client);
    }
}

async function checkStats(client) {
    await client.guilds.fetch();
    return {
        guildCount: client.guilds.cache.size,
        userCount: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
