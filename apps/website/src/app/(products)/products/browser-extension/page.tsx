import { Button } from '@evaluate/components/button';
import Link from 'next/link';
import { ImageCarousel } from './_components/image-carousel';

export default function BrowserExtensionPlatformPage() {
  return (
    <div className="container grid grid-cols-1 gap-6 py-6 pt-[20vh] lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="font-bold text-3xl tracking-tight md:text-5xl">
          The <span className="text-primary">Evaluate</span> Browser Extension
        </h1>
        <p className="mx-auto max-w-5xl text-balance text-sm md:text-base">
          When you stumble upon code snippets while browsing the web, wouldn't
          it be great to execute them instantly? Look no further—the Evaluate
          extension is your solution, with its over 70 supported languages and
          quick code execution capabilities.
        </p>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            className="flex items-center gap-2 rounded-full"
            asChild
          >
            <Link
              href="https://go.evaluate.run/chrome-extension"
              target="_blank"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/1024px-Google_Chrome_icon_%28February_2022%29.svg.png"
                className="aspect-square w-6"
                alt="Chrome Logo"
              />
              <span>
                Evaluate for <span className="font-bold">Chrome</span>
              </span>
            </Link>
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="flex items-center gap-3 rounded-full"
            asChild
          >
            <Link
              href="https://go.evaluate.run/chrome-extension?for=edge"
              target="_blank"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Microsoft_Edge_logo_%282019%29.png"
                className="aspect-square w-6"
                alt="Edge Logo"
              />
              <span className="sr-only">Evaluate for Edge</span>
            </Link>
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="flex items-center gap-3 rounded-full"
            asChild
          >
            <Link
              href="https://go.evaluate.run/chrome-extension?for=opera"
              target="_blank"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Opera_2015_icon.svg/180px-Opera_2015_icon.svg.png"
                className="aspect-square w-6"
                alt="Opera Logo"
              />
              <span className="sr-only">Evaluate for Opera</span>
            </Link>
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="flex items-center gap-3 rounded-full"
            asChild
          >
            <Link
              href="https://go.evaluate.run/chrome-extension?for=brave"
              target="_blank"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Brave_lion_icon.svg"
                className="aspect-square w-6"
                alt="Brave Logo"
              />
              <span className="sr-only">Evaluate for Brave</span>
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <ImageCarousel />
      </div>
    </div>
  );
}

/*
export default function BrowserExtensionPlatformContent() {
  return (
    <PageWrapper>
      <div className="text-center pt-24 space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          The <span className="text-primary">Evaluate</span> Browser Extension
        </h1>
        <p className="mx-auto text-sm md:text-base text-balance max-w-5xl">
          When you stumble upon code snippets while browsing the web, wouldn't
          it be great to execute them instantly? Look no further—the Evaluate
          extension is your solution, with its over 70 supported languages and
          quick code execution capabilities.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="secondary"
          className="flex items-center rounded-full gap-2"
          asChild
        >
          <Link href="https://go.evaluate.run/chrome-extension" target="_blank">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/1024px-Google_Chrome_icon_%28February_2022%29.svg.png"
              className="w-6 aspect-square"
              alt="Chrome Logo"
            />
            <span>
              Evaluate for <span className="font-bold">Chrome</span>
            </span>
          </Link>
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="flex items-center rounded-full gap-3"
          asChild
        >
          <Link
            href="https://go.evaluate.run/chrome-extension?for=edge"
            target="_blank"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Microsoft_Edge_logo_%282019%29.png"
              className="w-6 aspect-square"
              alt="Edge Logo"
            />
          </Link>
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="flex items-center rounded-full gap-3"
          asChild
        >
          <Link
            href="https://go.evaluate.run/chrome-extension?for=opera"
            target="_blank"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Opera_2015_icon.svg/180px-Opera_2015_icon.svg.png"
              className="w-6 aspect-square"
              alt="Opera Logo"
            />
          </Link>
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="flex items-center rounded-full gap-3"
          asChild
        >
          <Link
            href="https://go.evaluate.run/chrome-extension?for=brave"
            target="_blank"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Brave_lion_icon.svg"
              className="w-6 aspect-square"
              alt="Brave Logo"
            />
          </Link>
        </Button>
      </div>

      <ImageCarousel />
    </PageWrapper>
  );
}
*/
