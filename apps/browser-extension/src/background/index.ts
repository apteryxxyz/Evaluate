import { executeCode } from '@evaluate/engine/execute';
import { searchRuntimes } from '@evaluate/engine/runtimes';
import type { ExecuteResult, PartialRuntime } from '@evaluate/shapes';
import type { ProtocolWithReturn } from 'webext-bridge';
import { sendMessage } from 'webext-bridge/background';
import browser from 'webextension-polyfill';
import env from '~/env';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    getSelectionInfo: ProtocolWithReturn<
      void,
      { code: string; resolvables: string[] }
    >;
    unknownRuntime: ProtocolWithReturn<{ code: string }, void>;
    executionStarted: ProtocolWithReturn<
      { runtimeNameOrCount: string | number },
      void
    >;
    executionFailed: ProtocolWithReturn<{ errorMessage: string }, void>;
    executionFinished: ProtocolWithReturn<
      { code: string; runtimes: PartialRuntime[]; results: ExecuteResult[] },
      void
    >;
  }
}

browser.action.setTitle({ title: 'Evaluate' });

browser.action.onClicked.addListener(async () => {
  browser.tabs.create({ url: `${env.VITE_PUBLIC_WEBSITE_URL}` });
});

browser.runtime.onInstalled.addListener(async () => {
  browser.contextMenus.create({
    id: 'runCodeSelection',
    title: 'Execute Code',
    contexts: ['selection'],
  });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'runCodeSelection' || !tab?.id) return;
  const endpoint = `content-script@${tab.id}`;

  const selection = await sendMessage('getSelectionInfo', void 0, endpoint);
  const { code, resolvables } = selection;
  const runtimes = (await searchRuntimes(...resolvables)).slice(0, 5);
  if (!runtimes.length)
    return sendMessage('unknownRuntime', { code }, endpoint);

  const runtimeNameOrCount =
    runtimes.length === 1 ? runtimes[0]!.name : runtimes.length;
  sendMessage('executionStarted', { runtimeNameOrCount }, endpoint);

  const promises = [];
  for (const runtime of runtimes) {
    const initialPromise = executeCode({
      runtime: runtime.id,
      files: { 'file.code': code },
      entry: 'file.code',
    }).catch((error) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      sendMessage('executionFailed', { errorMessage: message }, endpoint);
      throw error;
    });
    promises.push(initialPromise);
  }

  const results = await Promise.all(promises);
  sendMessage('executionFinished', { code, runtimes, results }, endpoint);
});
