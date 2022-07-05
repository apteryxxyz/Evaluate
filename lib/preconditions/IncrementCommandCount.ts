import { incrementCommandCount } from '@lib/util/statisticsTracking';
import { Command, Precondition } from 'maclary';

export class IncrementCommandCount extends Precondition {
    public override async messageRun(message: Command.Message) {
        await incrementCommandCount(message.author.id);
        return this.ok();
    }

    public override async chatInputRun(interaction: Command.ChatInput) {
        await incrementCommandCount(interaction.user.id);
        return this.ok();
    }

    public override async contextMenuRun(
        interaction: Command.UserContextMenu | Command.MessageContextMenu,
    ) {
        await incrementCommandCount(interaction.user.id);
        return this.ok();
    }
}
