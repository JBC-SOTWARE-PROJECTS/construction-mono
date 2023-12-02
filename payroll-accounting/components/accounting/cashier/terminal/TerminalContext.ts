import { createContext } from 'react';

export const TerminalContext = createContext({});

export const TerminalProvider = TerminalContext.Provider;
export const TerminalConsumer = TerminalContext.Consumer;
