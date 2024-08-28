import { vscodeDarkInit, vscodeLightInit } from '@uiw/codemirror-theme-vscode';

const light = vscodeLightInit({
  settings: {
    background: '#fff',
    gutterBackground: '#f5f5f5',
    fontSize: '14px',
  },
});

const dark = vscodeDarkInit({
  settings: {
    background: '#1c1917',
    gutterBackground: '#1c1917',
    fontSize: '14px',
  },
});

export default { light, dark };

// import { createTheme } from '@uiw/codemirror-themes';

// const light = createTheme({
//   theme: 'light',
//   settings: {
//     background: '#fff',
//     lineHighlight: '#f5f5f5',
//     gutterBackground: '#f5f5f5',
//     selection: '#6199ff2f',
//     selectionMatch: '#72a1ff59',
//     fontSize: '14px',
//   },
//   styles: [
//     { tag: tags.meta, color: '#7a7574', fontStyle: 'italic' },
//     { tag: tags.comment, color: '#22863a', fontStyle: 'italic' },
//     { tag: tags.string, color: '#d73a49' },
//     { tag: tags.keyword, color: '#d73a49', fontWeight: 'bold' },
//     { tag: tags.number, color: '#005cc5' },
//     { tag: tags.operator, color: '#d73a49' },
//     { tag: tags.punctuation, color: '#393a34' },
//     { tag: tags.variableName, color: '#e36209' },
//     { tag: tags.function(tags.variableName), color: '#6f42c1' },
//     { tag: tags.typeName, color: '#005cc5' },
//     { tag: tags.className, color: '#6f42c1' },
//     { tag: tags.link, color: '#0366d6' },
//     { tag: tags.heading, color: '#d73a49', fontWeight: 'bold' },
//     { tag: tags.list, color: '#d73a49', fontWeight: 'bold' },
//     { tag: tags.emphasis, fontStyle: 'italic' },
//     { tag: tags.strong, fontWeight: 'bold' },
//     { tag: tags.link, color: '#0366d6' },
//     { tag: tags.url, color: '#0366d6' },
//     { tag: tags.contentSeparator, color: '#d73a49' },
//     { tag: tags.deleted, color: '#d73a49' },
//     { tag: tags.inserted, color: '#22863a' },
//     { tag: tags.changed, color: '#e36209' },
//     { tag: tags.invalid, color: '#f00' },
//     { tag: tags.special(tags.variableName), color: '#e36209' },
//     { tag: tags.special(tags.definition(tags.variableName)), color: '#6f42c1' },
//     { tag: tags.special(tags.function(tags.variableName)), color: '#6f42c1' },
//     { tag: tags.special(tags.typeName), color: '#005cc5' },
//     { tag: tags.special(tags.className), color: '#6f42c1' },
//     { tag: tags.special(tags.link), color: '#0366d6' },
//     { tag: tags.special(tags.heading), color: '#d73a49', fontWeight: 'bold' },
//     { tag: tags.special(tags.list), color: '#d73a49', fontWeight: 'bold' },
//     { tag: tags.special(tags.emphasis), fontStyle: 'italic' },
//     { tag: tags.special(tags.strong), fontWeight: 'bold' },
//     { tag: tags.special(tags.link), color: '#0366d6' },
//     { tag: tags.special(tags.url), color: '#0366d6' },
//     { tag: tags.special(tags.contentSeparator), color: '#d73a49' },
//     { tag: tags.special(tags.deleted), color: '#d73a49' },
//     { tag: tags.special(tags.inserted), color: '#22863a' },
//     { tag: tags.special(tags.changed), color: '#e36209' },
//     { tag: tags.special(tags.invalid), color: '#f00' },
//   ],
// });

// const dark = createTheme({
//   theme: 'dark',
//   settings: {
//     background: '#1c1917',
//     lineHighlight: 'hsl(240 3.7% 15.9%)',
//     gutterBackground: '#1c1917',
//     selection: '#6199ff2f',
//     selectionMatch: '#72a1ff59',
//     fontSize: '14px',
//   },
//   styles: [
//     { tag: tags.meta, color: '#b6b1b0', fontStyle: 'italic' },
//     { tag: tags.comment, color: '#5e6b70', fontStyle: 'italic' },
//     { tag: tags.string, color: '#98c379' },
//     { tag: tags.keyword, color: '#c678dd', fontWeight: 'bold' },
//     { tag: tags.number, color: '#d19a66' },
//     { tag: tags.operator, color: '#56b6c2' },
//     { tag: tags.punctuation, color: '#abb2bf' },
//     { tag: tags.variableName, color: '#e06c75' },
//     { tag: tags.function(tags.variableName), color: '#61afef' },
//     { tag: tags.typeName, color: '#e5c07b' },
//     { tag: tags.className, color: '#e5c07b' },
//     { tag: tags.link, color: '#61afef' },
//     { tag: tags.heading, color: '#61afef', fontWeight: 'bold' },
//     { tag: tags.list, color: '#61afef', fontWeight: 'bold' },
//     { tag: tags.emphasis, fontStyle: 'italic' },
//     { tag: tags.strong, fontWeight: 'bold' },
//     { tag: tags.link, color: '#61afef' },
//     { tag: tags.url, color: '#61afef' },
//     { tag: tags.contentSeparator, color: '#abb2bf' },
//     { tag: tags.deleted, color: '#e06c75' },
//     { tag: tags.inserted, color: '#98c379' },
//     { tag: tags.changed, color: '#d19a66' },
//     { tag: tags.invalid, color: '#f00' },
//     { tag: tags.special(tags.variableName), color: '#e06c75' },
//     { tag: tags.special(tags.definition(tags.variableName)), color: '#61afef' },
//     { tag: tags.special(tags.function(tags.variableName)), color: '#61afef' },
//     { tag: tags.special(tags.typeName), color: '#e5c07b' },
//     { tag: tags.special(tags.className), color: '#e5c07b' },
//     { tag: tags.special(tags.link), color: '#61afef' },
//     { tag: tags.special(tags.heading), color: '#61afef', fontWeight: 'bold' },
//     { tag: tags.special(tags.list), color: '#61afef', fontWeight: 'bold' },
//     { tag: tags.special(tags.emphasis), fontStyle: 'italic' },
//     { tag: tags.special(tags.strong), fontWeight: 'bold' },
//     { tag: tags.special(tags.link), color: '#61afef' },
//     { tag: tags.special(tags.url), color: '#61afef' },
//     { tag: tags.special(tags.contentSeparator), color: '#abb2bf' },
//     { tag: tags.special(tags.deleted), color: '#e06c75' },
//     { tag: tags.special(tags.inserted), color: '#98c379' },
//     { tag: tags.special(tags.changed), color: '#d19a66' },
//     { tag: tags.special(tags.invalid), color: '#f00' },
//   ],
// });

// console.log({ light, dark });

// export default { light, dark };
