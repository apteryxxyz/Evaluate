import * as MIT from 'material-icon-theme';
import VSI from 'vscode-icons-js/data/static/languages-vscode.json';

// ============ //

const MANIFEST = (() => {
  const manifest = MIT.generateManifest();
  for (const [name, { extensions }] of Object.entries(VSI))
    for (const ext of extensions) {
      const ex = ext.slice(1);
      if (manifest.fileExtensions) manifest.fileExtensions[ex] ??= name;
      if (manifest.light?.fileExtensions)
        manifest.light.fileExtensions[ex] ??= name;
    }
  return manifest;
})();

export function getIconForFile(name: string, theme?: string): string {
  const icons = (theme === 'light' ? MANIFEST.light : MANIFEST) || MANIFEST;
  const { fileNames, fileExtensions } = icons;
  const [ext1, ext2] = name.split('.').reverse();

  return (
    fileNames?.[name] ||
    fileExtensions?.[String(ext1)] ||
    fileExtensions?.[`${ext2}.${ext1}`] ||
    (theme === 'light' && getIconForFile(name, 'dark')) ||
    'file'
  );
}

export function getIconForFolder(name: string, theme?: string): string {
  const icons = (theme === 'light' ? MANIFEST.light : MANIFEST) || MANIFEST;
  const { folderNames } = icons;

  return (
    folderNames?.[name] ||
    (theme === 'light' && getIconForFolder(name, 'dark')) ||
    'folder'
  );
}

export function makeIconUrl(icon: string) {
  return `https://pkief.vscode-unpkg.net/PKief/material-icon-theme/5.8.0/extension/icons/${icon}.svg` as const;
}

// ============ //

const LANGUAGE_PATTERNS = {
  apl: /\.(apl)$/,
  asciiArmor: /\.(asc|pgp)$/,
  asterisk: /\.(asterisk)$/,
  c: /\.(c|h)$/,
  csharp: /\.(cs)$/,
  scala: /\.(scala|sc)$/,
  solidity: /\.(sol)$/,
  kotlin: /\.(kt|kts)$/,
  shader: /\.(shader)$/,
  nesC: /\.(nc)$/,
  objectiveC: /\.(m|h)$/,
  objectiveCpp: /\.(mm|h)$/,
  squirrel: /\.(nut)$/,
  ceylon: /\.(ceylon)$/,
  dart: /\.(dart)$/,
  cmake: /^(CMakeLists\.txt|.*\.cmake)$/,
  cobol: /\.(cob|cbl)$/,
  commonLisp: /\.(lisp|cl|lsp)$/,
  crystal: /\.(cr)$/,
  cypher: /\.(cql)$/,
  d: /\.(d|di)$/,
  diff: /\.(diff|patch)$/,
  dtd: /\.(dtd)$/,
  dylan: /\.(dylan)$/,
  ebnf: /\.(ebnf)$/,
  ecl: /\.(ecl)$/,
  eiffel: /\.(e)$/,
  elm: /\.(elm)$/,
  factor: /\.(factor)$/,
  fcl: /\.(fcl)$/,
  forth: /\.(fs|fth|4th)$/,
  fortran: /\.(f|for|f90|f95)$/,
  gas: /\.(s|asm)$/,
  gherkin: /\.(feature)$/,
  groovy: /\.(groovy|grt|gtpl|gvy)$/,
  haskell: /\.(hs)$/,
  haxe: /\.(hx)$/,
  http: /\.(http)$/,
  idl: /\.(idl)$/,
  jinja2: /\.(j2|jinja2)$/,
  mathematica: /\.(m|ma|nb|wl)$/,
  mbox: /\.(mbox)$/,
  mirc: /\.(mrc)$/,
  modelica: /\.(mo)$/,
  mscgen: /\.(mscgen)$/,
  mumps: /\.(mps)$/,
  nsis: /\.(nsi|nsh)$/,
  ntriples: /\.(nt)$/,
  octave: /\.(m)$/,
  oz: /\.(oz)$/,
  pig: /\.(pig)$/,
  properties: /\.(properties)$/,
  protobuf: /\.(proto)$/,
  puppet: /\.(pp)$/,
  q: /\.(q)$/,
  sas: /\.(sas)$/,
  sass: /\.(sass|scss)$/,
  liquid: /\.(liquid)$/,
  mermaid: /\.(mmd)$/,
  nix: /\.(nix)$/,
  svelte: /\.(svelte)$/,
  sieve: /\.(sieve)$/,
  smalltalk: /\.(st)$/,
  solr: /\.(solr)$/,
  sparql: /\.(rq|sparql)$/,
  spreadsheet: /\.(xls|xlsx|ods)$/,
  stex: /\.(tex|sty|cls|ltx)$/,
  textile: /\.(textile)$/,
  tiddlyWiki: /\.(tid|tiddlywiki)$/,
  tiki: /\.(tiki)$/,
  troff: /\.(t|tr|roff|man|me|ms)$/,
  ttcn: /\.(ttcn|ttcn3)$/,
  turtle: /\.(ttl)$/,
  velocity: /\.(vm)$/,
  verilog: /\.(v|vh|sv|svh)$/,
  vhdl: /\.(vhdl|vhd)$/,
  webIDL: /\.(webidl)$/,
  xQuery: /\.(xq|xql|xqm|xqy)$/,
  yacas: /\.(ys)$/,
  z80: /\.(z80)$/,
  wast: /\.(wast|wat)$/,
  javascript: /\.(js|cjs|mjs)$/,
  jsx: /\.(jsx)$/,
  typescript: /\.(ts)$/,
  tsx: /\.(tsx)$/,
  vue: /\.(vue)$/,
  angular: /\.(angular)$/,
  json: /\.(json)$/,
  html: /\.(html|htm)$/,
  css: /\.(css)$/,
  python: /\.(py)$/,
  markdown: /\.(md|markdown)$/,
  xml: /\.(xml|xsl|xsd)$/,
  sql: /\.(sql)$/,
  mysql: /\.(mysql)$/,
  pgsql: /\.(pgsql)$/,
  java: /\.(java)$/,
  rust: /\.(rs)$/,
  cpp: /\.(cpp|cc|cxx|h|hh|hpp)$/,
  lezer: /\.(lezer)$/,
  php: /\.(php)$/,
  go: /\.(go)$/,
  shell: /\.(sh|bash)$/,
  lua: /\.(lua)$/,
  swift: /\.(swift)$/,
  tcl: /\.(tcl|tk)$/,
  yaml: /\.(yaml|yml)$/,
  vb: /\.(vb)$/,
  powershell: /\.(ps1)$/,
  brainfuck: /\.(bf)$/,
  stylus: /\.(styl)$/,
  erlang: /\.(erl|hrl)$/,
  nginx: /\.(nginx|conf)$/,
  perl: /\.(pl|pm)$/,
  ruby: /\.(rb)$/,
  pascal: /\.(pas)$/,
  livescript: /\.(ls)$/,
  less: /\.(less)$/,
  scheme: /\.(scm|ss)$/,
  toml: /\.(toml)$/,
  vbscript: /\.(vbs)$/,
  clojure: /\.(clj|cljs|cljc)$/,
  coffeescript: /\.(coffee|litcoffee)$/,
  julia: /\.(jl)$/,
  dockerfile: /^Dockerfile$/,
  r: /\.(r)$/,
};

export function detectLanguage(fileName = '') {
  const language = Object.entries(LANGUAGE_PATTERNS) //
    .find(([, r]) => r.test(fileName));
  return (language ? language[0] : 'textile') as keyof typeof LANGUAGE_PATTERNS;
}
