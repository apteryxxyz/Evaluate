'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@evaluate/react/components/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

export function ImageCarousel() {
  return (
    <div className="flex items-center justify-center">
      <Carousel
        className="max-w-xl"
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 4000, stopOnMouseEnter: true })]}
      >
        <CarouselContent>
          <CarouselItem className="flex items-center justify-center">
            <Image
              alt="Evaluate Browser Extension Screenshot 1"
              src="/images/browser-extension-screenshot-1.png"
              className="rounded-xl border"
              width={640}
              height={400}
            />
          </CarouselItem>
          <CarouselItem className="flex items-center justify-center">
            <Image
              alt="Evaluate Browser Extension Screenshot 2"
              src="/images/browser-extension-screenshot-2.png"
              className="rounded-xl border"
              width={640}
              height={400}
            />
          </CarouselItem>
          <CarouselItem className="flex items-center justify-center">
            <Image
              alt="Evaluate Browser Extension Screenshot 3"
              src="/images/browser-extension-screenshot-3.png"
              className="rounded-xl border"
              width={640}
              height={400}
            />
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
