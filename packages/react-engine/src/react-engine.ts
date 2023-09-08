import { createContext, useContext } from 'react';

import { Engine } from '@chameleon/engine';

const engineContext = createContext<Engine | null>(null);

export const EngineProvider = engineContext.Provider;

export function useEngine() {
  const value = useContext(engineContext);

  if (!value) throw new Error(`Value not passed to "EngineProvider".`);

  return value;
}
