import { Command } from 'maclary';
import { IncrementCommandCount } from '&preconditions/IncrementCommandCount';

export class PingCommand extends Command<
    Command.Type.ChatInput,
    [Command.Kind.Slash]
> {
    public constructor() {
        super({
            type: Command.Type.ChatInput,
            kinds: [Command.Kind.Slash],
            name: 'ping',
            description: 'Pong! Shows the latency and ping for the bot.',

            preconditions: [IncrementCommandCount],
        });
    }

    public override async onSlash(input: Command.ChatInput) {
        console.log('This has been run');

        const initialReply = await input.reply({
            content: 'Pinging client...',
            fetchReply: true,
        });

        const botLatency =
            initialReply.createdTimestamp - input.createdTimestamp;
        const wsPing = input.client.ws.ping;

        await input.editReply(
            `🏓 **Ping**: ${wsPing}ms, **Latency**: ${botLatency}ms`
        );
    }
}
