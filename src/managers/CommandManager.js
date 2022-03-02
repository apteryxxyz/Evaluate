const { CachedManager } = require('discord.js');
const Command = require('../structures/Command');
const path = require('path');
const fs = require('fs');

class CommandManager extends CachedManager {
    constructor(client) {
        super(client, Command);
        this.application = null;
    }

    async load() {
        console.info('Loading commands...');
        this.cache.clear();
        const commandsPath = path.join(__dirname, '../commands');
        await this.loadFolder(commandsPath);
        console.info(`Loaded ${this.cache.size} commands`);
        return this;
    }

    async loadFolder(directoryPath) {
        const folderContents = fs.readdirSync(directoryPath);

        for (const item of folderContents) {
            const itemPath = path.join(directoryPath, item);
            const isFile = fs.lstatSync(itemPath).isFile();

            if (isFile) await this.loadFile(itemPath);
            else await this.loadFolder(itemPath);
        }

        return this;
    }

    async loadFile(commandPath) {
        try {
            const commandClass = require(commandPath);
            delete require.cache[require.resolve(commandPath)];

            const command = new commandClass(this.client);
            this.cache.set(command.name, command);
        } catch (error) {
            console.error(error);
        }

        return this;
    }

    async patch() {
        this.application = ENV === 'development' ?
            await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID) :
            this.client.application;

        await this.application.commands.fetch();
        const externalCommands = this.application.commands.cache.map(c => c.toJSON());
        let localCommands = this.cache.map(c => c.data);
        let shouldUpdate = externalCommands.length !== localCommands.length;

        if (ENV === 'development') localCommands = localCommands.map(addDevToDescription);

        for (const local of localCommands) {
            if (shouldUpdate) break;
            const external = externalCommands.find(c => c.name === local.name);
            if (!external) shouldUpdate = true;
            global.e1 = external;
            global.e2 = local;
            if (!checkPropertiesMatch(external, local)) shouldUpdate = true;
        }

        if (shouldUpdate) {
            console.log('Patching commands...');
            await this.application.commands.set(localCommands);
            console.log('Patched commands');
        }
    }
}

function addDevToDescription(option) {
    option.description = `[DEVLOPMENT] ${option.description}`;
    if (Array.isArray(option.options)) option.options = option.options.map(addDevToDescription);
    return option;
}

function checkPropertiesMatch(obj1, obj2) {
    try {
        let doesMatch = true;

        if (obj1.name !== obj2.name) doesMatch = false;
        if (obj1.value !== obj2.value) doesMatch = false;
        if (obj1.required !== obj2.required) doesMatch = false;
        if (obj1.description !== obj2.description) doesMatch = false;

        if (obj1.options || obj2.options) {
            if (obj1.options && obj2.options.length) {
                obj1.options = obj1.options.sort((a, b) => a.name.localeCompare(b.name));
                obj2.options = obj2.options.sort((a, b) => a.name.localeCompare(b.name));
                const mapped = obj1.options.map((o, i) => checkPropertiesMatch(o, obj2.options[i]));
                if (mapped.includes(false)) doesMatch = false;
            }
        }

        if (obj1.choices || obj2.choices) {
            if (obj1.choices && obj2.choices.length) {
                obj1.choices = obj1.choices.sort((a, b) => a.name.localeCompare(b.name));
                obj2.choices = obj2.choices.sort((a, b) => a.name.localeCompare(b.name));
                const mapped = obj1.choices.map((o, i) => checkPropertiesMatch(o, obj2.choices[i]));
                if (mapped.includes(false)) doesMatch = false;
            }
        }

        return doesMatch;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = CommandManager;