export function getCurrentTab() {
  return new Promise<chrome.tabs.Tab | undefined>((r) => {
    chrome.tabs.query(
      {
        active: true,
        // currentWindow: true,
      },
      (tabs) => r(tabs[0]),
    );
  });
}

export async function sendMessage(message: {
  subject: string;
  [key: string]: unknown;
}) {
  if (typeof window === 'undefined') {
    const tab = await getCurrentTab();
    if (tab?.id) return chrome.tabs.sendMessage(tab.id, message);
  } else {
    return chrome.runtime.sendMessage(message);
  }
}
