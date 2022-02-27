const { CachedManager } = require('discord.js');
const Event = require('../structures/Event');
const path = require('path');
const fs = require('fs');

class EventManager extends CachedManager {
    constructor(client) {
        super(client, Event);
        this.hasLoadedOnce = false;
    }

    async _add(data, cache = true) {
        if (!(data instanceof Event)) data = new Event(this.client, data);
        data.emitter.on(data.name, data.handle.bind(data));
        if (cache) this.cache.set(data.name, data);
        return data;
    }

    async _remove(resolvable) {
        const data = this.resolve(resolvable);
        if (!data) return null;
        data.emitter.off(data.name, data.handle.bind(data));
        this.cache.delete(data.name);
        return data;
    }

    clear() {
        return this.cache.each(e => this._remove(e));
    }

    async load() {
        this.clear();

        const eventsPath = path.join(__dirname, '../events');
        const eventFiles = fs.readdirSync(eventsPath);

        for (const file of eventFiles) {
            const eventPath = path.join(eventsPath, file);
            const eventClass = require(eventPath);
            delete require.cache[require.resolve(eventPath)];

            const event = new eventClass(this.client);
            await this._add(event);
        }

        const action = this.hasLoadedOnce ? 'Reloaded' : 'Loaded';
        console.info(`${action} ${this.cache.size} events`);
        this.hasLoadedOnce = true;
        return this.cache.size;
    }
}

module.exports = EventManager;
