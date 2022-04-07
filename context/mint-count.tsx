import { createContext } from 'react';
import { TMintContext } from '../utils/type';

export const MintContext = createContext<TMintContext>({mintData: {max: 0, remaining: 0,}, countdownDate: undefined, setCountdownDate: () => {}, setMintData: () => {}});