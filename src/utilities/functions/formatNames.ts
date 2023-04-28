/* eslint-disable id-length */

const formattedLanguageNames = {
    awk: 'AWK',
    bash: 'Bash',
    bat: 'Batch',
    befunge93: 'Befunge 93',
    brachylog: 'Brachylog',
    brainfuck: 'Brainfuck',
    bqn: 'BQN',
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
    html: 'HTML',
    husk: 'Husk',
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
    samarium: 'Samarium',
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
};

export function formatLanguageName(language: string) {
    return isKeyof(formattedLanguageNames, language)
        ? formattedLanguageNames[language]
        : language;
}

const formattedRuntimeNames = {
    node: 'Node',
    deno: 'Deno',
    gawk: 'GNU Awk',
    mono: 'Mono',
    gcc: 'GCC',
    dotnet: '.NET',
    nasm: 'NASM',
    pwsh: 'PowerShell',
};

export function formatRuntimeName(runtime: string) {
    return isKeyof(formattedRuntimeNames, runtime)
        ? formattedRuntimeNames[runtime]
        : runtime;
}

function isKeyof<T>(obj: T, key: keyof T | string): key is keyof T {
    return obj && typeof obj === 'object' && key in obj;
}
