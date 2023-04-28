import 'reflect-metadata';

// Environment variables
import './env';

// Dependencies
import process from 'node:process';
import { RequestContext } from '@mikro-orm/core';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { Maclary, container } from 'maclary';
import { EvaluatorManager } from '&classes/EvaluatorManager';
import { Capture } from '&services/Capture';
import { Database } from '&services/Database';
import { Executor } from '&services/Executor';
import { Pastebin } from '&services/Pastebin';

void main();
async function main() {
    container.evaluators = new EvaluatorManager();

    await Capture.waitFor();
    await Database.waitFor();
    await Executor.waitFor();
    await Pastebin.waitFor();

    RequestContext.create(container.database.orm.em, async () => {
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

    const maclary = new Maclary({});

    Maclary.init(maclary, client);
    return client.login(process.env.DISCORD_TOKEN);
}

declare module 'maclary' {
    export interface Container {
        capture: Capture;
        database: Database;
        executor: Executor;
        pastebin: Pastebin;

        evaluators: EvaluatorManager;
    }
}
