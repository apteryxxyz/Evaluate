import { decorate } from 'ts-mixer';
import { BeforeUpdate, Column } from 'typeorm';

export class WithPremium {
    /** If this has premium, when it ends. */
    @decorate(Column({ type: 'datetime', nullable: true }))
    public premiumEndsAt: Date | null = null;

    /** Whether or not this currently has premium. */
    public get hasPremium() {
        return this.premiumEndsAt !== null && this.premiumEndsAt > new Date();
    }

    @BeforeUpdate()
    protected updatePremiumEndsAt() {
        if (this.premiumEndsAt && this.premiumEndsAt < new Date())
            this.premiumEndsAt = null;
    }
}
