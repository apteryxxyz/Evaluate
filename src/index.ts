import 'reflect-metadata';
// Environment variables
import './env';
// Dependencies
import process from 'node:process';
import { Lists, Poster } from '@maclary/lists';
import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';
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

    await Promise.all([
        Renderer.waitFor(),
        Pastebin.waitFor(),
        Executor.waitFor(),
        Detector.waitFor(),
    ]);

    await prepareClient().then(client => prepareLists(client));
}

async function prepareClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages,
        ],
        partials: [Partials.Channel, Partials.Reaction],
        presence: {
            activities: [
                {
                    type: ActivityType.Watching,
                    name: 'code execution',
                },
            ],
        },
    });

    const maclary = new Maclary({
        guildId:
            process.env.NODE_ENV === 'development'
                ? process.env.DISCORD_GUILD_ID
                : undefined,
    });

    Maclary.init(maclary, client);
    await client.login(process.env.DISCORD_TOKEN);
    return client;
}

function prepareLists(client: Client<true>) {
    if (process.env.NODE_ENV === 'development') return;

    const lists = [
        new Lists.UniverseList(client.user.id, process.env.UNIVERSE_LIST_KEY),
    ];

    const poster = new Poster(lists, {
        shardCount: () => 1,
        guildCount: () => client.guilds.cache.size,
        userCount: () =>
            client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
        voiceConnectionCount: () => 0,
    });

    poster.startAutoPoster();
    return poster;
}

declare module 'maclary' {
    export interface Container {
        evaluators: EvaluatorManager;
    }
}
