import React from 'react';
import styles from './Burger.module.scss';

type Props = {
    open: boolean;
    setOpen: Function;
}

export const Burger = (props: Props) => {
    return (
        <button className={styles.Burger} onClick={() => props.setOpen(!props.open)}>
            <div className={`${props.open ? styles.transformOpen : styles.transformClose}`}/>
            <div className={`${props.open ? styles.transformOpen : styles.transformClose}`}/>
            <div className={`${props.open ? styles.transformOpen : styles.transformClose}`}/>
        </button>
    )
}