import {FC, useContext} from 'react';
import Countdown from 'react-countdown';
import styles from './dashboard.module.css';

interface IMintRenderer {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
}

interface IMintCountdown {
    date: Date | undefined;
    style?: React.CSSProperties;
    status?: string;
    onComplete?: () => void;
}

const MintRenderer : FC<IMintRenderer> = ({days, hours, minutes, seconds}) => {
    hours += days * 24;

    return (
        <section className={styles.countdown}>
            <p>{hours}</p>
            <p>{minutes}</p>
            <p>{seconds}</p>
        </section>
    );
}

const MintCountdown : FC<IMintCountdown> = ({date, onComplete}) => {
    if (!date) return null;
    return (
        <Countdown
            date={date}
            renderer={MintRenderer}
            onComplete={onComplete}
        />
    );
}

export default MintCountdown;