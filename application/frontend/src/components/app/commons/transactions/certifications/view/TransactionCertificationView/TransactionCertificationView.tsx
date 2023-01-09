import React, {useEffect} from "react";
import {Form, Jumbotron, ListGroup} from "react-bootstrap";
import styles from "../CertificationViewer.module.scss";
import {FaDownload} from "react-icons/fa";
import {downloadFile} from "../../../../../../../utils/downloadFile";
// @ts-ignore
// Core viewer
import {Viewer} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {MdWarning} from "react-icons/md";
import {GoVerified} from "react-icons/go";
import {addErrorMessage, addSuccessMessage} from "../../../../../../../redux/store/Messages/actions";
import {connect, ConnectedProps} from "react-redux";
import {CertificationViewerChildProps} from "../CertificationViewer";
import {useTranslation} from "react-i18next";

const mapDispatch = {
    addSuccessMessage,
    addErrorMessage
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & CertificationViewerChildProps & {
};

export const TransactionCertificationView = (props: Props) => {
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            await props.blockchainVerification();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Jumbotron className={styles.Container}>
            <h2>{t("certification.transaction_title")}</h2>
            <Form className={styles.Form}>
                <Form.Group className={styles.ContractorNameArea}>
                    <Form.Label>{t("certification.verifier")}</Form.Label>
                    <Form.Control type="text" value={props.certification?.contractorName} disabled/>
                </Form.Group>
                <Form.Group className={styles.ContractorEmailArea}>
                    <Form.Label>{t("certification.verifier_email")}</Form.Label>
                    <Form.Control type="text" value={props.certification?.contractorEmail} disabled/>
                </Form.Group>
                <div className={styles.ConsigneeArea}>
                    <Form.Group>
                        <Form.Label>{t("company")}</Form.Label>
                        <Form.Control type="text" value={props.certification?.consigneeName} disabled/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{t("certification.company_email")}</Form.Label>
                        <Form.Control type="text" value={props.certification?.consigneeEmail} disabled/>
                    </Form.Group>
                </div>
                <Form.Group className={styles.DocumentArea}>
                    <Form.Label>{t("document_type")}</Form.Label>
                    <Form.Control type="text" value={props.certification?.documentType} disabled/>
                </Form.Group>
                <Form.Group className={styles.CertificationProcessingStandardArea}>
                    <Form.Label>{t("reference_standard")}</Form.Label>
                    <Form.Control type="text" value={props.certification?.processingStandardName} placeholder={t("placeholders.no_reference_standard")} disabled/>
                </Form.Group>
                <Form.Group className={styles.DocumentPreviewArea}>
                    {props.certification?.document != null ?
                        <>
                            <div className={styles.Preview}>
                                {props.documentBlockchainVerified ?
                                    <p>
                                        <GoVerified size={24}/> {t("blockchain_verified")}
                                    </p>
                                    :
                                    <p>
                                        <MdWarning size={24}/> {t("document_counterfeited")}
                                    </p>
                                }
                                {props.certification.document.contentType?.includes("pdf") ?
                                    <Viewer
                                        fileUrl={"data:application/pdf;base64," + props.certification.document?.content}
                                    />
                                    :
                                    props.certification.document.contentType?.includes("image") ?
                                        <img
                                            src={"data:" + props.certification.document.contentType + ";base64, " + props.certification.document.content}/>
                                        :
                                        <p className={`${styles.ErrorText} ${styles.Preview} text-center`}>{t("preview_not_supported")}</p>
                                }

                            </div>
                            <p className={styles.DownloadText}>{t("doc_download")}</p>
                            {/*@ts-ignore*/}
                            <FaDownload className={styles.Download} onClick={() => downloadFile("/documents/" + props.certification?.document.id, props.certification?.document.fileName, props.addErrorMessage.bind(this, t("popups.errors.document_download")))} size={28}/>

                        </>
                        :
                        props.certification?.certificatePageUrl != null ?
                            <div className={styles.Preview}>
                                <iframe src={props.certification.certificatePageUrl} width="100%" height="700px" title={t("certification.page")}/>
                            </div>
                            :
                            <p className={`${styles.ErrorText} ${styles.Preview} text-center`}>{t("errors.certification.document_loading")}</p>
                    }
                </Form.Group>

                <Form.Group className={styles.NotesArea}>
                    <Form.Label>{t("notes")}</Form.Label>
                    <Form.Control as="textarea" rows={20} placeholder={t("placeholders.no_notes")} value={props.certification?.notes} disabled/>
                </Form.Group>

                <Form.Group className={styles.AssessmentTypeArea}>
                    <Form.Label>{t("assessment_type")}</Form.Label>
                    <Form.Control type="text" value={props.certification?.assessmentType} placeholder={t("placeholders.no_assessment_types")} disabled/>
                </Form.Group>

                <Form.Group className={styles.ShippingRefNumberArea}>
                    <Form.Label>{t("certification.shipments_ref")}</Form.Label>
                    <ListGroup variant="flush">
                        {
                            // @ts-ignore
                            props.certification?.shippingReferenceNumbers?.length > 0 && props.certification.shippingReferenceNumbers.map((c: string, index: number) => {
                                return <ListGroup.Item className={styles.List} disabled key={index}>{c}</ListGroup.Item>
                            })
                        }
                        {props.certification?.shippingReferenceNumbers?.length === 0 &&
                        <ListGroup.Item className={styles.List} disabled>{t("certification.no_shipments_ref")}</ListGroup.Item>}
                    </ListGroup>
                </Form.Group>

                <Form.Group className={styles.ValidFromArea}>
                    <Form.Label>{t("issue_date")}</Form.Label>
                    <Form.Control type="text" value={props.certification?.validFrom?.toLocaleDateString()} disabled/>
                </Form.Group>

                <Form.Group className={styles.ConsigneeRefNumberArea}>
                    <Form.Label>{t("certification.report_id")}</Form.Label>
                    <Form.Control name="certificateReferenceNumber" type="text" placeholder={t("placeholders.not_specified")} value={props.certification?.certificateReferenceNumber} disabled/>
                </Form.Group>
            </Form>
        </Jumbotron>
    );

};

export default connector(TransactionCertificationView);
