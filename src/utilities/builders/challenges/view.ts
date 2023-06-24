import {
    ButtonBuilder,
    EmbedBuilder,
    TimestampStyles,
    time,
    userMention,
} from '@discordjs/builders';
import { oneLine } from 'common-tags';
import { ButtonStyle } from 'discord.js';
import { container } from 'maclary';
import type { Challenge } from '&entities/Challenge';
import { buildField, wrapInRow } from '&functions/builderHelpers';

export function ViewEmbed(challenge: Challenge) {
    const difficulty = challenge.difficulty.toUpperCase();
    const submissionCount = challenge.submissions.length;
    const passCount = challenge.submissions.filter(
        submission => submission.score > 0
    ).length;
    const createdBy = userMention(challenge.authorId);
    const createdAt = time(challenge.createdAt, TimestampStyles.ShortDateTime);

    const examples = challenge.tests
        .map(test => `\`${test.input}\` -> \`${test.output}\``)
        .slice(0, 3)
        .join('\n');

    return new EmbedBuilder()
        .setTitle(`Code Challenge ${challenge}`)
        .setDescription(challenge.description)
        .setColor(0x2fc086)
        .setFields(
            buildField('Difficulty', difficulty, true),
            buildField('Submissions', submissionCount, true),
            buildField('Passed', passCount, true),
            buildField('Created By', createdBy, true),
            buildField('Created At', createdAt, true),
            buildField('Examples', examples, false)
        );
}

export function AnnounceEmbed(challenge: Challenge) {
    const difficulty = challenge.difficulty.toUpperCase();
    const createdBy = userMention(challenge.authorId);
    const createdAt = time(challenge.createdAt, TimestampStyles.ShortDateTime);

    const examples = challenge.tests
        .map(test => `\`${test.input}\` -> \`${test.output}\``)
        .slice(0, 3)
        .join('\n');

    return new EmbedBuilder()
        .setTitle(`Code Challenge ${challenge}`)
        .setDescription(challenge.description)
        .setColor(0x2fc086)
        .setFields(
            buildField('Difficulty', difficulty, true),
            buildField('Created By', createdBy, true),
            buildField('Created At', createdAt, true),
            buildField('Examples', examples, false)
        );
}

export function ViewComponents(challenge: Challenge) {
    return wrapInRow(
        new ButtonBuilder()
            .setLabel('Submit Solution')
            .setStyle(ButtonStyle.Success)
            .setCustomId(`challenge,${challenge.id},start`),
        new ButtonBuilder()
            .setLabel('Getting Started')
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`challenge,${challenge.id},help`)
    );
}

export function GettingStartedEmbed() {
    return new EmbedBuilder()
        .setTitle('Getting Started with Code Challenges')
        .setDescription(welcomeDescription())
        .setColor(0x2fc086);
}

// Helpers

function welcomeDescription() {
    const commands = container.maclary.options.guildId
        ? container.client.guilds.cache.get(
              container.maclary.options.guildId as string
          )!.commands.cache
        : container.client.application.commands.cache;
    const evaluateId = commands.find(cmd => cmd.name === 'evaluate')!.id;
    const helpId = commands.find(cmd => cmd.name === 'help')!.id;

    return [
        oneLine`Welcome to Evaluate's code challenges!`,

        oneLine`Our code challenges are designed to help you practice your
        problem-solving skills, showcase your coding abilities, and compete with
        other users by earning points, all right here on Discord.`,

        oneLine`To get started, simply choose a challenge that interests you,
        there are plenty to choose from. Make sure you understand the
        requirements, then start working on your solution, you can practice by
        using the </evaluate:${evaluateId}> command.`,

        oneLine`When completing a challenge, you will receive an input and must
        return an output. The input is passed to your code as strings through
        both the STDIN and the command line arguments, so you can use whichever
        you prefer. Your output is anything that is printed to the STDOUT (console),
        which will be used to determine if your solution is correct or not.`,

        oneLine`Once you believe you have a working solution, you can submit it
        by pressing the "Submit Solution" button. You will be prompted to input
        your programming language and code. Your solution will then be tested
        against a set of predefined test cases, and you will receive a score.`,

        oneLine`Keep in mind that you can only submit your solution once, so
        make sure you practice thoroughly before submitting. Good luck!`,

        oneLine`If you need any help, feel free to join our support server, you
        can find the link by using the </help:${helpId}> command.`,
    ].join('\n\n');
}
