import { useEffect, useMemo } from 'react';
import type { NextPage } from 'next'
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import styles from './mint.module.css';
require('@solana/wallet-adapter-react-ui/styles.css');

import { 
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const Home: NextPage = () => {
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [
          new PhantomWalletAdapter(),
          new SlopeWalletAdapter(),
          new SolflareWalletAdapter({ network }),
          new TorusWalletAdapter(),
          new LedgerWalletAdapter(),
          new SolletWalletAdapter({ network }),
          new SolletExtensionWalletAdapter({ network }),
      ],
      [network]
  );

  return (
    <main>
      <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <WalletMultiButton>Select Wallet</WalletMultiButton>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    </main>
  )
}

export default Home
