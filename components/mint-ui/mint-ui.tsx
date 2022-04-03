import { useState, useMemo, FC, useCallback } from 'react';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

import styles from './mint-ui.module.css';
import { PublicKey, Transaction } from '@solana/web3.js';
import { AlertState, getAtaForMint, toDate } from '../../utils/utils';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { awaitTransactionSignatureConfirmation, CandyMachineAccount, getCandyMachineState, mintOneToken } from '../../utils/candy-machine';

require('@solana/wallet-adapter-react-ui/styles.css');

const buttonClassName = 'wallet-adapter-button wallet-adapter-button-trigger';

const alertStateDefault = {
    open: false, message: '', severity: undefined,
};

interface IMintUI {
    rpcHost: string;
    txTimeout: number;
    candyMachineId: PublicKey;
    connection: anchor.web3.Connection;
}

const MintUI : FC<IMintUI> = ({candyMachineId, txTimeout, rpcHost, connection}) => {
    const [endDate, setEndDate] = useState<Date>();
    const [isActive, setIsActive] = useState(false);
    const [isPresale, setIsPresale] = useState(false);
    const [isUserMinting, setIsUserMinting] = useState(false);
    const [isWhitelistUser, setIsWhitelistUser] = useState(false);
    const [itemsRemaining, setItemsRemaining] = useState<number>();
    const [discountPrice, setDiscountPrice] = useState<anchor.BN>();
    const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
    const [alertState, setAlertState] = useState<AlertState>(alertStateDefault);

    const wallet = useWallet();

    const anchorWallet = useMemo(() => {
      const {publicKey, signAllTransactions, signTransaction} = wallet
      if (!wallet || !publicKey || !signAllTransactions || !signTransaction) return;
      return {publicKey, signAllTransactions, signTransaction} as anchor.Wallet;
    }, [wallet]);

    const refreshCandyMachineState = useCallback(async () => {
        if (!anchorWallet || !candyMachine) return;
        try {
          const cndy = await getCandyMachineState(anchorWallet, candyMachineId, connection);
          let active = cndy?.state.goLiveDate?.toNumber() < new Date().getTime() / 1000;
          let presale = false;
          // whitelist mint?
          if (cndy?.state.whitelistMintSettings) {
            // is it a presale mint?
            if (cndy.state.whitelistMintSettings.presale && (!cndy.state.goLiveDate || cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)) {
              presale = true;
            }
            // is there a discount?
            if (cndy.state.whitelistMintSettings.discountPrice) {
              setDiscountPrice(cndy.state.whitelistMintSettings.discountPrice);
            } else {
              setDiscountPrice(undefined);
              if (!cndy.state.whitelistMintSettings.presale) {
                cndy.state.isWhitelistOnly = true;
              }
            }
            // retrieves the whitelist token
            const mint = new anchor.web3.PublicKey(cndy.state.whitelistMintSettings.mint);
            const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0];

            try {
              const balance = await connection.getTokenAccountBalance(token);
              let valid = parseInt(balance.value.amount) > 0;
              // only whitelist the user if the balance > 0
              setIsWhitelistUser(valid);
              active = (presale && valid) || active;
            } catch (e) {
              setIsWhitelistUser(false);
              // no whitelist user, no mint
              if (cndy.state.isWhitelistOnly) {
                active = false;
              }
              console.log('There was a problem fetching whitelist token balance');
              console.log(e);
            }
          }
          // datetime to stop the mint?
          if (cndy?.state.endSettings?.endSettingType.date) {
            setEndDate(toDate(cndy.state.endSettings.number));
            if (
              cndy.state.endSettings.number.toNumber() <
              new Date().getTime() / 1000
            ) {
              active = false;
            }
          }
          // amount to stop the mint?
          if (cndy?.state.endSettings?.endSettingType.amount) {
            let limit = Math.min(cndy.state.endSettings.number.toNumber(), cndy.state.itemsAvailable,);
            if (cndy.state.itemsRedeemed < limit) {
              setItemsRemaining(limit - cndy.state.itemsRedeemed);
            } else {
              setItemsRemaining(0);
              cndy.state.isSoldOut = true;
            }
          } else {
            setItemsRemaining(cndy.state.itemsRemaining);
          }

          if (cndy.state.isSoldOut) {
            active = false;
          }

          setIsActive((cndy.state.isActive = active));
          setIsPresale((cndy.state.isPresale = presale));
          setCandyMachine(cndy);
        } catch (e) {
          console.log('There was a problem fetching Candy Machine state');
          console.log(e);
        }
      }, [anchorWallet, candyMachineId, connection]);
    
      const onMint = async (beforeTransactions: Transaction[] = [], afterTransactions: Transaction[] = []) => {
        try {
          setIsUserMinting(true);
          document.getElementById('#identity')?.click();
          if (wallet.connected && candyMachine?.program && wallet.publicKey) {
            let mintOne = await mintOneToken(candyMachine, wallet.publicKey, beforeTransactions, afterTransactions);
    
            const mintTxId = mintOne[0];
    
            let status: any = { err: true };
            if (mintTxId) {
              status = await awaitTransactionSignatureConfirmation(
                mintTxId,
                txTimeout,
                connection,
                true,
              );
            }
    
            if (status && !status.err) {
              // manual update since the refresh might not detect
              // the change immediately
              let remaining = itemsRemaining! - 1;
              setItemsRemaining(remaining);
              setIsActive((candyMachine.state.isActive = remaining > 0));
              candyMachine.state.isSoldOut = remaining === 0;
              setAlertState({
                open: true,
                message: 'Congratulations! Mint succeeded!',
                severity: 'success',
              });
            } else {
              setAlertState({
                open: true,
                message: 'Mint failed! Please try again!',
                severity: 'error',
              });
            }
          }
        } catch (error: any) {
          let message = error.msg || 'Minting failed! Please try again!';
          if (!error.msg) {
            if (!error.message) {
              message = 'Transaction Timeout! Please try again.';
            } else if (error.message.indexOf('0x137')) {
              console.log(error);
              message = `SOLD OUT!`;
            } else if (error.message.indexOf('0x135')) {
              message = `Insufficient funds to mint. Please fund your wallet.`;
            }
          } else {
            if (error.code === 311) {
              console.log(error);
              message = `SOLD OUT!`;
              window.location.reload();
            } else if (error.code === 312) {
              message = `Minting period hasn't started yet.`;
            }
          }
    
          setAlertState({
            open: true,
            message,
            severity: 'error',
          });
          // updates the candy machine state to reflect the lastest
          // information on chain
          refreshCandyMachineState();
        } finally {
          setIsUserMinting(false);
        }
      };
      
      const toggleMintButton = () => {
        let active = !isActive || isPresale;
    
        if (active) {
          if (candyMachine!.state.isWhitelistOnly && !isWhitelistUser) active = false;
          if (endDate && Date.now() >= endDate.getTime()) active = false;
        }
    
        if (isPresale && candyMachine!.state.goLiveDate && candyMachine!.state.goLiveDate.toNumber() <= new Date().getTime() / 1000) {
          setIsPresale((candyMachine!.state.isPresale = false));
        }
    
        setIsActive((candyMachine!.state.isActive = active));
      };

        return (
          <section className={styles.section}>
              {
                !wallet.connected ?
                <WalletMultiButton className={`${buttonClassName} ${styles.button}`}>Select Wallet</WalletMultiButton>
                :
                <></>
              }
          </section>
        );
}

export default MintUI;
