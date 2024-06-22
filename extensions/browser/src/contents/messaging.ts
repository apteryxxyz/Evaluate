import { sendMessage } from '~utilities/chrome-helpers';
import { extractRuntimeResolvables } from '~utilities/runtime-identifier';

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.subject === 'parseSelection') {
    const selection = window.getSelection();
    const element = selection?.anchorNode?.parentElement;
    const code = selection ? selection.toString() : '';
    const runtimeResolvables = element
      ? extractRuntimeResolvables(element)
      : [];

    return sendMessage({
      subject: 'prepareCode',
      ...{ code, runtimeResolvables },
    });
  }
});
