/**
 * A list of possible language names, formatted like so:
 * ```json
 * {
 *  "Language Name": ["language name", "language name 2", "language name 3"],
 *  "Language Name 2": ["language name 2", "language name 3"],
 * }
 * ```
 */
export const PossibleLanguageNames = {
  AWK: ['awk'],
  Bash: ['bash', 'sh'],
  Batch: ['bat'],
  'Befunge 93': ['befunge 93', 'befunge93'],
  Brachylog: ['brachylog'],
  Brainfuck: ['brainfuck', 'bf'],
  BQN: ['bqn'],
  C: ['c'],
  'C++': ['c++', 'cpp', 'cxx'],
  CJam: ['cjam'],
  Clojure: ['clojure', 'clj'],
  COBOL: ['cobol'],
  CoffeeScript: ['coffeescript', 'coffee'],
  COW: ['cow'],
  Crystal: ['crystal'],
  'C#': ['c#', 'csharp', 'cs'],
  'C#.NET': ['c#.net', 'csharp.net', 'cs.net'],
  D: ['d'],
  Dart: ['dart'],
  Dash: ['dash'],
  Dragon: ['dragon'],
  Elixir: ['elixir'],
  Emacs: ['emacs'],
  Emojicode: ['emojicode'],
  Erlang: ['erlang'],
  File: ['file'],
  Forte: ['forte'],
  Forth: ['forth'],
  Fortran: ['fortran'],
  FreeBASIC: ['freebasic'],
  'F#.NET': ['f#.net', 'fsharp.net'],
  FSI: ['fsi'],
  Go: ['go', 'golang'],
  GolfScript: ['golfscript'],
  Groovy: ['groovy'],
  Haskell: ['haskell'],
  HTML: ['html'],
  Husk: ['husk'],
  Verilog: ['iverilog'],
  Japt: ['japt'],
  Java: ['java'],
  JavaScript: ['javascript', 'js'],
  Jelly: ['jelly'],
  Julia: ['julia'],
  Kotlin: ['kotlin'],
  Lisp: ['lisp'],
  'LLVM IR': ['llvm ir', 'llvm_ir', 'llvm'],
  LOLCODE: ['lolcode'],
  Lua: ['lua'],
  MATLAB: ['matlab', 'matl'],
  NASM: ['nasm'],
  NASM64: ['nasm64'],
  Nim: ['nim'],
  OCaml: ['ocaml'],
  'GNU Octave': ['gnu octave', 'octave'],
  '05AB1E': ['05ab1e', 'osabie'],
  Paradoc: ['paradoc'],
  Pascal: ['pascal'],
  Perl: ['perl'],
  PHP: ['php'],
  Pony: ['ponylang', 'pony'],
  PowerShell: ['powershell', 'pwsh'],
  Prolog: ['prolog'],
  Pure: ['pure'],
  Pyth: ['pyth'],
  Python: ['python', 'py'],
  Python2: ['python2'],
  Racket: ['racket', 'rkt'],
  Raku: ['raku', 'perl6'],
  Retina: ['retina'],
  Rockstar: ['rockstar'],
  RScript: ['rscript'],
  Ruby: ['ruby', 'rb'],
  Rust: ['rust', 'rs'],
  Samarium: ['samarium'],
  Scala: ['scala', 'scal'],
  Smalltalk: ['smalltalk', 'squeak'],
  SQLite3: ['sqlite3', 'sqlite'],
  Swift: ['swift'],
  TypeScript: ['typescript', 'ts'],
  BASIC: ['basic', 'qb'],
  'BASIC.NET': ['basic.net', 'qb.net'],
  'VB.NET': ['vb.net', 'vb'],
  V: ['vlang', 'v'],
  Vyxal: ['vyxal'],
  Yeethon: ['yeethon', 'yee'],
  Zig: ['zig'],

  // Unsupported languages
  Ada: ['ada'],
  APL: ['apl'],
  Assembly: ['assembly', 'asm'],
  Ceylon: ['ceylon'],
  Chapel: ['chapel'],
  Coq: ['coq'],
  Dylan: ['dylan'],
  Eiffel: ['eiffel'],
  Elm: ['elm'],
  Factor: ['factor'],
  Fantom: ['fantom'],
  Fish: ['fish'],
  Frege: ['frege'],
  GAP: ['gap'],
  Haxe: ['haxe'],
  Io: ['io'],
  J: ['j'],
  K: ['k'],
  'Korn Shell': ['korn shell', 'ksh'],
  LiveScript: ['livescript'],
  Logtalk: ['logtalk'],
  LuaJIT: ['luajit'],
  M4: ['m4'],
  Mercury: ['mercury'],
  Nemerle: ['nemerle'],
  Ocaml: ['ocaml'],
  Octave: ['octave'],
  OpenCL: ['opencl'],
  Parrot: ['parrot'],
  PostScript: ['postscript', 'ps'],
  Processing: ['processing'],
  Puppet: ['puppet'],
  'Q#': ['q#', 'qs'],
  Red: ['red'],
  Ring: ['ring'],
  'Ruby MRI': ['ruby mri'],
  'Ruby Rbx': ['ruby rbx'],
  SageMath: ['sagemath'],
  Scheme: ['scheme'],
  Scilab: ['scilab'],
  Sed: ['sed'],
  SML: ['sml'],
  SQL: ['sql'],
  'Standard ML': ['standard ml', 'sml'],
  Tcl: ['tcl'],
  Turing: ['turing'],
  'Unix Shell': ['unix shell', 'sh'],
  Vimscript: ['vimscript'],
  WebAssembly: ['webassembly', 'wasm'],
  'Windows PowerShell': ['windows powershell'],
  XC: ['xc'],
  XQuery: ['xquery'],
  Zsh: ['zsh'],
};

/**
 * Format a language name.
 * @param language the potential language name
 * @returns the formatted language name, returns the input as a backup if it is not a valid
 */
export function formatLanguageName<T extends string>(
  language: T,
): T | keyof typeof PossibleLanguageNames {
  const lower = language.toLowerCase();
  for (const [name, values] of Object.entries(PossibleLanguageNames))
    if (values.includes(lower))
      return name as keyof typeof PossibleLanguageNames;
  return language;
}

/**
 * A list of possible runtime names, formatted like so:
 * ```json
 * {
 *  "Runtime Name": ["runtime name", "runtime name 2", "runtime name 3"],
 *  "Runtime Name 2": ["runtime name 2", "runtime name 3"],
 * }
 * ```
 */
export const PossibleRuntimeNames = {
  Node: ['node'],
  Deno: ['deno'],
  'GNU Awk': ['gawk', 'awk'],
  Mono: ['mono'],
  GCC: ['gcc'],
  '.NET': ['dotnet', 'dot net'],
  NASM: ['nasm', 'nasm32'],
  PowerShell: ['pwsh', 'powershell'],
};

/**
 * Format a runtime name.
 * @param runtime the potential runtime name
 * @returns the formatted runtime name, returns the input as a backup if it is not a valid
 */
export function formatRuntimeName<T extends string>(
  runtime: T,
): T | keyof typeof PossibleRuntimeNames {
  const lower = runtime.toLowerCase();
  for (const [name, values] of Object.entries(PossibleRuntimeNames))
    if (values.includes(lower))
      return name as keyof typeof PossibleRuntimeNames;
  return runtime;
}
