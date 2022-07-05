import 'dotenv/config';
import { container, MaclaryClient } from 'maclary';
import { ActivityType, Partials } from 'discord.js';
import './container';

const client = new MaclaryClient({
    intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'MessageContent'],
    partials: [Partials.Channel],
    presence: {
        activities: [
            {
                type: ActivityType.Watching,
                name: 'apteryx.xyz | /help',
            },
        ],
    },
    defaultPrefix: 'e!',
    developmentGuildId: '829836158007115806',
    developmentPrefix: 'de!',
});

const token =
    process.env.NODE_ENV === 'development'
        ? process.env.DISCORD_DEV_TOKEN
        : process.env.DISCORD_PROD_TOKEN;

process.on('uncaughtException', (err: any) => {
    delete err.domainEmitter;
    // @ts-ignore Global
    global.lastRecordedError = err;
    console.error(err);
});

void container.providers.loadAll().then((p) => p.initialiseAll());
void container.database.connect();
void client.login(token as string);
export default container;
