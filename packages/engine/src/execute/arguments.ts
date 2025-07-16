import { Lexer, longShortStrategy, Parser } from 'lexure';

const Arguments = new Lexer().setQuotes([
  ['"', '"'],
  ['“', '”'],
]);

/**
 * Parse command line arguments.
 * @param args Arguments as a string.
 * @returns Parsed arguments as an array.
 */
export function parseArguments(args: string) {
  const tokens = Arguments.setInput(args).lex();

  return new Parser(tokens)
    .setUnorderedStrategy(longShortStrategy())
    .parse()
    .ordered.map((token: { value: string }) => token.value);
}
