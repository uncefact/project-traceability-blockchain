import React, {useEffect} from "react";
import {TransactionProcessesCustomMenu} from "../../app/commons/transactions/TransactionProcessesCustomMenu";
import {Button, Dropdown, Form, Spinner} from "react-bootstrap";
import styles from './GenericDropdownSelector.module.scss';
import {useTranslation} from "react-i18next";

type Props = {
    defaultText: string,
    getItems: () => any,
    itemPropToShow: string,
    selectItem: (item: any) => void,
    newItemFields: string[],
    onCreate: (item: any) => void,
    creationTitle: string,
    createDisabled: (item: any) => boolean,
    required: boolean,
    disabled?: boolean
}
export const GenericDropdownSelector = (props: Props) => {
    const { t } = useTranslation();
    const [items, setItems] = React.useState([]);
    const [itemSelected, setItemSelected] = React.useState<any>(null);
    const [textToShow, setTextToShow] = React.useState<string>('');
    const [insertElementMode, setInsertElementMode] = React.useState<boolean>(false);

    const [show, setShow] = React.useState(false);

    const [loading, setLoading] = React.useState(false);

    const [newItem, setNewItem] = React.useState<any>(null);

    useEffect(() => {
        retrieveItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const retrieveItems = async () => {
        try {
            setLoading(true);
            const i = await props.getItems();
            i && setItems(i);
            if (i !== undefined && i.length === 1 && props.required) {
                setItemSelected(i[0]);
                props.selectItem(i[0]);
                setTextToShow(i[0][props.itemPropToShow]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const toggleInsertElementMode = () => {
        setInsertElementMode(v => !v);
    }

    const handleItemClick = (itemClicked: any) => {
        setItemSelected(itemClicked);
        props.selectItem(itemClicked);
        setTextToShow(itemClicked[props.itemPropToShow]);
        setShow(false);
    }

    const handleCreateNewClick = () => {
        toggleInsertElementMode();
        setShow(false);
        setTimeout(() => {//Dropdown bug MockedMaterialControllerApi
            setShow(true);
        }, 1);
    }

    const handleOnToggle = (isOpen: any, event: any) => {
        if(isOpen || !event) { //if want to open or clicked outside
            isOpen && retrieveItems();
            setShow(isOpen);
        }
    }

    const handleCancel = () => {
        toggleInsertElementMode();
        setNewItem(null);
    }

    const handleCreate = async () => {
        try {
            await props.onCreate(newItem);
            setItemSelected(newItem);
            setTextToShow(newItem[props.itemPropToShow]);
        }
        catch (e){
            console.log(e);
        }
        setShow(false);
        handleCancel();
    }

    const addNewItemProp = (prop: string, value: any) => {
        setNewItem((n: any) => ({
            ...n,
            [prop]: value
        }));
    }

    const options = loading
        ? [
            <div key="spinner" className={styles.SpinnerContainer}>
                <Spinner animation="border" variant="primary" />
            </div>]
        : items.map((v, i) => <Dropdown.Item key={'option_'+i} onClick={() => handleItemClick(v)}>{v[props.itemPropToShow]}</Dropdown.Item>)


    const newItemFormControls = props.newItemFields.map((v, i) => <Form.Control  key={'fc_'+i} type="text" className="w-100 my-2" placeholder={v} onChange={(e) => addNewItemProp(v, e.target.value)}/>)
    const content =
        insertElementMode
        ? <Dropdown.Menu className={styles.DropdownMenu}>
            <h4 className="text-center">{ props.creationTitle }</h4>
            <div className={styles.InputContainer}>
                {newItemFormControls}
            </div>
            <div className={styles.ButtonContainer}>
                <Button className="w-auto" variant="danger" type="button" onClick={handleCancel}>{t("cancel")}</Button>
                <Button className="w-auto" variant="primary" type="button" onClick={handleCreate} disabled={props.createDisabled(newItem)}>{t("create")}</Button>
            </div>
        </Dropdown.Menu>
        : <Dropdown.Menu as={TransactionProcessesCustomMenu}>
            <div className={styles.ScrollableSection}>
                {options}
            </div>
            <div className={styles.FixedSection}>
                <Dropdown.Divider/>
                <div className={styles.CreateNewContainer} onClick={handleCreateNewClick}>
                    <Dropdown.Item>{t("create")}</Dropdown.Item>
                </div>
            </div>
        </Dropdown.Menu>
    return (
        <Dropdown show={show} onToggle={handleOnToggle} className={styles.Dropdown}>
            <Dropdown.Toggle id="dropdown-custom-components" disabled={props.disabled}>
                {itemSelected ? textToShow : props.defaultText}
            </Dropdown.Toggle>
            {
                content
            }
        </Dropdown>
    )
}
