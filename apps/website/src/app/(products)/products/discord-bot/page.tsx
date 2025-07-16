import { Button } from '@evaluate/components/button';
import Link from 'next/link';

export default function BrowserExtensionPlatformContent() {
  return (
    <div className="container flex flex-col gap-6 py-6">
      <div className="space-y-6 pt-[20vh] text-center">
        <h1 className="font-bold text-3xl tracking-tight md:text-5xl">
          The <span className="text-primary">Evaluate</span> Discord Bot
        </h1>
        <p className="mx-auto max-w-5xl text-balance text-sm md:text-base">
          Run code snippets directly in your Discord server with the Evaluate
          bot! Evaluate supports over 70 languages and is perfect for quickly
          testing code and sharing results with your friends.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="secondary"
          className="flex items-center gap-2 rounded-full"
          asChild
        >
          <Link href="https://go.evaluate.run/discord-bot" target="_blank">
            {/** biome-ignore lint/performance/noImgElement: Want to use img */}
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
