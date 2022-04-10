import { useEffect, useState, useRef } from 'react';
import { CandyMachineAccount } from '../../utils/candy-machine';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  findGatewayToken,
  getGatewayTokenAddressForOwnerAndGatekeeperNetwork,
  onGatewayTokenChange,
  removeAccountChangeListener,
} from '@identity.com/solana-gateway-ts';

import styles from './mint-button.module.css';

type TMintButton = {
    onMint: () => Promise<void>;
    candyMachine?: CandyMachineAccount;
    isMinting: boolean;
    setIsMinting: (val: boolean) => void;
    isActive: boolean;
}

export const MintButton = ({onMint, candyMachine, isMinting, setIsMinting, isActive}: TMintButton) => {
  const wallet = useWallet();
  const connection = useConnection();
  const [clicked, setClicked] = useState(false);
  const [verified, setVerified] = useState(false);
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [webSocketSubscriptionId, setWebSocketSubscriptionId] = useState(-1);

  const getMintButtonContent = () => {
    if (candyMachine?.state.isSoldOut) {
      return 'SOLD OUT';
    } else if (isMinting) {
      return <p>loading</p>;
    } else if (candyMachine?.state.isPresale || candyMachine?.state.isWhitelistOnly
    ) {
      return 'Whitelist Mint';
    }

    return 'Mint';
  };

  useEffect(() => {
    const mint = async () => {
      await removeAccountChangeListener(
        connection.connection,
        webSocketSubscriptionId,
      );
      await onMint();

      setClicked(false);
      setVerified(false);
    };
    if (verified && clicked) {
      mint();
    }
  }, [
    verified,
    clicked,
    connection.connection,
    onMint,
    webSocketSubscriptionId,
  ]);

  const previousGatewayStatus = usePrevious(gatewayStatus);
  useEffect(() => {
    const fromStates = [
      GatewayStatus.NOT_REQUESTED,
      GatewayStatus.REFRESH_TOKEN_REQUIRED,
    ];
    const invalidToStates = [...fromStates, GatewayStatus.UNKNOWN];
    if (
      fromStates.find(state => previousGatewayStatus === state) &&
      !invalidToStates.find(state => gatewayStatus === state)
    ) {
      setIsMinting(true);
    }
    console.log('change: ', gatewayStatus);
  }, [setIsMinting, previousGatewayStatus, gatewayStatus]);

  return (
    <button
      className={styles.button}
      disabled={isMinting || !isActive}
      onClick={async () => {
        if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
          const network = candyMachine.state.gatekeeper.gatekeeperNetwork.toBase58();
          if (network === 'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6') {
            if (gatewayStatus === GatewayStatus.ACTIVE) {
              await onMint();
            } else {
              // setIsMinting(true);
              await requestGatewayToken();
              console.log('after: ', gatewayStatus);
            }
          } else if (
            network === 'ttib7tuX8PTWPqFsmUFQTj78MbRhUmqxidJRDv4hRRE' ||
            network === 'tibePmPaoTgrs929rWpu755EXaxC7M3SthVCf6GzjZt'
          ) {
            setClicked(true);
            const gatewayToken = await findGatewayToken(
              connection.connection,
              wallet.publicKey!,
              candyMachine.state.gatekeeper.gatekeeperNetwork,
            );

            if (gatewayToken?.isValid()) {
              await onMint();
            } else {
              window.open(
                `https://verify.encore.fans/?gkNetwork=${network}`,
                '_blank',
              );

              const gatewayTokenAddress =
                await getGatewayTokenAddressForOwnerAndGatekeeperNetwork(
                  wallet.publicKey!,
                  candyMachine.state.gatekeeper.gatekeeperNetwork,
                );

              setWebSocketSubscriptionId(
                onGatewayTokenChange(
                  connection.connection,
                  gatewayTokenAddress,
                  () => setVerified(true),
                  'confirmed',
                ),
              );
            }
          } else {
            setClicked(false);
            throw new Error(`Unknown Gatekeeper Network: ${network}`);
          }
        } else {
          await onMint();
          setClicked(false);
        }
      }}
    >
      {getMintButtonContent()}
    </button>
  );
};

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
