import { container } from 'maclary';
import { ProviderManager } from '@lib/managers/ProviderManager';
import { EvaluatorManager } from '@lib/managers/EvaluatorManager';
import { Database } from '@lib/structures/Database';

container.providers = new ProviderManager();
container.evaluators = new EvaluatorManager();
container.database = new Database();

declare module 'maclary' {
    interface Container {
        providers: ProviderManager;
        evaluators: EvaluatorManager;
        database: Database;
    }
}
