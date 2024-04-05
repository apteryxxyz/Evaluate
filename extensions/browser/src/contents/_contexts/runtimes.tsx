import {
  type PartialRuntime,
  fetchRuntimes,
} from '@evaluate/engine/dist/runtimes';
import { createContext, useCallback, useContext, useState } from 'react';

interface RuntimesState {
  runtimes: PartialRuntime[] | undefined;
  fetchRuntimes(): Promise<PartialRuntime[]>;
}

export const RuntimesContext = createContext<RuntimesState>(null!);

export const RuntimesConsumer = RuntimesContext.Consumer;

export function RuntimesProvider(p: React.PropsWithChildren) {
  const [runtimes, setRuntimes] = useState<PartialRuntime[]>();
  const _fetchRuntimes = useCallback(async () => {
    const runtimes = await fetchRuntimes().then((r) => r);
    setRuntimes(runtimes);
    return runtimes;
  }, []);

  return (
    <RuntimesContext.Provider
      value={{ runtimes, fetchRuntimes: _fetchRuntimes }}
    >
      {p.children}
    </RuntimesContext.Provider>
  );
}

export function useRuntimes() {
  return useContext(RuntimesContext);
}
