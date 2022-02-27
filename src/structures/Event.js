class Event {
    constructor(client, options) {
        Object.defineProperty(this, 'client', { value: client });
        this.name = options.name;
        this.emitter = options.emitter;
    }

    async handle() {
        throw new Error(`Event ${this.name} is missing its handle method`);
    }
}

module.exports = Event;