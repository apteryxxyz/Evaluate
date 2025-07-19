import { Toaster } from '@evaluate/components/toast';
import { createRoot } from 'react-dom/client';
// import sonnerCss from 'sonner/dist/styles.css?inline';
import { onMessage, sendMessage } from 'webext-bridge/content-script';
import { extractRuntimeResolvables } from '~/helpers/runtime-resolvables';
import posthog, { sessionLog } from '~/services/posthog';
import tailwindCss from '../style.css?inline';
import { Execution } from './execution';
import { createIsolatedElement } from './shadow-root';

sendMessage('getBackgroundSessionId', void 0).then((id) => {
  sessionLog(id);
  Reflect.set(posthog?.sessionManager ?? {}, '_sessionId', id);
});

onMessage('getSelectionInfo', () => {
  const selection = window.getSelection();
  const element = selection?.anchorNode?.parentElement;
  const code = selection ? selection.toString() : '';

  if (!element) return { code, resolvables: [] };
  const resolvables = extractRuntimeResolvables(element);
  return { code, resolvables };
});

const { parentElement, portalElement, isolatedElement } = createIsolatedElement(
  {
    name: 'evaluate',
    type: 'overlay',
    fonts: {
      inter: 'https://rsms.me/inter/inter.css',
    },
    styles: {
      // TODO: Figure out why this is necessary
      tailwind: tailwindCss.replaceAll('border-style:', '__ignore__:'),
      // sonner: sonnerCss,
    },
    isolatedEvents: true,
  },
);

const root = createRoot(isolatedElement);
root.render(<ContentScript />);
document.documentElement.prepend(parentElement);

function ContentScript() {
  return (
    <>
      <Execution dialogPortal={portalElement} />
      <Toaster className="dark" />
    </>
  );
}
