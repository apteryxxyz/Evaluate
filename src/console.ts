import chalk from 'chalk';

const levels = {
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  debug: chalk.green,
};
const levelLength = Math.max(...Object.keys(levels).map((x) => x.length));

function formatPrefix(level: keyof typeof levels) {
  const outParts = [levels[level](centrePad(level, levelLength))];

  const requestType = process.env.REQUEST_TYPE ?? 'unknown';
  if (requestType !== 'unknown') {
    const startTimestamp = process.env.START_TIMESTAMP;
    const timeElapsed = Date.now() - Number(startTimestamp);
    const elapsedString = timeElapsed.toString().padStart(5, ' ');
    outParts.push(chalk.bgWhite.black(centrePad(elapsedString, 7)));
  }

  return outParts.join('');
}

function centrePad(text: string, length: number) {
  if (text.length < length)
    return (
      ' '.repeat(Math.floor((length - text.length) / 2)) +
      text +
      ' '.repeat(Math.ceil((length - text.length) / 2))
    );
  else return text;
}

if (console.info.toString().includes('[native code]')) {
  const originalConsole = {
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  };

  console.info = (...data: unknown[]) =>
    originalConsole.info(formatPrefix('info'), ...data);
  console.warn = (...data: unknown[]) =>
    originalConsole.warn(formatPrefix('warn'), ...data);
  console.error = (...data: unknown[]) =>
    originalConsole.error(formatPrefix('error'), ...data);
  console.debug = (...data: unknown[]) =>
    originalConsole.debug(formatPrefix('debug'), ...data);
}
