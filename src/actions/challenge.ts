import { Action } from 'maclary';
import { Challenges } from '&builders/challenges';
import { Challenge } from '&entities/Challenge';
import { Submission } from '&entities/Submission';
import { User } from '&entities/User';
import { deferReply, editReply, update } from '&functions/loadingPrefix';

export class ChallengeAction extends Action {
    public constructor() {
        super({ id: 'challenge' });
    }

    public override async onButton(click: Action.Button) {
        const [, challengeId, action] = click.customId.split(',');

        if (action === 'help')
            return click.reply({
                embeds: [new Challenges.GettingStartedEmbed()],
                ephemeral: true,
            });

        const challenge = await this.container.database
            .repository(Challenge)
            .findOne({
                where: { id: Number.parseInt(challengeId, 10) },
                relations: ['submissions'],
            });
        if (!challenge) return void 0;

        if (action === 'start') {
            const existing = challenge.submissions.find(
                submission =>
                    submission.submitterId === click.user.id &&
                    submission.challengeId === challenge.id
            );

            if (existing)
                return click.reply({
                    content:
                        'You have already submitted a solution to this challenge.',
                    ephemeral: true,
                });

            void this.container.database
                .repository(User)
                .ensure(click.user.id)
                .then(user => user.save());
            return click.showModal(new Challenges.SubmitModal(challenge));
        }

        if (action === 'confirm') {
            const submissionId = click.customId.split(',')[3];
            const options = this.container.submissions.resolve(submissionId);
            if (!options) return void 0;

            await update(click, 'Running tests, please wait...', {
                embeds: [],
                components: [],
            });

            const testCount = challenge.tests.length;
            const testResults: (boolean | string)[] = [];

            for await (const result of this.container.challenger.runTests(
                challenge,
                options
            )) {
                testResults.push(result);
                if (testResults.length >= testCount / 2)
                    await editReply(click, 'Half of the tests are done...');
            }

            const passedTests = testResults.filter(result => result === true);
            const passPercent = (passedTests.length / testCount) * 100;

            await editReply(click, 'Calculating score...');
            const score = await this.container.challenger.calculateScore(
                challenge,
                options,
                passPercent
            );

            const submission = new Submission();
            submission.id = click.id;
            submission.submitterId = click.user.id;
            submission.challengeId = challenge.id;
            submission.language = options.language.key;
            submission.code = options.code;
            submission.score = score ?? 0;
            await submission.save();

            return click.editReply({
                content: null,
                embeds: [
                    new Challenges.ResultEmbed(
                        challenge,
                        submission,
                        testResults
                    ),
                ],
            });
        }
    }

    public override async onModalSubmit(submit: Action.AnyModalSubmit) {
        const [, challengeId, action] = submit.customId.split(',');

        const challenge = await this.container.database
            .repository(Challenge)
            .findOneBy({ id: Number.parseInt(challengeId, 10) });
        if (!challenge) return void 0;

        if (action === 'submit') {
            const lang = submit.fields.getTextInputValue('language');
            const code = submit.fields.getTextInputValue('code');

            await deferReply(submit, 'Determing language...', {
                ephemeral: true,
            });
            const language = await this.container.executor.findLanguage(lang);
            if (!language)
                return submit.editReply(
                    'I could not find a language that I support with that name. Please try again.'
                );

            this.container.submissions.create(
                `${submit.user.id}-${challenge.id}`,
                language,
                code
            );

            return submit.editReply({
                content: null,
                embeds: [
                    new Challenges.ConfirmEmbed(challenge, { language, code }),
                ],
                components: [
                    new Challenges.ConfirmComponents(
                        challenge,
                        `${submit.user.id}-${challenge.id}`
                    ),
                ],
            });
        }

        return void 0;
    }
}
