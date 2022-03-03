class Command {
    constructor(client, options) {
        Object.defineProperty(this, 'client', { value: client });

        this.id = null;
        this.name = options.name;
        this.description = options.description;
        this.options = options.options ?? [];
    }

    get data() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
        };
    }

    async run() {
        throw new Error(`Command ${this.name} 'run' method has not been implemented`);
    }

    async modal() {
        throw new Error(`Command ${this.name} 'modal' method has not been implemented`);
    }

    async button() {
        throw new Error(`Command ${this.name} 'interaction' method has not been implemented`);
    }
}

module.exports = Command;