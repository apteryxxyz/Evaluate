import type { Command } from 'maclary';
import { Precondition } from 'maclary';
import { Statistics } from '&entities/Statistics';

export class IncrementCommandCount extends Precondition {
    public override async prefixRun(message: Command.Message) {
        void this.container.database
            .get(Statistics)
            .incrementCommandCount(message.author.id);
        return this.ok();
    }

    public override async slashRun(input: Command.ChatInput) {
        void this.container.database
            .get(Statistics)
            .incrementCommandCount(input.user.id);
        return this.ok();
    }

    public override async contextMenuRun(menu: Command.ContextMenu) {
        void this.container.database
            .get(Statistics)
            .incrementCommandCount(menu.user.id);
        return this.ok();
    }

    public override async actionRun() {
        return this.ok();
    }
}
