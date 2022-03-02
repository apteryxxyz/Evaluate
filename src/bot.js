const config = require('../config.json');
global.ENV = process.env.ENV = (process.env.ENV || config.env);
require('dotenv').config({ path: `.env.${ENV}` });

const { Intents } = require('discord.js');
const intents = new Intents(Object.values(Intents.FLAGS));
const Client = require('./structures/Client');
const client = new Client({ intents });
client.config = config;
require('discord-modals')(client);
module.exports = client.connect(process.env.DISCORD_TOKEN);
