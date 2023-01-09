import React, {useEffect} from "react";
import {Button, Form, Jumbotron} from "react-bootstrap";
import styles from '../../../../../commons/transactions/trades/insert/TradeInsertion.module.scss';
import {useForm} from "react-hook-form";
import {
    ContractRequest,
    DocumentTypePresentable,
    ProcessingStandard,
    Unit
} from "@unece/cotton-fetch";
import TradeControllerApi from "../../../../../../../api/TradeControllerApi";
import DocumentControllerApi from "../../../../../../../api/DocumentControllerApi";
import {useHistory} from "react-router-dom";
import {isSameOrAfterOrNotSet} from "../../../../../../../utils/basicUtils";
import {GenericDropdownSelector} from "../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector";
import {GenericCard} from "../../../../../../GenericComponents/GenericCard/GenericCard";
// @ts-ignore
import Select from 'react-select';
import {RootState} from "../../../../../../../redux/store";
import {selectUserLoggedIn} from "../../../../../../../redux/store/stateSelectors";
import {addErrorMessage, addSuccessMessage} from "../../../../../../../redux/store/Messages/actions";
import {startLoading, stopLoading} from "../../../../../../../redux/store/Loading/actions";
import {connect, ConnectedProps} from "react-redux";
import {TradeInsertionChildProps} from "../TradeInsertion";
import {useTranslation} from "react-i18next";
import {SelectMenuButton} from "../../../../../../GenericComponents/SelectMenuButton/SelectMenuButton";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state),
    }
);

const mapDispatch = {
    addSuccessMessage,
    addErrorMessage,
    startLoading,
    stopLoading
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & TradeInsertionChildProps;

export const ContractTradeInsert = (props: Props) => {
    const history = useHistory();
    const { register, handleSubmit, errors, getValues } = useForm<ContractRequest>();
    const [documentTypeSelected, setDocumentTypeSelected] = React.useState<{value: DocumentTypePresentable | undefined, label: string}>();
    const [processingStandardSelected, setProcessingStandardSelected] = React.useState<{value: ProcessingStandard | undefined, label: string}>();
    const [documentTypes, setDocumentTypes] = React.useState<DocumentTypePresentable[]>([]);
    const [submitted, setSubmitted] = React.useState<boolean>(false);
    const { t } = useTranslation();

    const handleTransaction = async (transaction: ContractRequest) => {
        setSubmitted(true);
        if (props.companySelected && documentTypeSelected) {
            if (transaction.positions) {
                transaction.documentTypeCode = documentTypeSelected.value?.code;
                transaction.documentUpload = props.documentUploaded;
                transaction.processingStandardName = processingStandardSelected?.value?.name;
                transaction.consigneeCompanyName = props.companySelected.value?.companyName;
                transaction.consigneeEmail = props.consigneeEmailSelected.value;
                transaction.invitation = props.isInvitation;

                if (props.isMaterialMissing(props.positions))
                    return;
                for (let i = 0; i < transaction.positions.length; i++) {
                    transaction.positions[i].contractorMaterial = {
                        id: props.positions[i].material?.id,
                        name: props.positions[i].material?.name
                    };
                }
                try {
                    if (transaction.documentUpload.content) {
                        // const tx = await props.uneceCottonTracking.storeDocumentHash(utils.hashMessage(transaction.documentUpload.content))
                        // const confirmation_promise = tx.wait()
                        // confirmation_promise.then(()=>{
                        //     props.addSuccessMessage("Document hash stored on the blockchain");
                        // }).catch((err: any)=>{
                        //     props.addErrorMessage("Blockchain document notarization failed: " + err);
                        // });
                    }
                } catch (error) {
                    props.addErrorMessage(`${t("popups.errors.bc_document_auth")}: ${error}`);
                }
                try {
                    await TradeControllerApi.createContract({
                        contractRequest: transaction
                    });
                    props.addSuccessMessage(t("popups.success.contract_create"));
                    history.push("/");
                } catch (error) {
                    props.addErrorMessage(`${t("popups.errors.trade_insert")}: ${error}`);
                }
            }
        }

    };

    const getContractDocumentTypes = async () => {
        try {
            const resp = await DocumentControllerApi.getDocumentTypes({
                type: "contract"
            });
            setDocumentTypes(resp);
        }
        catch(error) {
            props.addErrorMessage(`${t("popups.errors.document_types")}: ${error}`);
        }
    }

    useEffect(() => {
        (async () => {
            await props.getCompanyTraders();
            await getContractDocumentTypes();
            await props.getAllUnits();
            await props.getTradeProcessingStandards();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Jumbotron className={styles.Container}>
            <h2>{`${t("transaction")}: ${t("contract")}`}</h2>
            <Form className={styles.Form} onSubmit={handleSubmit(handleTransaction)}>
                <Form.Group className={styles.BuyerNameArea}>
                    <Form.Label>{t("trade.consignee")}</Form.Label>
                    <Select
                        value={props.companySelected}
                        onChange={props.selectCompany}
                        options={props.companies.map(c => ({value: c, label: c.companyName}))}
                        components={{ MenuList: (p: any) => <SelectMenuButton buttonText={t("trade.invite_company")} onClick={() => props.setInvitationModalVisible(true)} {...p}/>}}
                    />
                    {
                        submitted && props.companySelected.value === undefined &&
                        <div className={styles.ErrorText}>{t("errors.trade.consignee_mandatory")}</div>
                    }
                </Form.Group>
                <div className={styles.BuyerInfoArea}>
                    <GenericCard
                        title={`${t("company_information")}:`}
                        elements={[
                            {name: t("name"), value: props.companySelected && props.companySelected.value?.companyName},
                            {name: t("address"), value: props.companySelected && props.companySelected.value?.address}
                        ]}/>
                </div>
                <Form.Group className={styles.UserEmailArea}>
                    <Form.Label>{t("user_email")}</Form.Label>
                    {/*<Form.Control name="consigneeEmail" onChange={e => props.getUserFromEmailAddress(e.target.value)} ref={register({required: true})}>*/}
                    {/*    {*/}
                    {/*        props.companyEmailAddresses.length > 0 && props.companyEmailAddresses.map((email: string, index: number) => {*/}
                    {/*            return <option key={index} value={email}>{email}</option>*/}
                    {/*        })*/}
                    {/*    }*/}
                    {/*    {props.companyEmailAddresses.length === 0 && <option>{t("no_company_emails")}</option>}*/}
                    {/*</Form.Control>*/}
                    <Select
                        value={props.consigneeEmailSelected}
                        onChange={(e: any) => props.getUserFromEmailAddress(e.value)}
                        options={props.companyEmailAddresses.map(email => ({value: email, label: email}))}
                    />
                </Form.Group>
                <div className={styles.UserInfoArea}>
                    <GenericCard
                        // icon={<GoPerson/>}
                        title={`${t("user_information")}:`}
                        elements={[
                            {name: t("user.name_surname"), value: props.userSelected && props.userSelected.firstName ? props.userSelected.firstName + " " + props.userSelected.lastName : ""},
                            {name: t("city"), value: props.userSelected && props.userSelected.city}
                        ]}/>
                </div>
                <Form.Group className={styles.DocumentTypeArea}>
                    <Form.Label>{t("trade.contract_type")}</Form.Label>
                    <Select
                        value={documentTypeSelected}
                        onChange={setDocumentTypeSelected}
                        options={documentTypes !== undefined ? documentTypes.map(d => ({value: d, label: d.code + " - " + d.name})) : []}
                    />
                    {
                        submitted && documentTypeSelected === undefined &&
                        <div className={styles.ErrorText}>{t("errors.trade.contract_type_mandatory")}</div>
                    }
                </Form.Group>
                <Form.Group className={styles.DocumentArea}>
                    <Form.Label>{t("attachment")}</Form.Label>
                    <Form.File
                        type="file"
                        name="documentUpload"
                        label={props.documentUploaded.name}
                        /*@ts-ignore*/
                        onChange={(e) => props.setDocument(e.target.files[0])}
                        custom
                        ref={register({required: true})}
                    />
                    <Form.Text className="text-muted">
                        {t("max_upload")}
                    </Form.Text>
                    {
                        errors.documentUpload &&
                        <div className={styles.ErrorText}>{t("errors.trade.attachment_mandatory")}</div>
                    }
                </Form.Group>

                <Form.Group className={styles.ValidFromArea}>
                    <Form.Label>{t("valid_from")}</Form.Label>
                    <Form.Control type="date" name="validFrom" ref={register({required: true, valueAsDate: true})} placeholder={t("placeholders.date")}/>
                    {
                        errors.validFrom &&
                        <div className={styles.ErrorText}>{t("errors.valid_from")}</div>
                    }
                </Form.Group>
                <Form.Group className={styles.ValidUntilArea}>
                    <Form.Label>{t("valid_until")}</Form.Label>
                    <Form.Control type="date" name="validUntil" placeholder={t("placeholders.date")} ref={register({required: true, valueAsDate: true, validate: value => isSameOrAfterOrNotSet(value, getValues("validFrom"))})} />
                    {
                        errors.validUntil &&
                        <div className={styles.ErrorText}>{t("errors.until_date_valid")}</div>
                    }
                </Form.Group>

                <Form.Group className={styles.ReferencedStandardArea}>
                    <Form.Label>{t("reference_standard")}</Form.Label>
                    <Select
                        value={processingStandardSelected}
                        onChange={setProcessingStandardSelected}
                        options={props.tradeProcessingStandards != undefined && props.tradeProcessingStandards.map(ps => ({value: ps, label: ps.name}))}
                        isClearable={true}
                    />
                </Form.Group>

                <Form.Group className={styles.UniqueTradeReference}>
                    <Form.Label>{t("trade.contract_id")}</Form.Label>
                    <Form.Control name="contractorReferenceNumber" ref={register({required: true})} type="text" placeholder={t("placeholders.trade.contract_id")} />
                    <Form.Text className="text-muted">
                        i.e. GC14LU3
                    </Form.Text>
                    {
                        errors.contractorReferenceNumber && errors.contractorReferenceNumber.type === "required" &&
                        <div className={styles.ErrorText}>{t("errors.trade.contract_id")}</div>
                    }
                </Form.Group>

                <Form.Group className={styles.NotesArea}>
                    <Form.Label>{t("notes")}</Form.Label>
                    <Form.Control name="notes" ref={register({required: false})} as="textarea" type="text" placeholder={t("placeholders.notes")}/>
                    <Form.Text className="text-muted">
                        {`${t("max_characters")}: 250`}
                    </Form.Text>
                    {
                        errors.notes && errors.notes.type === "required" &&
                        <div className={styles.ErrorText}>{t("errors.notes_mandatory")}</div>
                    }
                </Form.Group>

                <div className={styles.PositionsContainer}>
                    <div className={styles.PositionsTitleArea}>
                        <hr/>
                        <h2>{t("line_items")}
                            <Button onClick={props.addPosition} variant="secondary" className={styles.AddPosition}>+</Button>
                        </h2>
                    </div>
                    {
                        props.positions.map((value, index) => {
                            return <div key={index} className={styles.PositionsArea}>
                                <Form.Group className={styles.MaterialArea}>
                                    <Form.Label>{t("material")}</Form.Label>
                                    <GenericDropdownSelector
                                        getItems={() => props.getMaterialsByCompany(false,false, "")}
                                        itemPropToShow={"name"}
                                        selectItem={item => props.setMaterial(index, item)}
                                        defaultText={t("select_material")}
                                        newItemFields={["name"]}
                                        onCreate={async (item) => props.addMaterial(item, index, false)}
                                        creationTitle={t("material_name")}
                                        createDisabled={item => !item?.name}
                                        required={true}
                                    />
                                    {
                                        props.materialsError[index] &&
                                        <div className={styles.ErrorText}>{t("errors.select_material")}</div>
                                    }
                                </Form.Group>
                                <div className={styles.PositionInfoArea}>
                                    <Form.Group className={styles.QuantityArea}>
                                        <Form.Label>{t("positions.quantity")}</Form.Label>
                                        <Form.Control name={`positions[${index}].quantity`} ref={register({required: false})} type="number" min="0" step="0.01" placeholder={t("placeholders.positions.quantity")}/>
                                        {/*{*/}
                                        {/*    errors.quantity && errors.quantity.type === "required" &&*/}
                                        {/*    <div className={insertStyles.ErrorText}>Your must enter the quantity!</div>*/}
                                        {/*}*/}
                                    </Form.Group>
                                    <Form.Group className={styles.UnitArea}>
                                        <Form.Label>{t("positions.unit")}</Form.Label>
                                        <Form.Control as="select" name={`positions[${index}].unit.code`} ref={register({required: false})}>
                                            <option value="">{t("positions.select_unit")}</option>
                                            {
                                                props.allUnits.length > 0 && props.allUnits.map((unit: Unit, index: number) => {
                                                    return <option key={index} value={unit.code}>{unit.code + " - " + unit.name}</option>
                                                })
                                            }
                                            {props.allUnits.length === 0 && <option>{t("positions.no_units")}</option>}
                                        </Form.Control>

                                        {/*{*/}
                                        {/*    errors.unit && errors.unit.type === "required" &&*/}
                                        {/*    <div className={insertStyles.ErrorText}>Your must enter the unit!</div>*/}
                                        {/*}*/}
                                    </Form.Group>
                                    <Form.Group className={styles.SquareMetersArea}>
                                        <Form.Label>{t("positions.weight")}</Form.Label>
                                        <Form.Control name={`positions[${index}].weight`} ref={register({required: false})} type="number" min="0" step="0.01" placeholder={t("placeholders.positions.weight")} />
                                        {/*{*/}
                                        {/*    errors.quantity && errors.quantity.type === "required" &&*/}
                                        {/*    <div className={insertStyles.ErrorText}>Your must enter the quantity!</div>*/}
                                        {/*}*/}
                                    </Form.Group>

                                    <Form.Group className={styles.DescriptionArea}>
                                        <Form.Label>{t("positions.material_description")}</Form.Label>
                                        <Form.Control name={`positions[${index}].externalDescription`} ref={register({required: false})} as="textarea" type="text" placeholder={t("placeholders.positions.material_description")}/>
                                        <Form.Text className="text-muted">
                                            {`${t("max_characters")}: 250`}
                                        </Form.Text>
                                    </Form.Group>
                                    { index < props.positions.length - 1 && <hr/> }
                                </div>
                            </div>
                        })
                    }
                </div>

                <div className={styles.ConfirmArea}>
                    <Button variant="primary" type="submit">
                        {t("submit")}
                    </Button>
                </div>
            </Form>
        </Jumbotron>
    );


};

export default connector(ContractTradeInsert);
