import { inspect } from 'node:util';
import { generateImageUsingCarbonara } from './generators/carbonara';
import { generateImageUsingCode2Img } from './generators/code2img';

/**
 * Generate a code image using either Carbonara or code2img, whichever is faster.
 * @param code the code to pass to either API
 * @param language the language to pass to either API
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
    // Carbonara looks the best, but it often takes a long time to respond
    carbonaraPromise,
    new Promise((r) => setTimeout(r, timeAvailable)),
  ]);

  let imageBuffer;
  // inspect() is a Node.js utility function that returns a string representation of an object
  // Using it to check if the promise is pending is a hacky way to check if it's resolved
  if (!inspect(carbonaraPromise).includes('pending'))
    imageBuffer = await carbonaraPromise;
  // If Carbonara fails, try code2img
  else if (!inspect(code2imgPromise).includes('pending'))
    imageBuffer = await code2imgPromise;
  if (!imageBuffer) throw new Error('Failed to generate image');

  return imageBuffer;
}
