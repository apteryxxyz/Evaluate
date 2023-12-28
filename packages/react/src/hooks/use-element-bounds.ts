import _throttle from 'lodash/throttle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from './use-event-listener';

/**
 * Grab the true bounds of an element, its left and top position includes
 * the scroll position of the window
 * @param elementRef the element to grab the bounds of
 * @param stateManager the form of state management to use
 * @param eventNames the events to listen to for updates
 * @returns the bounds of the element
 */
export function useElementBounds(
  elementRef: React.RefObject<Element>,
  stateManager: 'ref' | 'state',
  eventNames: string[],
) {
  type Bounds = { height: number; width: number; left: number; top: number };

  const defaultBounds = { height: -1, width: -1, left: -1, top: -1 };
  let elementBounds: { current: Bounds };
  let setElementBounds: (newBounds: Bounds) => void;

  // Scroll event plus set state would cause a lot of rerenders,
  // here we give the option to just use a ref instead, same with
  // the event names parameter

  if (stateManager === 'state') {
    const [state, setState] = useState(defaultBounds);
    elementBounds = { current: state };
    setElementBounds = setState;
  } else if (stateManager === 'ref') {
    const ref = useRef(defaultBounds);
    elementBounds = ref;
    setElementBounds = (newBounds: Bounds) => (ref.current = newBounds);
  } else {
    throw new Error('Invalid state manager');
  }

  const updateElementBounds = useCallback(
    _throttle(() => {
      if (!elementRef.current) return;
      const bounds = elementRef.current.getBoundingClientRect();
      setElementBounds({
        height: Math.floor(bounds.height),
        width: Math.floor(bounds.width),
        // Add the scroll position of the window to the left and top
        // to get the true position of the element
        left: Math.floor(bounds.left + window.scrollX),
        top: Math.floor(bounds.top + window.scrollY),
      });
    }, 200),
    [],
  );

  for (const eventName of eventNames)
    useEventListener(eventName as never, updateElementBounds);
  useEffect(() => updateElementBounds(), [updateElementBounds]);

  return elementBounds.current;
}
