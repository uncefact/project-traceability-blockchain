import {Button} from "react-bootstrap";
import styles from "./SelectMenuButton.module.scss";
import React from "react";
// @ts-ignore
import {components} from "react-select";

type Props = {
    children: any,
    buttonText: string,
    onClick: () => void
}

export const SelectMenuButton = (props: Props) => {
    return (
        <components.MenuList  {...props}>
            {props.children}
            <Button className={styles.MenuButton} variant="primary" onClick={() => props.onClick()}>{props.buttonText}</Button>
        </components.MenuList >
    );
}