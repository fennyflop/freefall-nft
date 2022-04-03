import type { NextPage } from 'next'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import styles from './mint.module.css';
import MintUI from '../../components/mint-ui/mint-ui';
import MintProvider from '../../components/mint-provider/mint-provider';

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const Home: NextPage = () => {
  return (
    <main className={styles.page}>
      <MintProvider network={network}>
        <MintUI />
      </MintProvider>
    </main>
  )
}

export default Home
