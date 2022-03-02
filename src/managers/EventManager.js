const { CachedManager } = require('discord.js');
const Event = require('../structures/Event');
const path = require('path');
const fs = require('fs');

class EventManager extends CachedManager {
    constructor(client) {
        super(client, Event);
    }

    async load() {
        console.info('Loading events...');
        const eventsPath = path.join(__dirname, '../events');
        await this.loadFolder(eventsPath);
        console.info(`Loaded ${this.cache.size} events`);
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

    async loadFile(eventPath) {
        try {
            const eventClass = require(eventPath);
            delete require.cache[require.resolve(eventPath)];

            const event = new eventClass(this.client);
            this.cache.set(event.name, event);
        } catch (error) {
            console.error(error);
        }

        return this;
    }

    async patch() {
        this.client.removeAllListeners();

        for (const event of this.cache.values()) {
            event.emitter.on(event.name, event.handle.bind(event));
        }

        return this;
    }
}

module.exports = EventManager;