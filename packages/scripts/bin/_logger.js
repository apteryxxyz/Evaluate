const colours = {
  green: (_) => `\x1b[32m${_}\x1b[0m`,
  yellow: (_) => `\x1b[33m${_}\x1b[0m`,
  red: (_) => `\x1b[31m${_}\x1b[0m`,
  bold: (_) => `\x1b[1m${_}\x1b[0m`,
  italic: (_) => `\x1b[3m${_}\x1b[0m`,
  dim: (_) => `\x1b[2m${_}\x1b[0m`,
};

const logger = {
  info: (_) => console.info(`${colours.bold(colours.green(' >_'))} ${_}`),
  warn: (_) => console.warn(colours.yellow(`${colours.bold(' >_')} ${_}`)),
  error: (_) => console.error(colours.red(`${colours.bold(' >_')} ${_}`)),
};

export { logger, colours };
