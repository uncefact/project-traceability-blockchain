import React from "react";
import {Button, Modal as BModal} from "react-bootstrap";
import {useTranslation} from "react-i18next";

type Props = {
    show: boolean,
    // @ts-ignore
    handleClose: Function<any>,
    // @ts-ignore
    handleConfirm: Function<any>,
    title: string,
    children?: any,
    buttonText?: string,
}

export const Modal = (props: Props) => {
    const { t } = useTranslation();
    const text = props.buttonText || t("confirm");
    return (
        <BModal show={props.show} onHide={props.handleClose} centered size="lg">
            <BModal.Header closeButton>
                <BModal.Title>{props.title}</BModal.Title>
            </BModal.Header>
            <BModal.Body>{props.children}</BModal.Body>
            <BModal.Footer>
                <Button variant="primary" onClick={props.handleConfirm}>
                    {text}
                </Button>
            </BModal.Footer>
        </BModal>
    )
}
