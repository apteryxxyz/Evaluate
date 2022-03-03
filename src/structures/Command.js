class Command {
    constructor(client, options) {
        Object.defineProperty(this, 'client', { value: client });

        this.id = null;
        Object.assign(this, options);
        this.options = options.options || [];
        this.choices = options.choices || [];
        this.defaultPermission = options.defaultPermission || true;
    }

    get data() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            defaultPermission: this.defaultPermission,
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