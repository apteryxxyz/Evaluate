require('dotenv').config();
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('src/bot.js', { token: process.env.DISCORD_TOKEN });
manager.on('shardCreate', shard => console.info(`Launched shard ${shard.id}`));
module.exports = manager.spawn().then(() => manager);
