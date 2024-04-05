export type RGB = { r: number; g: number; b: number };

/**
 * Get the dominant colour of an image.
 * @param imageElement element to get the dominant colour of
 * @returns the dominant colour of the image
 */
export function getDominantColour(imageElement: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  const width = (canvas.width = imageElement.width);
  const height = (canvas.height = imageElement.height);

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get canvas context');
  context.drawImage(imageElement, 0, 0, width, height);

  const { data } = context.getImageData(0, 0, width, height);
  const counts: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]!;
    if (alpha < 128) continue;

    const red = data[i]!;
    const green = data[i + 1]!;
    const blue = data[i + 2]!;

    const str = `${red},${green},${blue}`;
    if (!counts[str]) counts[str] = 0;
    counts[str]++;
  }

  let maxCount = 0;
  let dominantColour = '';
  for (const str in counts) {
    if (counts[str]! > maxCount) {
      maxCount = counts[str]!;
      dominantColour = str;
    }
  }

  const [red, green, blue] = dominantColour.split(',').map(Number);
  return { r: red!, g: green!, b: blue! };
}
