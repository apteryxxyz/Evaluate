import { inspect } from 'node:util';
import { generateImageUsingCarbonara } from './generators/carbonara';
import { generateImageUsingCode2Img } from './generators/code2img';

/**
 * Generate a code image using either Carbonara or code2img, whichever is faster.
 * @param code the options to pass to either API
 * @param language the options to pass to either API
 * @returns a promise that resolves to a buffer containing the image
 * @throws if neither Carbonara nor code2img response within 10 seconds
 */
export async function generateCodeImage(code: string, language?: string) {
  const startedAt = Date.now();
  const options = { code, theme: 'default' as const, language };
  const carbonaraPromise = generateImageUsingCarbonara(options);
  const code2imgPromise = generateImageUsingCode2Img(options);

  // This is intended to run on Vercel, which has a 10-ish second timeout
  const timeAvailable = 9_500 - (Date.now() - startedAt);
  await Promise.race([
    carbonaraPromise,
    new Promise((r) => setTimeout(r, timeAvailable)),
  ]);

  let imageBuffer;
  if (!inspect(carbonaraPromise).includes('pending'))
    imageBuffer = await carbonaraPromise;
  else if (!inspect(code2imgPromise).includes('pending'))
    imageBuffer = await code2imgPromise;
  if (!imageBuffer) throw new Error('Failed to generate image');

  return imageBuffer;
}
