import { MapManager } from 'maclary';
import { Piston } from '@providers/Piston';
import type { Provider } from '@structures/Provider';

export class ProviderManager extends MapManager<string, Provider> {
    /**
     * Load all the evaluation providers.
     */
    public loadAll(): Promise<this> {
        this.cache.set('P', new Piston());
        return Promise.resolve(this);
    }

    /**
     * Initialise all the providers in the cache.
     */
    public async initialiseAll(): Promise<this> {
        for (const provider of this.cache.values()) await provider.initialise();
        return this;
    }
}
