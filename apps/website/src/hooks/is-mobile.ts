import isMobile from 'is-mobile';
import { useMemo } from 'react';

export function useIsMobile() {
  return useMemo(() => isMobile(), []);
}
