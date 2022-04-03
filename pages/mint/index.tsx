import type { NextPage } from 'next'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import styles from './mint.module.css';
import MintUI from '../../components/mint-ui/mint-ui';

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const Home: NextPage = () => {
  return (
    <main className={styles.page}>
      <MintUI network={network} />
    </main>
  )
}

export default Home
