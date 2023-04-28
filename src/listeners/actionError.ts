import { Listener } from 'maclary';

export class OnActionError extends Listener<'actionError'> {
    public constructor() {
        super({ event: 'actionError' });
    }

    public override async run(...args: unknown[]) {
        console.error(...args);
    }
}

export class OnCommandError extends Listener<'commandError'> {
    public constructor() {
        super({ event: 'commandError' });
    }

    public override async run(...args: unknown[]) {
        console.error(...args);
    }
}
