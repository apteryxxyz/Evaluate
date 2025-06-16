import { hexToAnsi } from './hex-to-ansi.js';

function isCssSupported() {
  // Browser
  return typeof location !== 'undefined';
}
function isAnsiSupported() {
  // Terminal
  return typeof process !== 'undefined' && process.stdout.isTTY;
}
function determineMode() {
  if (isCssSupported()) return 'css';
  if (isAnsiSupported()) return 'ansi';
  return undefined;
}

function constructArgs(badge: string, hex: `#${string}`, ...args: unknown[]) {
  const mode = determineMode();

  if (mode === 'ansi') {
    const open = hexToAnsi(hex);
    return [`${open}\x1b[1;37m %s \x1b[0m`, badge, ...args];
  } else if (mode === 'css') {
    const style = `background-color: ${hex}; color: white; font-weight: bold; padding: 2px 5px; border-radius: 5px;`;
    return [`%c${badge}`, style, ...args];
  } else {
    return [`[ ${badge} ]`, ...args];
  }
}

export interface LoggerOptions {
  /** The badge to display in the log message. */
  badge: string;
  /** The hex color to use for the badge. */
  hex: `#${string}`;
  /** Whether to enable the logger, defaults to `process.env.NODE_ENV !== 'production'`. */
  enabled?: boolean;
}

/**
 * Create a cross-platform logger function that can be used to log pretty messages.
 * @param options {@link LoggerOptions}
 * @returns ⁠{@link console.log}
 */
export function createLogger(options: LoggerOptions) {
  const enabled = options.enabled ?? process.env.NODE_ENV !== 'production';
  return function log(...args: unknown[]) {
    if (!enabled) return;
    console.log(...constructArgs(options.badge, options.hex, ...args));
  };
}
