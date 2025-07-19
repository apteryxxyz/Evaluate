import { Lexer, Parser } from 'lexure';

const Arguments = new Lexer().setQuotes([
  ['"', '"'],
  ['“', '”'],
]);

/** Parse command line arguments. */
export function parseArguments(args: string) {
  const tokens = Arguments.setInput(args).lex();

  return new Parser(tokens)
    .parse()
    .ordered.map((token: { value: string }) => token.value);
}
