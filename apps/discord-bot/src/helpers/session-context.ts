import crypto from 'node:crypto';
import { type APIInteraction, type APIUser, User } from '@buape/carbon';
import { format, subHours } from 'date-fns';

function hashSessionId(sessionId: string) {
  return crypto.createHash('sha256').update(sessionId).digest('hex');
}

export function getInteractionContext(
  interaction: Exclude<APIInteraction, { type: 1 }>,
) {
  const user = interaction.member?.user ?? interaction.user!;
  const channel = interaction.channel;
  const guild = interaction.guild;

  const date = format(subHours(new Date(), 6), 'yyyyMMdd');
  const sessionId = hashSessionId(`${user.id}-${date}`);

  return { interaction, user, channel, guild, session: { id: sessionId } };
}

export function getUserContext(user: APIUser | User) {
  const date = format(subHours(new Date(), 6), 'yyyyMMdd');
  const sessionId = hashSessionId(`${user.id}-${date}`);

  // @ts-expect-error - rawData is a protected property
  if (user instanceof User) user = user.rawData as APIUser;

  return { user, session: { id: sessionId } };
}
