import {FC, useContext} from 'react';
import Image from 'next/image'
import styles from './dashboard.module.css';
import { MintContext } from '../../context/mint-count';

interface IDashboard {}

const Dashboard : FC<IDashboard> = () => {
    const {max, remaining} = useContext(MintContext);

    return (
        <section className={styles.container}>
            <Image className={styles.image} alt="Teenager$ GIF" src="/teenagers.gif" layout='responsive' width="100%" height="100%" />
            <div className={styles.outer}>
                {<div className={styles.inner} style={{width: `${(max-remaining)/max*100}%`}}></div>}
            </div>
            <div className={styles.progress}>
                <p className={styles.count}>{max - remaining} minted</p>
                <p className={styles.count}>{remaining} remaining</p>
            </div>
        </section>
    );
}

export default Dashboard;