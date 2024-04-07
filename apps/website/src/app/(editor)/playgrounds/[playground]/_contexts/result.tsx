'use client';

import type { ExecuteResult } from '@evaluate/engine/execute';
import { createContext, useContext, useState } from 'react';

const ResultContext = createContext<
  [
    ExecuteResult | undefined,
    React.Dispatch<React.SetStateAction<ExecuteResult | undefined>>,
  ]
>(null!);
ResultContext.displayName = 'ResultContext';
export const ResultConsumer = ResultContext.Consumer;
export function ResultProvider(p: React.PropsWithChildren) {
  return (
    <ResultContext.Provider value={useState<ExecuteResult>()}>
      {p.children}
    </ResultContext.Provider>
  );
}

export function useResult() {
  const context = useContext(ResultContext);
  if (context) return context;
  throw new Error('useResult must be used within a Result.Provider');
}
