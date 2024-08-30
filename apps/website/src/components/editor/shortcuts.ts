import {
  cursorCharLeft,
  cursorCharRight,
  cursorGroupLeft,
  cursorGroupRight,
  cursorLineDown,
  cursorLineUp,
  insertNewlineAndIndent,
  selectCharLeft,
  selectCharRight,
  selectGroupLeft,
  selectGroupRight,
  selectLineDown,
  selectLineUp,
} from '@codemirror/commands';
import type { KeyBinding } from '@codemirror/view';

export default [
  {
    key: 'ArrowLeft',
    run: cursorCharLeft,
    shift: selectCharLeft,
    preventDefault: true,
  },
  {
    key: 'Mod-ArrowLeft',
    mac: 'Alt-ArrowLeft',
    run: cursorGroupLeft,
    shift: selectGroupLeft,
  },

  {
    key: 'ArrowRight',
    run: cursorCharRight,
    shift: selectCharRight,
    preventDefault: true,
  },
  {
    key: 'Mod-ArrowRight',
    mac: 'Alt-ArrowRight',
    run: cursorGroupRight,
    shift: selectGroupRight,
  },

  {
    key: 'ArrowUp',
    run: cursorLineUp,
    shift: selectLineUp,
    preventDefault: true,
  },
  {
    key: 'ArrowDown',
    run: cursorLineDown,
    shift: selectLineDown,
    preventDefault: true,
  },

  {
    key: 'Enter',
    run: insertNewlineAndIndent,
    shift: insertNewlineAndIndent,
  },
] as const satisfies ReadonlyArray<KeyBinding>;
