class Command {
    constructor(client, options) {
        Object.defineProperty(this, 'client', { value: client });

        this.id = null;
        this.name = options.name;
        this.types = options.types ?? [];
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

    isMessageCommand() {
        return this.types.includes(Command.TYPES.MESSAGE);
    }

    isInteractionCommand() {
        return this.types.includes(Command.TYPES.INTERACTION);
    }

    async run() {
        throw new Error(`Command ${this.name} 'run' method has not been implemented`);
    }

    async modal() {
        throw new Error(`Command ${this.name} 'modal' method has not been implemented`);
    }

    async interaction() {
        throw new Error(`Command ${this.name} 'interaction' method has not been implemented`);
    }
}

Command.TYPES = {
    'MESSAGE': 'MESSAGE',
    'INTERACTION': 'INTERACTION',
}

module.exports = Command;