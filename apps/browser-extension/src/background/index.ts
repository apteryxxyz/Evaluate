import { type ExecuteResult, executeCode } from '@evaluate/execute';
import { type Runtime, searchForRuntimes } from '@evaluate/runtimes';
import type { ProtocolWithReturn } from 'webext-bridge';
import { onMessage, sendMessage } from 'webext-bridge/background';
import browser from 'webextension-polyfill';
import env from '~/env';
import posthog, { sessionLog } from '~/services/posthog';

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
      { code: string; runtimes: Runtime[]; results: ExecuteResult[] },
      void
    >;
    getBackgroundSessionId: ProtocolWithReturn<void, string | undefined>;
  }
}

browser.action.setTitle({ title: 'Evaluate' });

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    posthog?.capture('installed_extension');
  } else if (details.reason === 'update') {
    posthog?.capture('updated_extension');
  }
});

browser.contextMenus.create({
  id: 'runCodeSelection',
  title: 'Execute Code',
  contexts: ['selection'],
});

browser.action.onClicked.addListener(async () => {
  posthog?.capture('clicked_browser_action');
  browser.tabs.create({ url: `${env.VITE_PUBLIC_WEBSITE_URL}` });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'runCodeSelection' || !tab?.id) return;

  posthog?.capture('clicked_context_menu_item', { $current_url: tab.url });
  const endpoint = `content-script@${tab.id}`;

  const selection = await sendMessage('getSelectionInfo', void 0, endpoint);
  const { code, resolvables } = selection;
  const runtimes = (await searchForRuntimes(resolvables)).slice(0, 5);
  if (!runtimes.length)
    return sendMessage('unknownRuntime', { code }, endpoint);

  const runtimeNameOrCount =
    runtimes.length === 1 ? runtimes[0]!.name : runtimes.length;
  sendMessage('executionStarted', { runtimeNameOrCount }, endpoint);

  const promises = [];
  for (const runtime of runtimes) {
    const initialPromise = executeCode(runtime, { code })
      .then(([result, options]) => {
        posthog?.capture('executed_code', {
          runtime_id: runtime.id,
          code_length: options.length,
          code_lines: options.lines,
          compile_successful: result.compile?.success ?? null,
          execution_successful: result.success,
        });
        return result;
      })
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        sendMessage('executionFailed', { errorMessage: message }, endpoint);
        throw error;
      });
    promises.push(initialPromise);
  }

  const results = await Promise.all(promises);
  sendMessage('executionFinished', { code, runtimes, results }, endpoint);
});

onMessage('getBackgroundSessionId', () => {
  const sessionId = posthog?.get_session_id();
  sessionLog(sessionId);
  return sessionId;
});
