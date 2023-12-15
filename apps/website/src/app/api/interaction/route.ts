// Handle the Discord bot interaction
// export { default as POST } from '@evaluate/discord-bot';

// Not sure why, but the above stopped working, so we'll do this instead:
import handler from '@evaluate/discord-bot';
export function POST(request: Request) {
  return handler(request);
}
