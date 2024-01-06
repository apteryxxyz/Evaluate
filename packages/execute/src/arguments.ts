import { Lexer, Parser, longShortStrategy } from 'lexure';

const Arguments = new Lexer().setQuotes([
  ['"', '"'],
  ['“', '”'],
]);

/**
 * Parse command line arguments.
 * @param args the arguments as a string
 * @returns the parsed arguments as an array
 */
export function parseArguments(args: string) {
  const tokens = Arguments.setInput(args).lex();

  return new Parser(tokens)
    .setUnorderedStrategy(longShortStrategy())
    .parse()
    .ordered.map((token: { value: string }) => token.value);
}
