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
  asc: /\.(asc|pgp)$/,
  c: /\.(c|h)$/,
  cs: /\.(cs)$/,
  scala: /\.(scala|sc)$/,
  solidity: /\.(sol)$/,
  kt: /\.(kt|kts)$/,
  nesC: /\.(nc)$/,
  mm: /\.(mm|h)$/,
  nut: /\.(nut)$/,
  dart: /\.(dart)$/,
  cmake: /^(CMakeLists\.txt|.*\.cmake)$/,
  cob: /\.(cob|cbl)$/,
  lisp: /\.(lisp|cl|lsp)$/,
  cr: /\.(cr)$/,
  cypher: /\.(cql)$/,
  d: /\.(d|di)$/,
  diff: /\.(diff|patch)$/,
  dtd: /\.(dtd)$/,
  dylan: /\.(dylan)$/,
  ecl: /\.(ecl)$/,
  e: /\.(e)$/,
  elm: /\.(elm)$/,
  factor: /\.(factor)$/,
  forth: /\.(fs|fth|4th)$/,
  f: /\.(f|for|f90|f95)$/,
  s: /\.(s|asm)$/,
  feature: /\.(feature)$/,
  groovy: /\.(groovy|grt|gtpl|gvy)$/,
  hs: /\.(hs)$/,
  hx: /\.(hx)$/,
  http: /\.(http)$/,
  idl: /\.(idl)$/,
  j2: /\.(j2|jinja2)$/,
  nb: /\.(m|ma|nb|wl)$/,
  mbox: /\.(mbox)$/,
  mrc: /\.(mrc)$/,
  mo: /\.(mo)$/,
  mscgen: /\.(mscgen)$/,
  mps: /\.(mps)$/,
  nsis: /\.(nsi|nsh)$/,
  nt: /\.(nt)$/,
  m: /\.(m)$/,
  oz: /\.(oz)$/,
  pig: /\.(pig)$/,
  properties: /\.(properties|ini)$/,
  proto: /\.(proto)$/,
  pp: /\.(pp)$/,
  q: /\.(q)$/,
  sas: /\.(sas)$/,
  sass: /\.(sass|scss)$/,
  liquid: /\.(liquid)$/,
  nix: /\.(nix)$/,
  svelte: /\.(svelte)$/,
  sieve: /\.(sieve)$/,
  st: /\.(st)$/,
  solr: /\.(solr)$/,
  rq: /\.(rq|sparql)$/,
  text: /\.(tex|sty|cls|ltx)$/,
  textile: /\.(textile)$/,
  1: /\.([1-9]|t|tr|roff|man|me|ms)$/,
  ttcn: /\.(ttcn|ttcn3)$/,
  turtle: /\.(ttl)$/,
  vtl: /\.(vm)$/,
  sv: /\.(v|vh|sv|svh)$/,
  vhdl: /\.(vhdl|vhd)$/,
  webidl: /\.(webidl)$/,
  xquery: /\.(xq|xql|xqm|xqy)$/,
  yacas: /\.(ys)$/,
  z80: /\.(z80)$/,
  wast: /\.(wast|wat)$/,
  js: /\.(js|cjs|mjs)$/,
  jsx: /\.(jsx)$/,
  ts: /\.(ts)$/,
  tsx: /\.(tsx)$/,
  vue: /\.(vue)$/,
  json: /\.(json)$/,
  html: /\.(html|htm)$/,
  css: /\.(css)$/,
  py: /\.(py)$/,
  md: /\.(md|markdown)$/,
  xml: /\.(xml|xsl|xsd)$/,
  sql: /\.(sql)$/,
  java: /\.(java)$/,
  rs: /\.(rs)$/,
  cpp: /\.(cpp|cc|cxx|h|hh|hpp)$/,
  lezer: /\.(lezer)$/,
  php: /\.(php)$/,
  go: /\.(go)$/,
  sh: /\.(sh|bash)$/,
  lua: /\.(lua)$/,
  swift: /\.(swift)$/,
  tcl: /\.(tcl|tk)$/,
  yaml: /\.(yaml|yml)$/,
  vb: /\.(vb)$/,
  ps1: /\.(ps1)$/,
  bf: /\.(bf)$/,
  styl: /\.(styl)$/,
  erl: /\.(erl|hrl)$/,
  nginx: /\.(nginx|conf)$/,
  pl: /\.(pl|pm)$/,
  rb: /\.(rb)$/,
  pas: /\.(pas)$/,
  ls: /\.(ls)$/,
  less: /\.(less)$/,
  ss: /\.(scm|ss)$/,
  toml: /\.(toml)$/,
  vbs: /\.(vbs)$/,
  clj: /\.(clj|cljs|cljc)$/,
  coffee: /\.(coffee|litcoffee)$/,
  jl: /\.(jl)$/,
  r: /\.(r)$/,
};

export function detectLanguage(filename = '') {
  const ext = filename.split('.').reverse()[0]!;
  if (ext in LANGUAGE_PATTERNS) return ext;
  for (const [id, pattern] of Object.entries(LANGUAGE_PATTERNS))
    if (pattern.test(filename)) return id;
  return 'textile';
}
