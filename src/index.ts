import 'reflect-metadata';
// Environment variables
import './env';
// Dependencies
import process from 'node:process';
import { Lists, Poster, Webhook } from '@maclary/lists';
import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';
import { Maclary, container } from 'maclary';
import { EvaluatorManager } from '&classes/managers/EvaluatorManager';
// Services
import { Autocompleter } from '&services/Autocompleter';
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
        Autocompleter.waitFor(),
        Detector.waitFor(),
        Executor.waitFor(),
        Pastebin.waitFor(),
        Renderer.waitFor(),
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
        new Lists.DiscordBotList(
            process.env.DISCORD_ID,
            process.env.DISCORD_BOT_LIST_API_KEY,
            process.env.DISCORD_BOT_LIST_WEBHOOK_TOKEN
        ),
        new Lists.DiscordsCom(
            process.env.DISCORD_ID,
            process.env.DISCORDS_COM_API_KEY,
            process.env.DISCORDS_COM_WEBHOOK_TOKEN
        ),
        new Lists.DiscordList(
            process.env.DISCORD_ID,
            process.env.DISCORD_LIST_API_KEY
        ),
        new Lists.UniverseList(
            process.env.DISCORD_ID,
            process.env.UNIVERSE_LIST_API_KEY
        ),
    ];
}

function prepareLists() {
    const lists = getLists();

    const webhook = new Webhook(lists, {
        port: Number.parseInt(process.env.PORT, 10),
    });

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
