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
