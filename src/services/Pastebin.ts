import { setInterval, setTimeout } from 'node:timers';
import { container } from 'maclary';
import { RentryClient } from 'rentry-pastebin';
import { FindOperator } from 'typeorm';
import { Database } from './Database';
import { Paste } from '&entities/Paste';

/** Handle the content uploaded to a pastebin. */
export class Pastebin {
    private _client = new RentryClient();

    public constructor() {
        void this._client.createToken();
        void this.deleteExpiredPastes();
        setInterval(() => this.deleteExpiredPastes(), 1_000 * 60 * 60);
    }

    /** Upload content to a pastebin then save its ID and edit code in the database. */
    public async createPaste(options: Pastebin.CreateOptions) {
        await Pastebin.waitFor();
        const data = await this._client.createPaste(options);

        const paste = new Paste({ ...options, ...data });
        const database = await Database.waitFor();
        await database.repository(Paste).save(paste);

        return `https://rentry.co/${data.url}`;
    }

    /** Delete an existing paste by its ID. */
    public async deletePaste(id: string) {
        const database = await Database.waitFor();
        const pasteRepository = database.repository(Paste);
        const paste = await pasteRepository.findOneBy({ id });
        if (!paste) return;

        await Pastebin.waitFor();
        this._client.deletePaste(id, paste.editCode);

        await pasteRepository.remove(paste);
    }

    /** Delete all expired pastes. */
    public async deleteExpiredPastes() {
        const database = await Database.waitFor();
        const pastes = await database
            .repository(Paste)
            .findBy({ lifetime: new FindOperator('moreThan', 0) });

        for (const paste of pastes) {
            const age = Date.now() - paste.createdAt.getTime();
            if (age > paste.lifetime) {
                await this.deletePaste(paste.id);
            }
        }
    }

    /** Ensure that the pastebin has been initialise. */
    public static async waitFor() {
        if (!container.pastebin) container.pastebin = new Pastebin();

        while (!container.pastebin._client.getToken())
            await new Promise(resolve => setTimeout(resolve, 100));
        return container.pastebin;
    }
}

export namespace Pastebin {
    export interface CreateOptions {
        /** Content to upload. */
        content: string;
        /** Amount of time before deletion. */
        lifetime?: number;
    }
}

declare module 'maclary' {
    export interface Container {
        pastebin: Pastebin;
    }
}
