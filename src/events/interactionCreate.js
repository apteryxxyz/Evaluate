const Event = require('../structures/Event');
const Context = require('../structures/Context');
const CustomId = require('../util/CustomId');

module.exports = class InteractionCreate extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionCreate',
            emitter: client,
        });
    }

    async handle(interaction) {
        if (interaction.isCommand()) {
            return this.handleCommand(interaction);
        } else if (interaction.isButton()) {
            return this.handleButton(interaction);
        }
    }

    async handleCommand(interaction) {
        global.command = interaction;
        const command = this.client.commands.cache.get(interaction.commandName);
        const context = new Context(command, interaction);

        return command
            .run({ context, interaction })
            .catch(error => {
                console.error(error);
                const action = interaction.deferred ? 'editReply' : 'reply';
                interaction[action]({ ephemeral: true, content: 'An error occured while executing this command.' });
            })
    }

    async handleButton(interaction) {
        global.button = interaction;
        const { commandName } = CustomId.parse(interaction.customId);
        const command = this.client.commands.cache.get(commandName);

        return command
            .button(interaction)
            .catch(error => {
                console.error(error)
            });
    }
}
