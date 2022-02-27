const { Message, Interaction, CommandInteractionOptionResolver } = require('discord.js');

class Context {
    constructor(command, parent) {
        this.command = command;
        this.parent = parent;
        this.lastReply = null;
    }

    isMessage() {
        return this.parent instanceof Message;
    }

    isInteraction() {
        return this.parent instanceof Interaction;
    }

    async reply(...options) {
        let ownReply = null;
        if (this.isMessage()) ownReply = await this.parent.reply(...options);
        else {
            const action = this.parent.deferred ? 'followUp' : 'reply';
            ownReply = await this.parent[action](...options);
        }
        return this.lastReply = ownReply;
    }

    deferReply(...options) {
        if (this.isMessage()) return this;
        else return this.parent.deferReply(...options);
    }

    editReply(...options) {
        if (this.isMessage()) return this.lastReply.edit(...options);
        else return this.parent.editReply(...options);
    }

    deleteReply(...options) {
        if (this.isMessage()) return this.lastReply.delete(...options);
        else return this.parent.deleteReply(...options);
    }

    get options() {
        if (this.isInteraction()) return this.parent.options;
        const args = JSON.parse(JSON.stringify(this.parent.args));
        const options = this.command.options
            ?.map(o => ({ ...o, value: args.splice(0, o.args).join(' ') }))
            ?.map(o => ({ name: o.name, type: o.type, value: o.value }));
        return new CommandInteractionOptionResolver(this.parent.client, options ?? []);
    }

    get user() {
        if (this.isMessage()) return this.parent.author;
        else return this.parent.user;
    }
}

module.exports = Context;