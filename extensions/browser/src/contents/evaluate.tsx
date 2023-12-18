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
import { useElementBounds } from './_hooks/use-element-bounds';
// @ts-ignore
import tailwind from 'data-text:../styles/tailwind.css';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  world: 'MAIN',
};

export const getOverlayAnchorList: PlasmoGetOverlayAnchorList = () =>
  document.querySelectorAll('pre:not([data-evaluate-disabled="true"])');

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

export default function Content(p: PlasmoCSUIProps) {
  const anchorRef = useRef<HTMLPreElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  Reflect.set(anchorRef, 'current', p.anchor!.element);

  const anchorBounds = useElementBounds(anchorRef, 'ref', ['resize', 'scroll']);
  const overlayBounds = useElementBounds(overlayRef, 'state', ['resize']);

  // Detect when the mouse is within the bounds of the anchor element
  const [isHovered, setIsHovered] = useState(false);
  const onMove = useCallback(
    (event: MouseEvent) => {
      const { pageX, pageY } = event;
      const { left, top, width, height } = anchorBounds;

      // Unable to use onMouseEnter and onMouseLeave because the anchor
      // element often has other elements above it causing the mouse to
      // leave the anchor element even though the mouse is still within
      // the bounds of the anchor element
      const isInside =
        pageX >= left &&
        pageX <= left + width &&
        pageY >= top &&
        pageY <= top + height;
      setIsHovered(isInside);
    },
    [anchorBounds],
  );
  addEventListener('mousemove', onMove);

  return (
    <TranslateProvider>
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
    </TranslateProvider>
  );
}
