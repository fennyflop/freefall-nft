import {FC, useContext} from 'react';
import Countdown from 'react-countdown';
import { MintContext } from '../../context/mint-count';
import { toDate } from '../../utils/utils';
import styles from './mint-countdown.module.css';

interface IMintRenderer {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
}

const MintRenderer : FC<IMintRenderer> = ({days, hours, minutes, seconds, completed}) => {

    return (
        <section className={styles.container}>
            <h2 className={styles.header}>until public sale</h2>
            <div className={styles.countdown}>
                {days && 
                <div className={styles.count}>
                    <p className={styles.number}>{days}</p>
                    <span className={styles.name}>days</span>
                </div>}
                <span className={styles.seperator}>:</span>
                <div className={styles.count}>
                    <p className={styles.number}>{hours < 10 ? `0${hours}` : hours}</p>
                    <span className={styles.name}>hours</span>
                </div>
                <span className={styles.seperator}>:</span>
                <div className={styles.count}>
                    <p className={styles.number}>{minutes < 10 ? `0${minutes}` : minutes}</p>
                    <span className={styles.name}>mins</span>
                </div>
                <span className={styles.seperator}>:</span>
                <div className={styles.count}>
                    <p className={styles.number}>{seconds < 10 ? `0${seconds}` : seconds}</p>
                    <span className={styles.name}>secs</span>
                </div>

            </div>
        </section>
    );
}

const MintCountdown: FC = () => {
    const {countdownDate} = useContext(MintContext);

    if (!countdownDate?.getTime()) return null;

    return (
        <Countdown
            date={countdownDate?.getTime() }
            renderer={MintRenderer}
            onComplete={console.log}
        />
    );
}

export default MintCountdown;