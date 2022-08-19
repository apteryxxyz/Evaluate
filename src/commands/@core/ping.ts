import { IncrementCommandCount } from '@preconditions/IncrementCommandCount';
import { Context } from '@maclary/context';
import { oneLine } from 'common-tags';
import type { Message } from 'discord.js';
import { Command, container } from 'maclary';
import { connection } from 'mongoose';

const PINGS = {
    latency: 0,
    rest: 0,
    websocket: 0,
    database: 0,
    provider: 0,
};

const PING_INTERVAL = 60_000;
let LAST_PING = Date.now() - PING_INTERVAL;

export default class Ping extends Command {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'ping',
            description: 'Pong! Check the ping of the bot and its services.',
            preconditions: [IncrementCommandCount],
        });
    }

    public override onMessage(message: Command.Message, _: any) {
        return this.sharedRun(new Context(message));
    }

    public override async onChatInput(interaction: Command.ChatInput) {
        return this.sharedRun(new Context(interaction));
    }

    public async sharedRun(context: Context) {
        if (Date.now() < LAST_PING + PING_INTERVAL) {
            const content = createMessage(PINGS);
            return context.reply({ content });
        }

        Object.keys(PINGS).forEach((key) => Reflect.set(PINGS, key, undefined));

        const opts = { content: createMessage(PINGS), fetchReply: true };
        const reply = (await context.reply(opts)) as Message;
        PINGS.latency = reply.createdTimestamp - context.createdTimestamp;
        await reply.edit(createMessage(PINGS));

        const rest = Date.now();
        await context.client.rest.get('/gateway');
        PINGS.rest = Date.now() - rest;
        PINGS.websocket = context.client.ws.ping;
        await reply.edit(createMessage(PINGS));

        const database = Date.now();
        await connection.db.collection('snippets').findOne({});
        PINGS.database = Date.now() - database;

        const provider = Date.now();
        await container.providers.cache.first()!.ping();
        PINGS.provider = Date.now() - provider;
        await reply.edit(createMessage(PINGS));

        LAST_PING = Date.now();
        return void 0;
    }
}

export interface Pings {
    latency: number;
    rest: number;
    websocket: number;
    database: number;
    provider: number;
}

function createMessage(pings: Pings) {
    return oneLine`
    **Latency:** ${pings.latency ? `${pings.latency}ms, ` : 'Waiting...'}
    **REST:** ${pings.rest ? `${pings.rest}ms, ` : 'Waiting...'}
    **Websocket:** ${pings.websocket ? `${pings.websocket}ms, ` : 'Waiting...'}
    **Database:** ${pings.database ? `${pings.database}ms, ` : 'Waiting...'}
    **Provider:** ${pings.provider ? `${pings.provider}ms, ` : 'Waiting...'}
    `;
}
