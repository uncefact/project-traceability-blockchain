import React, {ComponentType} from "react";
import {Form, InputGroup} from "react-bootstrap";
import styles from './InputSwitch.module.scss';
import {HiSwitchHorizontal} from "react-icons/hi";
import {log} from "util";
import {useTranslation} from "react-i18next";

type Props = {
    Option1: React.ReactNode
    option1Hint: string
    option1EmptyValue?: () => void
    Option2: React.ReactNode
    option2Hint: string
    option2EmptyValue?: () => void
    uploadLimit1?: string
    uploadLimit2?: string
}

export const InputSwitch = (props: Props) => {
    const { t } = useTranslation();
    const [isOption1, setIsOption1] = React.useState<boolean>(true);

    const toggle = () => {
        props.option1EmptyValue && props.option1EmptyValue();
        props.option2EmptyValue && props.option2EmptyValue();
        setIsOption1(e => !e);
    }

    if (isOption1)
        return (
            <>
                <InputGroup>
                    <InputGroup.Text className={styles.Switch} onClick={toggle}><HiSwitchHorizontal /></InputGroup.Text>
                    {props.Option1}
                </InputGroup>
                {props.uploadLimit1 &&
                    <Form.Text className="text-muted">
                        {props.uploadLimit1}
                    </Form.Text>
                }
                <Form.Text>
                    {props.option1Hint}
                </Form.Text>
            </>
        );

    return (
        <>
            <InputGroup>
                <InputGroup.Text className={styles.Switch} onClick={toggle}><HiSwitchHorizontal /></InputGroup.Text>
                {props.Option2}
            </InputGroup>
            {props.uploadLimit2 &&
                <Form.Text className="text-muted">
                    {props.uploadLimit2}
                </Form.Text>
            }
            <Form.Text>
                {props.option2Hint}
            </Form.Text>
        </>

    );
}