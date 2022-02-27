const Event = require('../structures/Event');

module.exports = class Message extends Event {
    constructor(client) {
        super(client, {
            name: 'message',
            emitter: process,
        });
    }

    async handle(message) {

    }
}
