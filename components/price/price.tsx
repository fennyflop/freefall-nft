import {FC, useContext} from 'react';
import styles from './price.module.css';

interface IPrice {
    price: number | undefined;
    discountPrice: number | undefined;
    isWhiteListed: boolean;
}

const Price : FC<IPrice> = ({price, discountPrice, isWhiteListed}) => {
    if (!price) return null;
    return (
        <div className={styles.container}>
            {
                isWhiteListed ? 
                discountPrice && discountPrice < price ?
                <><p className={styles.price}>{discountPrice} ◎</p><p className={styles.old + ' ' + styles.price}>{price} ◎</p></>
                :
                <p className={styles.price}>{price} ◎</p>
                :
                <p className={styles.price}>{price} ◎</p>
            }
        </div>
    );
}

export default Price;