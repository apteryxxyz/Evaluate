'use client';

import type { ExecuteResult } from '@evaluate/engine/execute';
import { createContext, useContext, useState } from 'react';

const TerminalContext = createContext<{
  result: ExecuteResult | undefined;
  setResult: React.Dispatch<React.SetStateAction<ExecuteResult | undefined>>;
}>(null!);
TerminalContext.displayName = 'ResultContext';
export const TerminalConsumer = TerminalContext.Consumer;
export function TerminalProvider(p: React.PropsWithChildren) {
  const [result, setResult] = useState<ExecuteResult>();

  return (
    <TerminalContext.Provider value={{ result, setResult }}>
      {p.children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context) return context;
  throw new Error('useTerminal must be used within a TerminalProvider');
}
