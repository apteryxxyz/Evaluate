const { CachedManager } = require('discord.js');
const Language = require('../structures/Language');
const fetch = require('node-fetch');

class LanguageManager extends CachedManager {
    constructor(client) {
        super(client, Language);
    }

    resolve(resolvable) {
        resolvable = resolvable?.toLowerCase();
        return super.resolve(resolvable)
            || this.cache.find(l => l.aliases.includes(resolvable));
    }

    async fetch() {
        console.info('Loading languages...');
        const url = process.env.PISTON_RUNTIMES_URL;
        const languages = await fetch(url).then(res => res.json());
        for (const lang of languages) {
            const language = new Language(lang);
            this.cache.set(language.name, language);
        }

        console.info(`Loaded ${this.cache.size} languages`);
        return this.cache.size;
    }
}

module.exports = LanguageManager;