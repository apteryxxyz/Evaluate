import { setInterval, setTimeout } from 'node:timers';
import { container } from 'maclary';
import { RentryClient } from 'rentry-pastebin';
import { Paste } from '&entities/Paste';

export class Pastebin {
    private _client = new RentryClient();

    public constructor() {
        (async () => {
            await this._client.createToken();
            setInterval(() => this.autoDelete(), 1_000 * 60 * 60);
        })();
    }

    public async createPaste(options: Pastebin.CreateOptions) {
        await Pastebin.waitFor();

        const paste = await this._client.createPaste(options);

        const entity = new Paste();
        entity.id = paste.url;
        entity.editCode = paste.editCode;
        entity.lifetime = options.lifetime ?? -1;

        await container.database.em.persistAndFlush(entity);

        return `https://rentry.co/${paste.url}`;
    }

    public async deletePaste(id: string) {
        await Pastebin.waitFor();

        const paste = await container.database.get(Paste).findOne({ id });
        if (!paste) return;

        this._client.deletePaste(id, paste.editCode);
        await container.database.em.removeAndFlush(paste);
    }

    public async autoDelete() {
        const pastes = await container.database
            .get(Paste)
            .find({ lifetime: { $gt: 0 } });

        for (const paste of pastes) {
            const age = Date.now() - paste.createdAt.getTime();
            if (age > paste.lifetime) {
                await this.deletePaste(paste.id);
            }
        }
    }

    public static async waitFor() {
        if (!container.pastebin) container.pastebin = new Pastebin();

        while (!container.pastebin._client.getToken()) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return container.pastebin;
    }
}

export namespace Pastebin {
    export interface CreateOptions {
        content: string;
        lifetime?: number;
    }
}
