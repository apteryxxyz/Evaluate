const { CachedManager } = require('discord.js');
const Command = require('../structures/Command');
const path = require('path');
const fs = require('fs');

class CommandManager extends CachedManager {
    constructor(client) {
        super(client, Command);
        this.hasLoadedOnce = false;
    }

    async _add(data, cache = true) {
        if (!(data instanceof Command)) data = new Command(this.client, data);

        if (data.isInteractionCommand()) {
            const commands = this.client.application.commands;
            let interaction = commands.cache.find(c => c.name === data.name);
            if (!interaction) interaction = await commands.create(data.data);
            else await commands.edit(interaction, data.data);
            data.id = interaction.id;
        }

        if (cache) this.cache.set(data.name, data);
        console.log('    Loaded command: ' + data.name);
        return data;
    }

    async _remove(resolvable) {
        const data = this.resolve(resolvable);
        if (data) this.cache.delete(data.name);
    }

    clear() {
        if (this.cache.size > 0) {
            const toRemove = this.client.application.commands.cache.filter(c => !this.cache.has(c.name));
            this.cache.clear();
            return Promise.all(toRemove.map(c => c.delete()));
        } else this.cache.clear();
    }

    async fetch() {
        await this.client.application.commands.fetch();

        const commandsPath = path.join(__dirname, '../commands');
        const commandFolders = fs.readdirSync(commandsPath);

        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            const isFile = fs.lstatSync(folderPath).isFile();

            if (isFile) {
                await this.addCommandFromFile(folderPath)
            } else {
                const commandFiles = fs.readdirSync(folderPath);

                for (const file of commandFiles) {
                    const commandPath = path.join(folderPath, file);
                    await this.addCommandFromFile(commandPath);
                }
            }
        }

        const action = this.hasLoadedOnce ? 'Reloaded' : 'Loaded';
        console.info(`${action} ${this.cache.size} commands`);
        this.hasLoadedOnce = true;
        return this.cache.size;
    }

    async addCommandFromFile(commandPath) {
        try {
            const commandClass = require(commandPath);
            delete require.cache[require.resolve(commandPath)];

            const command = new commandClass(this.client);
            await this._remove(command);
            await this._add(command);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = CommandManager;
