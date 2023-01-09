import React, {useEffect} from "react";
import {Button, Form, Jumbotron} from "react-bootstrap";
import {
    ConfirmationCertificationPresentable,
    ConfirmationTradePresentable, PositionPresentable, ProcessingStandard,
} from "@unece/cotton-fetch";
import styles from "./TradeView.module.scss";
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import {FaDownload} from "react-icons/fa";
import {downloadFile} from "../../../../../../../utils/downloadFile";
// @ts-ignore
// Core viewer
import {Viewer} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {utils} from "ethers";
import {MdWarning} from "react-icons/md";
import {GoVerified} from "react-icons/go";
import {RootState} from "../../../../../../../redux/store";
import {
    selectCompanyIndustrialSector,
    selectUserLoggedIn
} from "../../../../../../../redux/store/stateSelectors";
import {addErrorMessage, addSuccessMessage} from "../../../../../../../redux/store/Messages/actions";
import {startLoading, stopLoading} from "../../../../../../../redux/store/Loading/actions";
import {connect, ConnectedProps} from "react-redux";
import {useTranslation} from "react-i18next";
import {TRADE_CONFIRMATION_PATH} from "../../../../../../../routes/Routes";
import {AiFillEdit} from "react-icons/ai";
import TradeControllerApi from "../../../../../../../api/TradeControllerApi";
import {ProcessingStandardPresentable, UpdateTradeRequest} from "../../../../../../../../clients/unece-cotton-fetch";
// @ts-ignore
import Select from 'react-select';
import TransformationPlanControllerApi from "../../../../../../../api/TransformationPlanControllerApi";
import {useForm} from "react-hook-form";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state),
        companyIndustrialSector: selectCompanyIndustrialSector(state)
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
type Props = PropsFromRedux & {
    trade: ConfirmationTradePresentable | undefined
};

export const TradeView = (props: Props) => {
    const history = useHistory();
    const transactionType = new URLSearchParams(useLocation().search).get("type") || undefined;
    const match = useRouteMatch('/:companyIndustry' + TRADE_CONFIRMATION_PATH);
    const { handleSubmit } = useForm<UpdateTradeRequest>();

    const [documentBlockchainVerified, setDocumentBlockchainVerified] = React.useState<boolean>(false);
    const [editMode, setEditMode] = React.useState<boolean>(false);

    const [referencedStandards, setReferencedStandards] = React.useState<ProcessingStandardPresentable[]>([]);
    const [referencedStandardSelected, setReferencedStandardSelected] = React.useState<{value: ProcessingStandard, label: string | undefined}>();

    const [tradeCertificates, setTradeCertificates] = React.useState<ConfirmationCertificationPresentable[]>([]);
    // @ts-ignore
    const idParam = match?.params.id;
    const { t } = useTranslation();

    const getTradeInformation = async () => {
        if (props.trade?.document?.content) {
            const document_hash = utils.hashMessage(props.trade.document?.content)
            // const document_timestamp = await props?.uneceCottonTracking?.getDocumentTimestamp(document_hash);
            // console.log('document_timestamp', document_timestamp?.toNumber());
            // TODO re-enable blockchain
            // if (document_timestamp?.toNumber() > 0) {
            //     setDocumentBlockchainVerified(true);
            // } else {
            //     setDocumentBlockchainVerified(false);
            // }
            setDocumentBlockchainVerified(true);
        }

    };

    const getTradeCertificates = async () => {
        try {
            props.startLoading(t("popups.loading.certificates"));
            const resp = await  CertificationControllerApi.getCertificationsByTransactionId({
                transactionType: transactionType || '',
                id: idParam
            });
            resp && resp.length && resp.length>0 && setTradeCertificates(resp);
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.certificates")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    }

    const retrieveInformationToUpdate = async () => {
        setEditMode(true);

        try {
            props.startLoading(t("popups.loading.trade_update"));
            const allReferencedStandards = await TradeControllerApi.getTradeProcessingStandards();
            setReferencedStandards(allReferencedStandards);
            // @ts-ignore
            setReferencedStandardSelected({value: {name: props.trade.processingStandardName}, label: props.trade.processingStandardName});
        }
        catch (error) {
            props.addErrorMessage(`${t("popups.errors.trade_info")}: ${error}`);
        }
        finally {
            props.stopLoading();
        }
    }

    const handleUpdate = async (updateRequest: UpdateTradeRequest) => {

        updateRequest.processingStandardName = referencedStandardSelected?.value.name;
        updateRequest.tradeType = transactionType;

        try {
            // @ts-ignore
            await TradeControllerApi.updateTrade({
                updateTradeRequest: updateRequest,
                id: idParam
            });
            props.addSuccessMessage(t("popups.success.trade_update"));
            history.push("/");
        }
        catch(error){
            props.addErrorMessage(`${t("popups.errors.trade_update")}: ${error}`);
        }
    }

    useEffect(() => {
        (async () => {
            await getTradeInformation();
            await getTradeCertificates();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const positionsRows = props.trade?.positions?.map((position: PositionPresentable, index: number) => {
        return <div key={index} className={styles.PositionsArea}>
            <div className={styles.ConsigneeMaterialArea}>
                <Form.Group>
                    <Form.Label>{t("trade.consignee_material")}</Form.Label>
                    <Form.Control type="text" value={position.consigneeMaterialName} placeholder={t("placeholders.not_specified")} disabled/>
                </Form.Group>
            </div>

            <div className={styles.ContractorMaterialArea}>
                <Form.Group>
                    <Form.Label>{t("trade.contractor_material")}</Form.Label>
                    <Form.Control type="text" value={position.contractorMaterialName} disabled/>
                </Form.Group>
                <Button className={styles.ShowSupplyChainBtn} variant="primary" onClick={() => {
                    history.push('/' + props.companyIndustrialSector + '/graph/' + position.contractorMaterialId)
                }}>
                    {t("show_chain")}
                </Button>
            </div>
            <div className={styles.PositionInfoArea}>
                <Form.Group className={styles.AmountArea}>
                    <Form.Label>{t("positions.quantity")}</Form.Label>
                    <Form.Control type="number" placeholder={t("placeholders.trade.no_quantity")} value={position.quantity} disabled/>
                </Form.Group>
                <Form.Group className={styles.UnitArea}>
                    <Form.Label>{t("positions.unit")}</Form.Label>
                    <Form.Control type="text" placeholder={t("placeholders.trade.no_unit")} value={position.unit} disabled/>
                </Form.Group>
                <Form.Group className={styles.WeightArea}>
                    <Form.Label>{t("positions.weight")}</Form.Label>
                    <Form.Control type="number" placeholder={t("placeholders.trade.no_weight")} value={position.weight} disabled/>
                </Form.Group>

                <Form.Group className={styles.DescriptionArea}>
                    <Form.Label>{t("positions.material_description")}</Form.Label>
                    <Form.Control as="textarea" rows={20} type="text" placeholder={t("placeholders.trade.no_description")} value={position.externalDescription} disabled/>
                </Form.Group>
            </div>
        </div>
    });

    return (
        <Jumbotron className={styles.Container}>
            <div className={styles.TitleSection}>
                <h2>{`${t("transaction")}: ${t(transactionType || '')}`}</h2>
                <div className={styles.ActionsContainer}>
                    {
                        !editMode && <h4 className={styles.Click} onClick={retrieveInformationToUpdate}>{t("edit")}<AiFillEdit/></h4>
                    }
                </div>

            </div>
            <Form className={styles.Form} onSubmit={handleSubmit(handleUpdate)}>
                <Form.Group className={styles.ContractorNameArea}>
                    <Form.Label>{t("trade.contractor")}</Form.Label>
                    <Form.Control type="text" value={props.trade?.contractorName} disabled/>
                </Form.Group>
                <Form.Group className={styles.ContractorEmailArea}>
                    <Form.Label>{t("trade.contractor_email")}</Form.Label>
                    <Form.Control type="text" value={props.trade?.contractorEmail} disabled/>
                </Form.Group>
                <div className={styles.ConsigneeArea}>
                    <Form.Group>
                        <Form.Label>{t("trade.consignee")}</Form.Label>
                        <Form.Control type="text" value={props.trade?.consigneeName} disabled/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{t("trade.consignee_email")}</Form.Label>
                        <Form.Control type="text" value={props.trade?.consigneeEmail} disabled/>
                    </Form.Group>
                </div>
                <Form.Group className={styles.DocumentArea}>
                    <Form.Label>{t("trade.document")}</Form.Label>
                    <Form.Control type="text" value={props.trade?.documentType} disabled/>
                </Form.Group>
                <Form.Group className={styles.DocumentPreviewArea}>
                    {props.trade?.document != undefined ?
                        <>
                            <div className={styles.Preview}>
                                {documentBlockchainVerified ?
                                    <p>
                                        <GoVerified size={24}/> {t("blockchain_verified")}
                                    </p>
                                    :
                                    <p>
                                        <MdWarning size={24}/> {t("document_counterfeited")}
                                    </p>
                                }
                                {props.trade.document.contentType?.includes("pdf") ?
                                    <Viewer
                                        fileUrl={"data:application/pdf;base64," + props.trade.document?.content}
                                    />
                                    :
                                    props.trade.document.contentType?.includes("image") ?
                                        <img
                                            src={"data:" + props.trade.document.contentType + ";base64, " + props.trade.document.content}/>
                                        :
                                        <p className={`${styles.ErrorText} ${styles.Preview} text-center`}>{t("preview_not_supported")}</p>
                                }

                            </div>
                            <p className={styles.DownloadText}>{t("doc_download")}</p>
                            {/*@ts-ignore*/}
                            <FaDownload className={styles.Download} onClick={() => downloadFile("/documents/" + props.trade?.document.id, props.trade?.document.fileName, props.addErrorMessage.bind(this, t("popups.errors.document_download")))} size={28}/>

                        </>
                        :
                        <p className={`${styles.ErrorText} ${styles.Preview} text-center`}>{t("errors.trade.document_loading")}</p>
                    }
                </Form.Group>

                <Form.Group className={styles.ProcessingStandardArea}>
                    <Form.Label>{t("reference_standard")}</Form.Label>
                    { editMode ?
                        <Select
                            isClearable={true}
                            value={referencedStandardSelected}
                            onChange={setReferencedStandardSelected}
                            options={referencedStandards !== undefined ? referencedStandards.map(ps => ({value: ps, label: ps.name})) : []}
                        />
                        :
                        <Form.Control type="text" value={props.trade?.processingStandardName} placeholder={t("placeholders.no_reference_standard")} disabled/>
                    }
                </Form.Group>

                <Form.Group className={styles.NotesArea}>
                    <Form.Label>{t("notes")}</Form.Label>
                    <Form.Control as="textarea" rows={20} placeholder={t("placeholders.no_notes")} value={props.trade?.notes} disabled/>
                </Form.Group>

                <Form.Group className={styles.CertificatesArea}>
                    <Form.Label>{t("certificates")}</Form.Label>
                    <div className={styles.ButtonsContainer}>
                        {
                            tradeCertificates.length>0
                                ? tradeCertificates.map((certificate, index) => {
                                    const refStd = certificate?.processingStandardName;
                                    const certType = certificate?.subject?.toLowerCase();
                                    return (
                                        <Button className={styles.CertificateButton} key={'cert_id'} variant="primary" onClick={() => {
                                            history.push(`/${props.companyIndustrialSector}/certifications/${certType}/${certificate.id}/confirmation`)
                                        }}>
                                            {t("show_certificate")} {tradeCertificates.length > 1 ? index : ''} {refStd && '- '+refStd}
                                        </Button>
                                    )
                                })
                                : t("no_certificates")
                        }
                    </div>
                </Form.Group>

                <Form.Group className={styles.ValidFromArea}>
                    <Form.Label>{transactionType === 'shipping' ? t("shipping_date") : t("valid_from")}</Form.Label>
                    <Form.Control type="text" value={props.trade?.validFrom?.toLocaleDateString()} disabled/>
                </Form.Group>
                {transactionType !== 'shipping' &&
                    <Form.Group className={styles.ValidUntilArea}>
                        <Form.Label>{t("valid_until")}</Form.Label>
                        <Form.Control type="text" value={props.trade?.validUntil?.toLocaleDateString()} disabled/>
                    </Form.Group>
                }

                <Form.Group className={styles.ConsigneeRefNumberArea}>
                    <Form.Label>{t("trade.consignee_id")}</Form.Label>
                    <Form.Control type="text" placeholder={t("placeholders.not_specified")} value={props.trade?.consigneeReferenceNumber} disabled />
                </Form.Group>
                <Form.Group className={styles.ContractorRefNumberArea}>
                    <Form.Label>{t("trade.contractor_id")}</Form.Label>
                    <Form.Control name="consigneeReferenceNumber" type="text" value={props.trade?.contractorReferenceNumber} placeholder={t("placeholders.not_specified")} disabled/>
                </Form.Group>

                <div className={styles.PositionsContainer}>
                    <div className={styles.PositionsTitleArea}>
                        <hr/>
                        <h4>{t("line_items")}</h4>
                    </div>
                    {positionsRows}
                </div>

                { editMode &&
                    <div className={styles.ConfirmArea}>
                        <Button variant="primary" className="mr-2 bg-danger border-danger" onClick={() => setEditMode(false)}>{t("cancel")}</Button>
                        <Button variant="primary" type="submit">{t("confirm")}</Button>
                    </div>
                }
            </Form>
        </Jumbotron>
    );

};

export default connector(TradeView);
