import 'reflect-metadata';
// Environment variables
import './env';
// Dependencies
import process from 'node:process';
import { RequestContext } from '@mikro-orm/core';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { Maclary, container } from 'maclary';
import { EvaluatorManager } from '&classes/EvaluatorManager';
// Services
import { Database } from '&services/Database';
import { Detector } from '&services/Detector';
import { Executor } from '&services/Executor';
import { Pastebin } from '&services/Pastebin';
import { Renderer } from '&services/Renderer';

void main();
async function main() {
    container.evaluators = new EvaluatorManager();
    await Database.waitFor();

    RequestContext.create(container.database.orm.em, async () => {
        await Promise.all([
            Renderer.waitFor(),
            Pastebin.waitFor(),
            Executor.waitFor(),
            Detector.waitFor(),
        ]);

        await prepareClient();
    });
}

function prepareClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages,
        ],
        partials: [Partials.Channel, Partials.Reaction],
    });

    const maclary = new Maclary({
        guildId:
            process.env.NODE_ENV === 'development'
                ? process.env.DISCORD_GUILD_ID
                : undefined,
    });

    Maclary.init(maclary, client);
    return client.login(process.env.DISCORD_TOKEN);
}

declare module 'maclary' {
    export interface Container {
        evaluators: EvaluatorManager;
    }
}
