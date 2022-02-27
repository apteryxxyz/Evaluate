const Event = require('../structures/Event');
const Context = require('../structures/Context');
const Tag = require('../database/models/Tag');

module.exports = class MessageCreate extends Event {
    constructor(client) {
        super(client, {
            name: 'messageCreate',
            emitter: client,
        });
    }

    async handle(message) {
        if (message.author.bot || !this.client.isReady()) return;
        const prefix = this.client.config.prefix;
        if (!message.content.startsWith(prefix)) return;

        const commandArgs = message.content.split(' ');
        const commandName = commandArgs.shift().slice(prefix.length).toLowerCase();
        const command = this.client.commands.cache.get(commandName);
        if (command && !command.isMessageCommand()) return;

        if (!command) {
            const tag = await Tag.findOne({ guildId: message.guild.id, name: commandName }).exec();
            if (!tag) return;

            const language = this.client.languages.resolve(tag.language);
            const result = await language.execute({ input: tag.code, args: commandArgs });
            const string = !result.success ? result.error.message : result.data.output;
            return message.reply(string || 'No output.');
        } else {
            message.args = commandArgs;
            const context = new Context(command, message);

            return command
                .run({ context, message })
                .catch(error => {
                    console.error(error);
                    context.editReply({ context: 'An error occured while executing this command.' });
                });
        }
    }
}
