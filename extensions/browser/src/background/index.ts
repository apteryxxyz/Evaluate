import { executeCode } from '@evaluate/engine/dist/execute';
import {
  type PartialRuntime,
  searchRuntimes,
} from '@evaluate/engine/dist/runtimes';
import { env } from '~env';
import analytics from '~services/analytics';
import { getDistinctId, setDistinctId } from '~utilities/analytics-helpers';
import { getCurrentTab, sendMessage } from '~utilities/chrome-helpers';

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    analytics?.capture('extension installed', {
      $current_url: '',
      platform: 'browser extension',
    });
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    analytics?.capture('extension updated', {
      $current_url: '',
      platform: 'browser extension',
    });
  }

  chrome.contextMenus.create({
    id: 'evaluate-runCodeSelection',
    title: 'Execute Code',
    contexts: ['selection'],
  });
});

chrome.action.onClicked.addListener(async () => {
  analytics?.capture('browser action clicked', {
    $current_url: '',
    platform: 'browser extension',
  });

  chrome.tabs.create({
    url: env.PLASMO_PUBLIC_WEBSITE_URL,
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'evaluate-runCodeSelection' && tab?.id) {
    analytics?.capture('context menu item clicked', {
      $current_url: await getCurrentTab().then((t) => t?.url),
      platform: 'browser extension',
    });

    // While the info.selectionText is available, we need the element
    // to extract the runtime resolvables, so we send a message to the
    // messaging content script to get the runtime resolvables
    chrome.tabs.sendMessage(tab.id, {
      from: 'background',
      to: 'messaging',
      subject: 'parseSelection',
    });
  }
});

chrome.runtime.onMessage.addListener(async (message, _, sendResponse) => {
  // Relay the non background intended message back to the current tab
  if (message.to !== 'background') return sendMessage(message);

  //

  if (message.subject === 'prepareCode') {
    const code = message.code as string;
    const runtimeResolvables = message.runtimeResolvables as string[];

    const runtimes = await searchRuntimes(...runtimeResolvables) //
      .then((r) => r.slice(0, 5));

    if (runtimes.length) {
      message = {
        from: 'background',
        to: 'background',
        subject: 'runCode',
        ...{ code, runtimes },
      };
    } else {
      sendMessage({
        from: 'background',
        to: 'dialog',
        subject: 'unknownRuntime',
        ...{ code },
      });
    }
  }

  //

  if (message.subject === 'runCode') {
    const code = message.code as string;
    const runtimes = message.runtimes as PartialRuntime[];

    sendMessage({
      from: 'background',
      to: 'dialog',
      subject: 'executionStarted',
      ...{ runtimes },
    });

    const promises = [];
    for (const runtime of runtimes) {
      promises.push(
        executeCode({
          runtime: runtime.id,
          files: { 'file.code': code },
          entry: 'file.code',
        }).then(async (r) => {
          analytics?.capture('code executed', {
            $current_url: await getCurrentTab().then((t) => t?.url),
            platform: 'browser extension',
            'runtime id': runtime.id,
            'was successful':
              r.run.code === 0 && (!r.compile || r.compile.code === 0),
          });
          return { ...r, runtime };
        }),
      );

      if (runtimes.length > 1)
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const results = await Promise.all(promises);
    sendMessage({
      from: 'background',
      to: 'dialog',
      subject: 'showResults',
      ...{ code, results },
    });
  }

  //

  if (message.subject === 'getDistinctId') {
    sendResponse(await getDistinctId());
  } else if (message.subject === 'setDistinctId') {
    setDistinctId(message.distinctId);
  }
});
