import { createContext } from 'react';
import { TMintData } from '../utils/type';

export const MintContext = createContext<TMintData>({max: 0, remaining: 0});