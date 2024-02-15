'use client';

import { useStorage } from '@plasmohq/storage/hook';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getMetaTagContent } from '~utilities/active-tab';

type EnabledContextProps = {
  isEnabled: boolean;
  setEnabled(enabled: boolean): void;
  isEnabledFor(domain: string): boolean;
  setEnabledFor(domain: string, enabled: boolean): void;
};
export const EnabledContext = //
  createContext<EnabledContextProps>(null!);
EnabledContext.displayName = 'EnabledContext';
export const EnabledConsumer = EnabledContext.Consumer;

export function EnabledProvider(p: React.PropsWithChildren) {
  const [isEnabled, setEnabled] = useStorage<boolean>('enabled');
  const [disabledFor, setDisabledFor] = useStorage<string[]>('disabledFor', []);

  const [hasDisabledTag, setHasDisabledTag] = useState<boolean>();
  useEffect(() => {
    getMetaTagContent().then((c) => setHasDisabledTag(c === 'disabled'));
  }, []);

  const isEnabledFor = useCallback(
    (domain: string) =>
      !hasDisabledTag && isEnabled && !disabledFor.includes(domain),
    [hasDisabledTag, isEnabled, disabledFor],
  );

  const setEnabledFor = useCallback(
    (domain: string, enabled: boolean) =>
      setDisabledFor((d) => {
        if (!enabled) return [...(d ?? []), domain];
        return (d ?? []).filter((d) => d !== domain);
      }),
    [setDisabledFor],
  );

  return (
    <EnabledContext.Provider
      value={{ isEnabled, setEnabled, isEnabledFor, setEnabledFor }}
      {...p}
    />
  );
}

/**
 * Grab the current enabled state from context.
 * @returns a boolean indicating whether the extension is enabled
 */
export function useEnabled() {
  return useContext(EnabledContext);
}
