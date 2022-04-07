import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { MintContext } from '../context/mint-count';

import '../normalize.css';
import { TMintData } from '../utils/type';
import { firestore } from '../utils/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

function FreeFallApp({ Component, pageProps }: AppProps) {
  const [mintData, setMintData] = useState<TMintData>({max: 0, remaining: 0});

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "collection", "count"), (doc) => {
      const updatedData = {max: doc.data()!.max, remaining: doc.data()!.remaining};

      setMintData(updatedData);
    });
    return () => {
      unsub();
    };
  }, [])

  return (
    <MintContext.Provider value={mintData}>
      <Component {...pageProps} />
    </MintContext.Provider>
  );
}

export default FreeFallApp;
