async function getActiveTab() {
  return new Promise<chrome.tabs.Tab>((resolve, reject) =>
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
      tabs[0]?.url ? resolve(tabs[0]) : reject(undefined),
    ),
  );
}

export async function getDomain() {
  if (window.location.protocol.startsWith('http')) {
    return window.location.hostname;
  } else {
    const tab = await getActiveTab();
    return tab.url ? new URL(tab.url).hostname : undefined;
  }
}

export async function getMetaTagContent(): Promise<
  'enabled' | 'disabled' | (string & {})
> {
  if (window.location.protocol.startsWith('http')) {
    return (
      document
        .querySelector('meta[name="evaluate-extension"]')
        ?.getAttribute('content') ?? 'enabled'
    );
  } else {
    const tab = await getActiveTab();
    return new Promise<'enabled' | 'disabled'>((resolve) =>
      chrome.scripting.executeScript(
        { target: { tabId: tab.id! }, func: getMetaTagContent },
        (r) => resolve(r[0]?.result! as never),
      ),
    );
  }
}
