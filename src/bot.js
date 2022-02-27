require('dotenv').config();
const { Intents } = require('discord.js');
const intents = new Intents(Object.values(Intents.FLAGS));
const Client = require('./structures/Client');
const client = new Client({ intents });
require('discord-modals')(client);
client.config = require('../config.json');
module.exports = client.connect(process.env.DISCORD_TOKEN);
