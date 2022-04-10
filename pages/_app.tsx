import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { MintContext } from '../context/mint-count';

import '../normalize.css';
import { firestore } from '../utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

function FreeFallApp({ Component, pageProps }: AppProps) {
  const [countdownDate, setCountdownDate] = useState<Date | undefined>();

  const [mintData, setMintData] = useState<{max: number, remaining: number}>({max: 0, remaining: 0});
  
  const mintState = {mintData, setMintData, countdownDate, setCountdownDate};

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "collection", "count"), (doc) => {
      const updatedData = {...mintData, max: doc.data()!.max, remaining: doc.data()!.remaining};

      setMintData(updatedData);
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    console.log(countdownDate);
  }, [countdownDate]);

  return (
    <MintContext.Provider value={mintState}>
        <Component {...pageProps} />
    </MintContext.Provider>
  );
}

export default FreeFallApp;
