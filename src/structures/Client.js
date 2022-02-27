const { Client } = require('discord.js');

const CommandManager = require('../managers/CommandManager');
const EventManager = require('../managers/EventManager');
const LanguageManager = require('../managers/LanguageManager');
const Database = require('../database');

class Eval extends Client {
    constructor(clientOptions) {
        super(clientOptions);

        this.readyAt = null;

        this.commands = new CommandManager(this);
        this.events = new EventManager(this);
        this.languages = new LanguageManager(this);
        this.database = new Database(this);
    }

    async connect(token) {
        token = token ?? this.token ?? this._token;
        if (!token) throw new Error('No token provided');
        Object.defineProperty(this, '_token', { value: token });

        await this.languages.fetch();
        await this.events.load();
        await this.login(token);
        await this.commands.fetch();
        await this.database.open();

        this.readyAt = new Date();
        return this;
    }

    disconnect() {
        this.readyAt = null;
        this.commands.clear();
        this.events.clear();
        this.destroy();
        return this;
    }

    reload() {
        this.disconnect();
        return this.connect();
    }
}

module.exports = Eval;
