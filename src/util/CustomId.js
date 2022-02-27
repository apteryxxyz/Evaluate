class CustomId extends null {
    static create(commandName, options) {
        let customId = commandName;

        if (options) {
            const optionsString = Buffer.from(JSON.stringify(options)).toString('base64');
            customId += optionsString ? `:${optionsString.replace(/=/g, '')}` : ':{}';
        }

        return customId;
    }

    static parse(customId) {
        const [commandName, optionsString] = customId.split(':');
        const options = JSON.parse(Buffer.from(optionsString, 'base64').toString('ascii'));
        return { commandName, ...options };
    }
}

module.exports = CustomId;