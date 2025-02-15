function hexToAnsi(hex: string) {
  hex = hex.replace('#', '');
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const closestColour = closestAnsiColour(r, g, b);
  return `\x1b[48;5;${closestColour}m`;
}

function closestAnsiColour(r: number, g: number, b: number) {
  const colours = [
    [0, 0, 0],
    [128, 0, 0],
    [0, 128, 0],
    [128, 128, 0],
    [0, 0, 128],
    [128, 0, 128],
    [0, 128, 128],
    [192, 192, 192],
    [128, 128, 128],
    [255, 0, 0],
    [0, 255, 0],
    [255, 255, 0],
    [0, 0, 255],
    [255, 0, 255],
    [0, 255, 255],
    [255, 255, 255],
  ] as [number, number, number][];

  // Add 6x6x6 cube colors
  for (let r1 = 0; r1 < 6; r1++)
    for (let g1 = 0; g1 < 6; g1++)
      for (let b1 = 0; b1 < 6; b1++)
        colours.push([
          Math.floor(r1 * 42.5),
          Math.floor(g1 * 42.5),
          Math.floor(b1 * 42.5),
        ]);

  // Add grayscale colors
  for (let i = 0; i < 24; i++)
    colours.push([i * 10 + 8, i * 10 + 8, i * 10 + 8]);

  let minDist = Number.MAX_SAFE_INTEGER;
  let closestColour = 0;
  for (let i = 0; i < colours.length; i++) {
    const [cr, cg, cb] = colours[i]!;
    const dist = (cr - r) ** 2 + (cg - g) ** 2 + (cb - b) ** 2;
    // biome-ignore lint/style/noCommaOperator: <explanation>
    if (dist < minDist) (minDist = dist), (closestColour = i);
  }

  return closestColour;
}

function determineMode() {
  return typeof location !== 'undefined' ? 'css' : 'ansi';
}

function constructArgs(badge: string, colour: string, ...args: unknown[]) {
  const mode = determineMode();

  if (mode === 'ansi') {
    const open = hexToAnsi(colour);
    return [`${open}\x1b[1;37m %s \x1b[0m`, badge, ...args];
  } else if (mode === 'css') {
    const style = `background-color: ${colour}; color: white; font-weight: bold; padding: 2px 5px; border-radius: 5px;`;
    return [`%c${badge}`, style, ...args];
  } else {
    return [];
  }
}

export function createLogger(
  badge: string,
  colour: string,
  enabled = process.env.NODE_ENV !== 'production',
) {
  return function log(...args: unknown[]) {
    if (enabled) console.log(...constructArgs(badge, colour, ...args));
  };
}
