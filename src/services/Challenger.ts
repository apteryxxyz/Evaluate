import process from 'node:process';
import { setTimeout } from 'node:timers';
import { stripIndent } from 'common-tags';
import { ChannelType } from 'discord.js';
import { container } from 'maclary';
import { Configuration, OpenAIApi } from 'openai';
import { Executor } from './Executor';
import { Challenges } from '&builders/challenges';
import { Challenge } from '&entities/Challenge';
import { Guild } from '&entities/Guild';

export class Challenger {
    private _openai?: OpenAIApi;

    public constructor() {
        (async () => {
            this._openai = new OpenAIApi(
                new Configuration({
                    basePath: process.env.OPENAI_BASE_PATH,
                    apiKey: process.env.OPENAI_KEY,
                })
            );
        })();
    }

    public async broadcastChallenge(challenge: Challenge) {
        const guilds = await container.database
            .repository(Guild)
            .find()
            .then(guilds => guilds.filter(guild => guild.challengeChannelId));

        const announceEmbed = new Challenges.AnnounceEmbed(challenge);
        const announceComponents = new Challenges.ViewComponents(challenge);

        for (const guild of guilds) {
            const channelId = guild.challengeChannelId!;
            const channel = await container.client.channels.fetch(channelId);
            if (
                !channel ||
                (channel.type !== ChannelType.GuildText &&
                    channel.type !== ChannelType.GuildAnnouncement)
            )
                continue;

            const roleId = guild.challengeRoleId;
            const role = roleId
                ? await channel.guild.roles.fetch(roleId)
                : null;

            const contentString = `${
                role ? `${role} ` : ''
            }New code challenge!`;

            await channel
                .send({
                    content: contentString,
                    embeds: [announceEmbed],
                    components: [announceComponents],
                })
                .catch(() => {});
        }
    }

    public async *runTests(
        challenge: Challenge,
        options: Omit<Executor.ExecuteOptions, 'input' | 'args'>
    ) {
        for (const test of challenge.tests) {
            const result = await this._runTest(test, options);
            yield result;
        }
    }

    private async _runTest(
        test: Challenge.Test,
        options: Omit<Executor.ExecuteOptions, 'input' | 'args'>
    ) {
        const executor = await Executor.waitFor();
        const result = await executor.execute({
            ...options,
            input: test.input,
            args: test.input,
        });

        if (result.isSuccess && result.output.trim() === test.output)
            return true;
        return result.output;
    }

    public async calculateScore(
        challenge: Challenge,
        options: Omit<Executor.ExecuteOptions, 'input' | 'args'>,
        testPassPercent: number
    ) {
        if (testPassPercent !== 100) return null;

        let baseScore = 1_000;

        if (challenge.difficulty === Challenge.Difficulty.Extreme)
            baseScore *= 3;
        else if (challenge.difficulty === Challenge.Difficulty.Hard)
            baseScore *= 2;
        else if (challenge.difficulty === Challenge.Difficulty.Medium)
            baseScore *= 1.5;

        const quality = await this._determineCodeQuality(challenge, options);
        baseScore += quality * 10;

        return baseScore;
    }

    private _determineCodeQuality(
        challenge: Challenge,
        options: Omit<Executor.ExecuteOptions, 'input' | 'args'>
    ) {
        return this._openai!.createChatCompletion({
            model: 'gpt-3.5-turbo',
            max_tokens: 100,
            messages: [
                {
                    role: 'system',
                    content: this._createSystemPrompt(challenge, options),
                },
                { role: 'user', content: options.code },
            ],
        }).then(({ data }) => {
            const content = data.choices[0].message?.content;
            const score = Number(content?.match(/\d+/)?.[0]);
            if (Number.isNaN(score)) return 60;
            return score;
        });
    }

    private _createSystemPrompt(
        challenge: Challenge,
        options: Omit<Executor.ExecuteOptions, 'input' | 'args'>
    ) {
        return stripIndent`As an AI programming code quality assistant, your task
        is to evaluate the quality of a user's code that was written to complete
        the challenge: "${challenge.description}". The code was written in
        ${options.language.name} and has already passed all tests.

        Your goal is to provide a score from 0 to 100, based solely on the quality
        of the code. Your evaluation should take into account factors such as
        efficiency and overall quality. Please note that your analysis will only
        consist of examining the code and not running it.
        
        Remember that this is a quick code challenge and the code does not need
        to be perfect. Your analysis should focus on the code itself and not on
        its test results. The score you give is an addition to the score that the
        code has already received, so do not hesitate to give a low score if you
        feel it is deserved.

        As an example, if the code is perfect, you should give it a score of 100.
        If the code is terrible, you should give it a score of 0. If the code is
        average, you should give it a score of 50. Comments and formatting were
        removed from the code to prevent bias.
        
        Please return only the numerical score without any additional text or
        characters so that it can easily be parsed by a computer. The score
        should be a whole number between 0 and 100.`;
    }

    }

    public static async waitFor() {
        if (!container.challenger) container.challenger = new Challenger();

        while (!container.challenger._openai)
            await new Promise(resolve => setTimeout(resolve, 100));
        return container.challenger;
    }
}

declare module 'maclary' {
    interface Container {
        challenger: Challenger;
    }
}
