import { container } from 'maclary';
import { ProviderManager } from '@managers/ProviderManager';
import { EvaluatorManager } from '@managers/EvaluatorManager';
import { Database } from '@structures/Database';

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
