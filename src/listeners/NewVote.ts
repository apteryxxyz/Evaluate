import { Webhook } from '@maclary/lists';
import { oneLine } from 'common-tags';
import { ms } from 'enhanced-ms';
import { Listener, container } from 'maclary';
import { User } from '&entities/User';
import { lists } from '&premium';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class OnNewVote extends Listener<any> {
    public constructor() {
        super({
            event: Webhook.Events.NewVote,
            emitter: container.lists.webhook,
        });
    }

    public async run(...args: Webhook.EventParams[Webhook.Events.NewVote]) {
        const [list, vote] = args;
        if (vote.type !== 'vote') return void 0;
        const hours = lists.find(({ key }) => key === list.key)?.hours;
        if (!hours || hours < 1) return void 0;

        const userRepository = this.container.database.repository(User);
        const user = await userRepository.ensure(vote.userId);

        if (user.premiumEndsAt < new Date()) user.premiumEndsAt = new Date();
        user.premiumEndsAt.setHours(user.premiumEndsAt.getHours() + hours);

        await userRepository.save(user);

        try {
            const discordUser = await this.container.client.users //
                .fetch(vote.userId);

            const remainingTime = user.premiumEndsAt.getTime() - Date.now();
            const time = ms(remainingTime, { shortFormat: true });

            await discordUser.send(oneLine`Thanks for voting for me on
                ${list.title}! To show my appreciation, I've given you
                **${hours} hour${hours === 1 ? '' : 's'}** of premium,
                you have a total of ${time}! Vote again tomorrow to
                extend your premium! Enjoy!`);
        } catch {}

        return void 0;
    }
}
