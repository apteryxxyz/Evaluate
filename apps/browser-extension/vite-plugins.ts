import generate_ from '@babel/generator';
import { parse } from '@babel/parser';
import traverse_ from '@babel/traverse';
import {
  isArrowFunctionExpression,
  isBlockStatement,
  isIfStatement,
  isReturnStatement,
} from '@babel/types';
import type { Plugin } from 'vite';
const generate = Reflect.get(generate_, 'default') as typeof generate_;
const traverse = Reflect.get(traverse_, 'default') as typeof traverse_;

/**
 * Vite plugin to remove the external script loading from posthog-js.
 * This is required because chrome extensions do not allow loading external scripts due to security reasons.
 */
export function removeExternalScriptLoading(): Plugin {
  return {
    name: 'modify-load-script',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('posthog-js/dist/module.js')) return null;

      const ast = parse(code, { sourceType: 'module' });

      traverse(ast, {
        VariableDeclarator(path) {
          if (
            isArrowFunctionExpression(path.node.init) &&
            path.node.init.params.length === 3 &&
            isBlockStatement(path.node.init.body)
          ) {
            const ifStatement = path.node.init.body.body //
              .find((node) => isIfStatement(node));
            if (isReturnStatement(ifStatement?.consequent))
              path.node.init.body = ifStatement.consequent.argument!;
          }
        },
      });

      return generate(ast);
    },
  };
}

/**
 * Vite plugin to remove import attributes from import statements.
 */
export function removeImportAttributes(): Plugin {
  return {
    name: 'remove-import-attributes',
    enforce: 'pre',
    transform(code) {
      return code.replaceAll(/(from\s['"](?:.*?)['"])(\swith\s\{.*?\})/g, '$1');
    },
  };
}
