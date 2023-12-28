import { useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';

const LoadCache = new Set();

function loadScript(src: string) {
  if (LoadCache.has(src)) return;
  LoadCache.add(src);

  const script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
}

export function Script(p: { src: string }) {
  const hasEffectCalled = useRef(false);
  useEffect(() => {
    if (hasEffectCalled.current) return;
    loadScript(p.src);
    hasEffectCalled.current = true;
  }, [p.src]);

  // @ts-ignore
  ReactDOM.preload(p.src, { as: 'script' });
  return null;
}
