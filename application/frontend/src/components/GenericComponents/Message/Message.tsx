import React, {useState} from "react";
import {Toast} from "react-bootstrap";
import {MESSAGE_TYPE_ERROR, MESSAGE_TYPE_SUCCESS, MsgType} from "../../../redux/store/types/MessageType";
import styles from "./Message.module.scss";
import {useTranslation} from "react-i18next";

type Props = {
    message: MsgType
}

export const Message = (props: Props) => {
    const { t } = useTranslation();
    const [showToast, setShowToast] = useState(true);
    const toggleShowToast = () => setShowToast(v => !v);

    const headerTypeClass = props.message.type === MESSAGE_TYPE_SUCCESS ? styles.Success : styles.Error;
    return (
        <Toast show={showToast} onClose={toggleShowToast} className={styles.Toast}>
            <Toast.Header className={`${styles.Header} ${headerTypeClass}`}>
                {/*<img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />*/}
                {props.message.type === MESSAGE_TYPE_SUCCESS && <strong className="mr-auto">{t("popups.info")}</strong>}
                {props.message.type === MESSAGE_TYPE_ERROR && <strong className="mr-auto">{t("popups.error")}</strong>}
                {/*<small>11 mins ago</small>*/}
            </Toast.Header>
            <Toast.Body>{props.message.text}</Toast.Body>
        </Toast>
    );
};