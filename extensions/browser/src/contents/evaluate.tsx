import { useElementBounds } from '@evaluate/react/hooks/element-bounds';
import { useEventListener } from '@evaluate/react/hooks/event-listener';
import { motion } from 'framer-motion';
import type {
  PlasmoCSConfig,
  PlasmoCSUIProps,
  PlasmoGetOverlayAnchorList,
  PlasmoGetStyle,
} from 'plasmo';
import { useCallback, useRef, useState } from 'react';
import { TranslateProvider } from '~contexts/translate';
import { RunButton } from './_components/run-button';
// @ts-ignore
import tailwind from 'data-text:../styles/tailwind.css';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

export const getOverlayAnchorList: PlasmoGetOverlayAnchorList = () =>
  document.querySelectorAll('pre');

export const getStyle: PlasmoGetStyle = () => {
  const link = document.createElement('link');
  link.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const style = document.createElement('style');
  style.textContent = tailwind.replaceAll(':root', ':host');
  return style;
};

export default function ContentWrapper(p: PlasmoCSUIProps) {
  return (
    <TranslateProvider>
      <Content {...p} />
    </TranslateProvider>
  );
}

export function Content(p: PlasmoCSUIProps) {
  const anchorRef = useRef<HTMLPreElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  Reflect.set(anchorRef, 'current', p.anchor!.element);

  const anchorBounds = useElementBounds(anchorRef, 'ref', ['resize', 'scroll']);
  const overlayBounds = useElementBounds(overlayRef, 'state', ['resize']);

  // Detect when the mouse is within the bounds of the anchor element
  const [isHovered, setIsHovered] = useState(false);
  const onMove = useCallback(
    (event: { pageX: number; pageY: number }) => {
      // Unable to use onMouseEnter and onMouseLeave because the anchor
      // element often has other elements above it causing the mouse to
      // leave the anchor element even though the mouse is still within
      // the bounds of the anchor element
      const { pageX: x, pageY: y } = event;
      const { left: l, top: t, width: w, height: h } = anchorBounds;
      setIsHovered(x >= l && x <= l + w && y >= t && y <= t + h);
    },
    [anchorBounds],
  );
  useEventListener('mousemove', onMove);

  return (
    <>
      <motion.div
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: anchorBounds.height - overlayBounds.height,
          left: anchorBounds.width - overlayBounds.width,
        }}
        initial={{ opacity: 0 }}
        animate={isHovered ? 'visible' : 'hidden'}
        variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
      >
        <RunButton preElement={anchorRef.current!} dialogRef={dialogRef} />
      </motion.div>

      <div
        ref={dialogRef}
        style={{ fontFamily: 'Inter', maxHeight: '95dvh' }}
      />
    </>
  );
}
