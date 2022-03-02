require('dotenv').config();
global.ENV = process.env.ENV;

const { Intents } = require('discord.js');
const intents = new Intents(Object.values(Intents.FLAGS));
const Client = require('./structures/Client');
const client = new Client({ intents });
client.config = require('../config.json');
require('discord-modals')(client);
module.exports = client.connect(process.env.DISCORD_TOKEN);
