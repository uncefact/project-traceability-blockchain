import React from 'react';
import {FaTimesCircle} from "react-icons/fa";
import styles from "./ErrorCard.module.scss";
import {Card} from "react-bootstrap";

type Props = {
    title: string,
    children?: any
}

export const ErrorCard = (props: Props) => {
    return (
        <div className={styles.CardContainer}>
            <Card className="text-center" border="light">
                <div className={styles.ErrorImage}>
                    <FaTimesCircle size="15rem" color="white" />
                </div>
                <Card.Body>
                    <Card.Title className={styles.Title}>{props.title}</Card.Title>
                    <Card.Text className={styles.Message}>
                        {props.children}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};
