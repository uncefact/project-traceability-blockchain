import styles from "./DocumentHistoryElement.module.scss";
import moment from "moment";
import React, {useEffect} from "react";
import {downloadFile, getFileExtension} from "../../../../../utils/downloadFile";
import {request} from "../../../../../api/utilRequest";
import {backendUrl} from "../../../../../api/utils";
import {Viewer} from "@react-pdf-viewer/core";
import {Nav, Spinner} from "react-bootstrap";
import './style.css';
import {useTranslation} from "react-i18next";

type DocumentType = {
    type: string | undefined,
    referenceNumber: string | undefined,
    issueDate: Date | undefined,
    validUntilDate: Date | undefined,
    documentType: string | undefined,
    documentId: number | undefined,
    documentFileName: string | undefined,
}
type CertificateType = {
    validFrom: Date | undefined,
    validUntil: Date | undefined,
    documentType: string | undefined,
    assessmentType: string | undefined | null,
    documentId: number | undefined,
    documentFileName: string | undefined,
    processingStandardName: string | undefined
}
type Props = {
    title: string | undefined,
    document: DocumentType | null,
    certificate: CertificateType | null,
    companyNameFrom: string | null,
    companyNameTo: string | null | undefined
    processingStandardNames: Array<string> | undefined
};

export const DocumentsHistoryElement = (props: Props) => {
    const [tabSelected, setTabSelected] = React.useState<string>(props?.document ? 'document' : 'certificate');
    const [isPreviewVisible, setIsPreviewVisible] = React.useState(false);
    const { t } = useTranslation();

    const downloadDocument = async (documentId: number | undefined, documentFileName: string | undefined) => {
        if(documentId && documentFileName)
            await downloadFile("/documents/" + documentId, documentFileName, ()=>console.error('Error while downloading PDF'))
    }

    const previewDocument = () => {
        setIsPreviewVisible(true);
    }

    const onSelect = (eventKey: any) => {
        setIsPreviewVisible(false)
        setTabSelected(eventKey);
    }

    const documentInfo = <div className={styles.DocumentRowContent}>
        <div className={styles.LeftSide}>
            <div className={styles.InfoContainer}>
                <p><b>{`${t("issue_date")}: `}</b>{props?.document?.issueDate ? moment.utc(props?.document?.issueDate).format('MMMM Do YYYY') : '-'}</p>
                { props?.document?.type !== 'Shipping' && <p><b>{`${t("valid_until")}: `}</b>{props?.document?.validUntilDate ? moment.utc(props?.document?.validUntilDate).format('MMMM Do YYYY') : '-'}</p> }
                <p><b>{`${t("document_history.ref_number")}:`}</b> {props?.document?.referenceNumber || '-'}</p>
                <p><b>{`${t("document_history.from_company")}:`}</b> {props?.companyNameFrom || '-'}</p>
                <p><b>{`${t("document_history.to_company")}:`}</b> {props?.companyNameTo || '-'}</p>
                <p><b>{`${t("document_type")}:`}</b> {props?.document?.documentType}</p>
                <p><b>{`${t("document_history.ref_standards")}:`}</b> {props.processingStandardNames ? props.processingStandardNames?.join(", ") : '-'}</p>
            </div>
            {
                props?.document?.documentId &&
                <button className={styles.DownloadButton} style={{marginTop:"10px"}} onClick={() => downloadDocument(props?.document?.documentId, props?.document?.documentFileName)}>
                    {t("doc_download")}
                </button>
            }
        </div>
        <div className={styles.DocumentContainer}>
            {
                props?.document?.documentId
                    ?  isPreviewVisible && <DocumentPreview subject={props?.document}/>
                    : t("errors.doc_not_available")
            }
            {
                props?.document?.documentId && !isPreviewVisible &&
                <button className={styles.DownloadButton} style={{marginTop:"10px"}} onClick={previewDocument}>
                    {t("document_history.doc_preview")}
                </button>
            }
        </div>

    </div>;
    const certificateInfo = <div className={styles.DocumentRowContent}>
        <div className={styles.LeftSide}>
            <div className={styles.InfoContainer}>
                <p><b>{`${t("valid_from")}: `}</b>{props?.certificate?.validFrom ? moment(props?.certificate?.validFrom).format('MMMM Do YYYY') : '-'}</p>
                {props?.certificate?.validUntil && <p><b>{`${t("valid_until")}: `}</b>{moment(props?.certificate?.validUntil).format('MMMM Do YYYY')}</p> }
                {
                    props?.companyNameTo === undefined
                        ? <p><b>{`${t("company")}:`}</b> {props?.companyNameFrom || '-'}</p>
                        : <>
                            <p><b>{`${t("document_history.from_company")}:`}</b> {props?.companyNameFrom || '-'}</p>
                            <p><b>{`${t("document_history.to_company")}:`}</b> {props?.companyNameTo || '-'}</p>
                        </>
                }
                <p><b>{`${t("document_type")}:`}</b> {props?.certificate?.documentType}</p>
                {
                    props?.certificate?.assessmentType!==null && <p><b>{`${t("assessment_type")}:`}</b> {props?.certificate?.assessmentType || '-'}</p>
                }
                <p><b>{`${t("document_history.ref_standards")}:`}</b> {props.processingStandardNames?.length !== 0 ? props.processingStandardNames?.join(", ") : '-'} </p>
            </div>
            {
                props?.certificate?.documentId &&
                <button className={styles.DownloadButton} style={{marginTop:"10px"}} onClick={() => downloadDocument(props?.certificate?.documentId, props?.certificate?.documentFileName)}>
                    {t("doc_download")}
                </button>
            }
        </div>

        <div className={styles.DocumentContainer}>
            {
                props?.certificate?.documentId
                    ?  isPreviewVisible && <DocumentPreview subject={props?.certificate}/>
                    : t("errors.doc_not_available")
            }
            {
                props?.certificate?.documentId && !isPreviewVisible &&
                <button className={styles.DownloadButton} style={{marginTop:"10px"}} onClick={previewDocument}>
                    {t("document_history.doc_preview")}
                </button>
            }
        </div>
    </div>;
    return (
        <div className={styles.DocumentRow}>
            <h1>{props.title}</h1>
            {
                props.document !== null &&
                    <Nav justify variant="tabs" defaultActiveKey={props?.document ? 'document' : 'certificate'} className={styles.Nav}>
                        <Nav.Item key={'document'}>
                            <Nav.Link eventKey={'document'} onSelect={onSelect} disabled={!props?.document}>{t("document")}</Nav.Link>
                        </Nav.Item>
                        { props.certificate !== null &&
                            <Nav.Item key={'certificate'}>
                                <Nav.Link eventKey={'certificate'} onSelect={onSelect} disabled={!props?.certificate}>{t("certificate")}</Nav.Link>
                            </Nav.Item>
                        }
                    </Nav>
            }
            {
                tabSelected === 'document' ? documentInfo : certificateInfo
            }
        </div>
    );
}

type DocumentPreviewProps = {
    subject: DocumentType | CertificateType | null
}
const DocumentPreview = (props: DocumentPreviewProps) => {
    const [documentUrl, setDocumentUrl] = React.useState<string | undefined>();
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation();

    const getDocumentBlobString = async (subject: DocumentType | CertificateType | null) => {
        const response = await request({
            url: backendUrl + "/documents/" + subject?.documentId,
            method: 'GET',
            responseType: 'blob'
        }, 'application/pdf');
        return window.URL.createObjectURL(response);
    }
    const loadData = async () => {
        setIsLoading(true);
        const d = await getDocumentBlobString(props?.subject)
        d && setDocumentUrl((d));
        setIsLoading(false);
    }
    useEffect(() => {
        loadData();
    }, []);
    const fileExtension = getFileExtension(props?.subject?.documentFileName || '')

    if(isLoading)
        return <Spinner animation="border" variant="primary" />

    if(documentUrl && fileExtension === "pdf"){
        return <div className={styles.Document}><Viewer fileUrl={documentUrl} /></div>
    } else if(['jpg', 'png', 'img'].includes(fileExtension)){
        return <img alt='documentPreview' src={documentUrl} className={styles.Image}/>
    }
    return <p>{t("preview_not_supported")}</p>
}