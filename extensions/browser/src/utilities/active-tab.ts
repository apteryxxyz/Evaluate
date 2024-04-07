async function getActiveTab() {
  return new Promise<chrome.tabs.Tab>((resolve, reject) => {
    chrome.tabs.query(
      { active: true, currentWindow: true }, //
      (t) => (t[0]?.url ? resolve(t[0]) : reject(new Error('No active tab'))),
    );
  });
}

export async function getCurrentDomain() {
  if (window.location.protocol.startsWith('http')) {
    return window.location.hostname;
  } else {
    const tab = await getActiveTab();
    return tab.url ? new URL(tab.url).hostname : '';
  }
}

export async function getCurrentMetaTagContent() {
  if (window.location.protocol.startsWith('http')) {
    return (
      document
        .querySelector('meta[name="evaluate-extension"]')
        ?.getAttribute('content') || undefined
    );
  } else {
    const tab = await getActiveTab();
    return new Promise<string | undefined>((resolve) => {
      chrome.scripting.executeScript(
        { target: { tabId: tab.id! }, func: getCurrentMetaTagContent },
        (r) => resolve(r[0]?.result! as never),
      );
    });
  }
}
