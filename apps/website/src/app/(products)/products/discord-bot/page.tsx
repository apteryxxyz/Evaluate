import { Button } from '@evaluate/react/components/button';
import Link from 'next/link';

export default function BrowserExtensionPlatformContent() {
  return (
    <div className="flex flex-col gap-6 py-6 container">
      <div className="text-center pt-[20vh] space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          The <span className="text-primary">Evaluate</span> Discord Bot
        </h1>
        <p className="mx-auto text-sm md:text-base text-balance max-w-5xl">
          Run code snippets directly in your Discord server with the Evaluate
          bot! Evaluate supports over 70 languages and is perfect for quickly
          testing code and sharing results with your friends.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="secondary"
          className="flex items-center rounded-full gap-2"
          asChild
        >
          <Link href="https://go.evaluate.run/discord-bot" target="_blank">
            <img
              src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
              className="w-6"
              alt="Discord Logo"
            />
            <span>
              Evaluate for <span className="font-bold">Discord</span>
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
