interface CreateIsolatedElementOptions {
  name: string;
  type: 'overlay';
  fonts?: Record<string, string>;
  styles?: Record<string, string>;
  isolatedEvents?: boolean | string[];
}

export function createIsolatedElement(options: CreateIsolatedElementOptions) {
  const { name, type, fonts, styles, isolatedEvents } = options;

  const parentElement = document.createElement(`${name}-shadow-host`);
  const shadowRoot = parentElement.attachShadow({ mode: 'open' });

  for (const [id, href] of Object.entries(fonts ?? {}))
    shadowRoot.appendChild(createFontElement(id, href));
  for (const [id, content] of Object.entries(styles ?? {}))
    shadowRoot.appendChild(createStyleElement(id, content));

  const bodyElement = document.createElement('body');
  bodyElement.id = `${name}-shadow-container`;
  bodyElement.classList.add('dark');
  bodyElement.style.zIndex = '2147483647';
  bodyElement.style.position = 'relative';
  bodyElement.style.height = '0px';
  shadowRoot.appendChild(bodyElement);

  let isolatedElement: HTMLElement = bodyElement;
  switch (type) {
    case 'overlay': {
      const overlayElement = document.createElement('overlay');
      overlayElement.id = `${name}-shadow-overlay`;
      overlayElement.style.display = 'flex';
      overlayElement.style.position = 'absolute';
      overlayElement.style.inset = '0px';
      bodyElement.appendChild(overlayElement);
      isolatedElement = overlayElement;
      break;
    }
  }

  const portalElement = document.createElement('portal');
  portalElement.id = `${name}-shadow-portal`;
  bodyElement.appendChild(portalElement);

  if (isolatedEvents) {
    const eventTypes = Array.isArray(isolatedEvents)
      ? isolatedEvents
      : ['keydown', 'keyup', 'keypress'];
    for (const t of eventTypes)
      bodyElement.addEventListener(t, (e) => e.stopPropagation());
  }

  return { parentElement, portalElement, isolatedElement };
}

function createFontElement(id: string, href: string) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.id = id;
  link.href = href;
  return link;
}

function createStyleElement(id: string, content: string) {
  const style = document.createElement('style');
  style.id = id;
  style.textContent = content;
  return style;
}
