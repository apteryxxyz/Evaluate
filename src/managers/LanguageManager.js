const { CachedManager } = require('discord.js');
const Language = require('../structures/Language');
const fetch = require('node-fetch');

class LanguageManager extends CachedManager {
    constructor(client) {
        super(client, Language);
    }

    async _add(data, cache = true) {
        if (!(data instanceof Language)) data = new Language(data);
        if (cache) this.cache.set(data.name, data);
        return data;
    }

    async _remove(resolvable) {
        const data = this.resolve(resolvable);
        if (!data) return null;
        this.cache.delete(data.name);
        return data;
    }

    resolve(resolvable) {
        resolvable = resolvable?.toLowerCase();
        return super.resolve(resolvable)
            || this.cache.find(l => l.aliases.includes(resolvable));
    }

    async fetch() {
        const url = process.env.PISTON_RUNTIMES_URL;
        const languages = await fetch(url).then(res => res.json());
        for (const lang of languages) await this._add(lang);

        const action = this.hasLoadedOnce ? 'Reloaded' : 'Loaded';
        console.info(`${action} ${this.cache.size} languages`);
        this.hasLoadedOnce = true;
        return this.cache.size;
    }
}

module.exports = LanguageManager;