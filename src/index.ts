import 'reflect-metadata';
// Environment variables
import './env';
// Dependencies
import process from 'node:process';
import { Lists, Poster, Webhook } from '@maclary/lists';
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

    prepareLists();
    await prepareClient();
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
}

function getLists() {
    if (process.env.NODE_ENV === 'development') return [];
    return [
        new Lists.UniverseList(
            process.env.DISCORD_ID,
            process.env.UNIVERSE_LIST_KEY
        ),
    ];
}

function prepareLists() {
    const lists = getLists();

    const webhook = new Webhook(lists, { port: 3_004 });
    const poster = new Poster(lists, {
        shardCount: () => 1,
        guildCount: () => container.client.guilds.cache.size,
        userCount: () =>
            container.client.guilds.cache.reduce(
                (a, b) => a + b.memberCount,
                0
            ),
        voiceConnectionCount: () => 0,
    });
    container.lists = { poster, webhook };

    poster.startAutoPoster();
}

declare module 'maclary' {
    export interface Container {
        evaluators: EvaluatorManager;

        lists: {
            poster: Poster;
            webhook: Webhook;
        };
    }
}
