import React from 'react';
import {Modal} from "../Modal/Modal";
import {FaCheckCircle} from "react-icons/fa";
import styles from "./SuccessModal.module.scss";

type Props = {
    title: string,
    show: boolean,
    // @ts-ignore
    handleClose: Function<any>,
    // @ts-ignore
    handleConfirm: Function<any>,
    children?: any,
    buttonText?: string
}

export const SuccessModal = (props: Props) => {
    return (
        <div className={styles.ModalContainer}>
            <Modal show={props.show} handleClose={props.handleClose} handleConfirm={props.handleConfirm} title={props.title} buttonText={props.buttonText}>
                <div className={styles.SuccessImage}>
                    <FaCheckCircle size="15rem" color="white" />
                </div>
                <div className={styles.Message}>
                    {props.children}
                </div>
            </Modal>
        </div>
    );
};
