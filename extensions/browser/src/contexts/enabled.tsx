'use client';

import { useStorage } from '@plasmohq/storage/hook';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getCurrentMetaTagContent } from '../utilities/active-tab';

interface EnabledState {
  isEnabled: boolean;
  isRequestedDisabled: boolean;
  setEnabled(enabled: boolean): void;
  isEnabledFor(domain: string): boolean;
  setEnabledFor(domain: string, enabled: boolean): void;
}

export const EnabledContext = createContext<EnabledState>(null!);

export const EnabledConsumer = EnabledContext.Consumer;

export function EnabledProvider(p: React.PropsWithChildren) {
  const [isEnabled, setEnabled] = useStorage<boolean>('enabled', true);
  const [disabledFor, setDisabledFor] = useStorage<string[]>('disabledFor', []);

  const [isRequestedDisabled, setRequestedDisabled] = useState(false);
  useEffect(() => {
    getCurrentMetaTagContent() //
      .then((c) => setRequestedDisabled(c === 'disabled'));
  }, []);

  //

  const isEnabledFor = useCallback(
    (domain: string) =>
      isEnabled && !isRequestedDisabled && !disabledFor.includes(domain),
    [isEnabled, isRequestedDisabled, disabledFor],
  );

  const setEnabledFor = useCallback(
    (domain: string, enabled: boolean) => {
      setDisabledFor((prev) => {
        if (!enabled) return [...(prev ?? []), domain];
        return prev?.filter((d) => d !== domain) ?? [];
      });
    },
    [setDisabledFor],
  );

  //

  return (
    <EnabledContext.Provider
      value={{
        isEnabled,
        isRequestedDisabled,
        setEnabled,
        isEnabledFor,
        setEnabledFor,
      }}
    >
      {p.children}
    </EnabledContext.Provider>
  );
}

export function useEnabled() {
  return useContext(EnabledContext);
}
