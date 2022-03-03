const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const Command = require('../structures/Command');
const Rentry = require('../util/Rentry');
const CustomId = require('../util/CustomId');
const util = require('util');


module.exports = class DevEval extends Command {
    constructor(client) {
        super(client, new SlashCommandBuilder()
            .setName('deveval')
            .setDescription('Eval for the developer.')
            .setDefaultPermission(false));
    }

    async run({ interaction }) {
        if (interaction.user.id !== process.env.DISCORD_DEVELOPER_ID)
            return interaction.reply({ content: 'You are not an Evaluate developer!', ephemeral: true });

        const modal = new Modal()
            .setCustomId(CustomId.create('deveval', {}))
            .setTitle('Evaluate Code')
            .addComponents(
                new TextInputComponent()
                    .setCustomId('input')
                    .setLabel('Code')
                    .setStyle('LONG')
                    .setRequired(true),
            );

        const client = this.client;
        return showModal(modal, { client, interaction });
    }

    async modal(modal) {
        const input = modal.getTextInputValue('input');
        let colour = 'GREEN';

        const hasAwait = input.match(/await /g);
        const hasReturn = input.match(/return /g);
        const hasResolve = input.match(/(!<?\.)resolve\(/g);
        if (hasAwait && !hasReturn && !hasResolve)
            return modal.reply({ ephemeral: true, content: 'Input has await but is missing a way to return!' });

        const client = this.client;
        await modal.deferReply({ ephemeral: true });
        let output = '';

        try {
            if (!hasAwait && !hasResolve) output = eval(input);
            else if (hasAwait && !hasResolve) output = eval(`(async()=>{${input}})();`);
            else if (hasResolve) output = new Promise((resolve, reject) => eval(`(async()=>{${input}})();`));

            if (output instanceof Promise) output = Promise.resolve(output);
            if (typeof output !== 'string') output = util.inspect(output);
        } catch (error) {
            output = error;
        }

        if (output instanceof Error) {
            const stack = output.stack.toString().split('\n');
            output = stack.slice(0, 5).join('\n');
            colour = 'RED';
        }

        const embed = new MessageEmbed()
            .setTitle('Evaluation Result')
            .addField('Input', '```js\n' + input.slice(0, 1000) + '```')
            .addField('Output', '```js\n' + output.slice(0, 1000) + '```')
            .setColor(colour)
            .setTimestamp();

        return modal.editReply({ ephemeral: true, embeds: [embed] });
    }
}
