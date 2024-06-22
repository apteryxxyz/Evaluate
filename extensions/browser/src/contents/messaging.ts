import { sendMessage } from '~utilities/chrome-helpers';
import { extractRuntimeResolvables } from '~utilities/runtime-identifier';

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.to === 'background') return sendMessage(message);
  if (message.to !== 'messaging') return;

  if (message.subject === 'parseSelection') {
    const selection = window.getSelection();
    const element = selection?.anchorNode?.parentElement;
    if (!selection || !element) return;

    const code = selection.toString();
    const runtimeResolvables = extractRuntimeResolvables(element);

    return sendMessage({
      from: 'messaging',
      to: 'background',
      subject: 'prepareCode',
      ...{ code, runtimeResolvables },
    });
  }
});
