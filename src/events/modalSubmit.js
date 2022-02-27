const Event = require('../structures/Event');

module.exports = class ModalSubmit extends Event {
    constructor(client) {
        super(client, {
            name: 'modalSubmit',
            emitter: client,
        });
    }

    async handle(modal) {
        const [commandName] = modal.customId.split(':');
        const command = this.client.commands.cache.get(commandName);
        if (!command) return;
        return command.modal(modal)
    }
}
