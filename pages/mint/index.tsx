import type { NextPage } from 'next'
import * as anchor from '@project-serum/anchor';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import styles from './mint.module.css';
import MintUI from '../../components/mint-ui/mint-ui';
import MintProvider from '../../components/mint-provider/mint-provider';
import { getCandyMachineId } from '../../utils/candy-machine';

const candyMachineId = getCandyMachineId();
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(
  rpcHost ? rpcHost : anchor.web3.clusterApiUrl('devnet'),
);

const timeout = 30000;

const Home: NextPage = () => {
  console.log(candyMachineId);
  return (
    <main className={styles.page}>
      <MintProvider network={network}>
        <MintUI candyMachineId={candyMachineId} txTimeout={timeout} rpcHost={rpcHost} connection={connection} />
      </MintProvider>
    </main>
  )
}

export default Home
