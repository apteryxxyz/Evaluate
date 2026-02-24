'use client';

import type { ExecuteResult } from 'piston.ts';

import { createContext, useContext, useState } from 'react';

const TerminalContext = createContext<{
  result: typeof ExecuteResult._output | undefined;
  setResult: React.Dispatch<
    React.SetStateAction<typeof ExecuteResult._output | undefined>
  >;
}>(null!);
TerminalContext.displayName = 'ResultContext';
export const TerminalConsumer = TerminalContext.Consumer;
export function TerminalProvider(p: React.PropsWithChildren) {
  const [result, setResult] = useState<typeof ExecuteResult._output>();

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
