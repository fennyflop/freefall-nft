import { useMemo, FC } from 'react';
import type { NextPage } from 'next'
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import styles from './mint-ui.module.css';
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

const buttonClassName = 'wallet-adapter-button wallet-adapter-button-trigger';

interface IMintUI {
  network: WalletAdapterNetwork;
}

const MintUI : FC<IMintUI> = ({network}) => {
    const wallet = useWallet();
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
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <WalletMultiButton className={`${buttonClassName} ${styles.button}`}>Select Wallet</WalletMultiButton>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
    );
}

export default MintUI;
