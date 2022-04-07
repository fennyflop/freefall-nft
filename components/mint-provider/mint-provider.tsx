import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, FC, ReactNode } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

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

interface IMintProvider {
  children: ReactNode;
  network: WalletAdapterNetwork;
}

const MintProvider : FC<IMintProvider> = ({children, network}) => {
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
        <WalletProvider wallets={wallets}>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
    );
}

export default MintProvider;