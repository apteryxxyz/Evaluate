const Event = require('../structures/Event');

module.exports = class Ready extends Event {
    constructor(client) {
        super(client, {
            name: 'ready',
            emitter: client,
        });
    }

    async handle(client) {
        const statuses = Object.entries(client.config.statuses).filter(x => x[1].length);

        setInterval(() => {
            const [type, options] = statuses[Math.floor(Math.random() * statuses.length)];
            const status = options[~~(Math.random() * statuses.length)];
            client.user.setActivity(status, { type });
            client.user.setStatus('online');
        }, 10000);
    }
}
