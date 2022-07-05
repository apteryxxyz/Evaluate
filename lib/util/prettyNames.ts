/**
 * Get the display name of a language
 * @param name The name of the language
 * @param returnSelf Whether to return the input if no language was found
 */
export function prettierLanguageName(name: string, returnSelf: true): string;
export function prettierLanguageName(name: string, returnSelf: false): string | undefined;
export function prettierLanguageName(name: string, returnSelf: boolean): string | undefined {
    return prettyLanguageNames[name] || (returnSelf ? name : undefined);
}

/**
 * Get the display name of a runtime
 * @param name The name of the runtime
 * @param returnSelf Whether to return the input if no runtime was found
 */
export function prettierRuntimeName(name: string, returnSelf: true): string;
export function prettierRuntimeName(name: string, returnSelf: false): string | undefined;
export function prettierRuntimeName(name: string, returnSelf: boolean): string | undefined {
    return prettyRuntimeNames[name] || (returnSelf ? name : undefined);
}

const prettyLanguageNames = Object.assign({
    awk: 'AWK',
    bash: 'Bash',
    befunge93: 'Befunge 93',
    brachylog: 'Brachylog',
    brainfuck: 'Brainfuck',
    c: 'C',
    'c++': 'C++',
    cjam: 'CJam',
    clojure: 'Clojure',
    cobol: 'COBOL',
    coffeescript: 'CoffeeScript',
    cow: 'COW',
    crystal: 'Crystal',
    csharp: 'C#',
    'csharp.net': 'C#.NET',
    d: 'D',
    dart: 'Dart',
    dash: 'Dash',
    dragon: 'Dragon',
    elixir: 'Elixir',
    emacs: 'Emacs',
    emojicode: 'Emojicode',
    erlang: 'Erlang',
    file: 'File',
    forte: 'Forte',
    forth: 'Forth',
    fortran: 'Fortran',
    freebasic: 'FreeBASIC',
    'fsharp.net': 'F#.NET',
    fsi: 'FSI',
    go: 'Go',
    golfscript: 'GolfScript',
    groovy: 'Groovy',
    haskell: 'Haskell',
    hask: 'Hask',
    iverilog: 'Verilog',
    japt: 'Japt',
    java: 'Java',
    javascript: 'JavaScript',
    jelly: 'Jelly',
    julia: 'Julia',
    kotlin: 'Kotlin',
    lisp: 'Lisp',
    llvm_ir: 'LLVM IR',
    lolcode: 'LOLCODE',
    lua: 'Lua',
    matl: 'MATLAB',
    nasm: 'NASM',
    nasm64: 'NASM64',
    nim: 'Nim',
    ocaml: 'OCaml',
    octave: 'GNU Octave',
    osabie: '05AB1E',
    paradoc: 'Paradoc',
    pascal: 'Pascal',
    perl: 'Perl',
    php: 'PHP',
    ponylang: 'Pony',
    powershell: 'PowerShell',
    prolog: 'Prolog',
    pure: 'Pure',
    pyth: 'Pyth',
    python: 'Python',
    python2: 'Python2',
    racket: 'Racket',
    raku: 'Raku',
    retina: 'Retina',
    rockstar: 'Rockstar',
    rscript: 'RScript',
    ruby: 'Ruby',
    rust: 'Rust',
    scala: 'Scala',
    smalltalk: 'Smalltalk',
    sqlite3: 'SQLite3',
    swift: 'Swift',
    typescript: 'TypeScript',
    basic: 'BASIC',
    'basic.net': 'VB.NET',
    vlang: 'V',
    vyxal: 'Vyxal',
    yeethon: 'Yeethon',
    zig: 'Zig',
});

const prettyRuntimeNames = Object.assign({
    node: 'Node',
    deno: 'Deno',
    gawk: 'GNU Awk',
    mono: 'Mono',
    gcc: 'GCC',
    dotnet: '.NET',
    nasm: 'NASM',
    pwsh: 'PowerShell',
});
