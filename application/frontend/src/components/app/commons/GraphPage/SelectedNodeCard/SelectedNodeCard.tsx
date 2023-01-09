import React from "react";
import styles from "./SelectedNodeCard.module.scss";
import {AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineInfoCircle} from "react-icons/ai";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import Certificate from "../../../../../models/Certificate";
import {GoPrimitiveDot} from "react-icons/go";
import {SustainabilityCriterionPresentable} from "@unece/cotton-fetch";
import {downloadFile} from "../../../../../utils/downloadFile";
import {useMediaQuery} from "react-responsive";
import Transformation from "../../../../../models/Transformation";
import {useTranslation} from "react-i18next";

export type FacilityInfo = {
    name: string | null,
    location: string | null,
    country: string | null,
    region: string | null,
    certificates: string[] | null,
    partnerTyp: string | null
}
export type SelectedNode = {
    materialName: string | null,
    materialCategory: string | null,
    facilityInfo: FacilityInfo | null,
    processName: string | null,
    processTypes: string[] | null,
    processingStandards: string[] | null,
    certificates: Certificate[] | null,
    transformationId: number | null
}
export type SelectedEdgeTrade = {
    tradeName: string | null,
    tradeRefNumber: string | null,
    date: string | null,
    processingStandards: string[] | null,
    tradeCertificates: Certificate[] | null,
}
export type SelectedEdge = {
    fromFacilityInfo: FacilityInfo | null,
    toFacilityInfo: FacilityInfo | null,
    trades: SelectedEdgeTrade[]
}
type Props = {
    selectedNode: SelectedNode | null,
    selectedEdge: SelectedEdge | null,
    selectedSustainabilityCriterion: SustainabilityCriterionPresentable | undefined;
    onClose: () => void,
    transformations: Transformation[]
};

export const SelectedNodeCard = (props: Props) => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const { t } = useTranslation();

    const [expanded, setExpanded] = React.useState(!isTabletOrMobile);
    const toggleExpand = () => setExpanded(e => !e);

    const isNodeSelected = props.selectedNode !== null;
    const isEdgeSelected = props.selectedEdge !== null;

    React.useEffect(() => {
        if(props.selectedNode || props.selectedEdge)
            setExpanded(true);
    }, [props.selectedNode, props.selectedEdge])

    const contractor = isNodeSelected ? props.selectedNode?.facilityInfo : props.selectedEdge?.fromFacilityInfo;
    const contractorInfo = <div className={styles.Topic}>
        <h1>
            {t("company")}
        </h1>
        <div className={styles.InfoRow}>
            <div className={styles.InfoLeftContainer}>{`${t("name")}:`}</div>
            <div className={styles.InfoRightContainer}>{contractor?.name || '-'}</div>
        </div>
        <div className={styles.InfoRow}>
            <div className={styles.InfoLeftContainer}>{`${t("address")}:`}</div>
            <div className={styles.InfoRightContainer}>{contractor?.location || '-'}</div>
        </div>
        <div className={styles.InfoRow}>
            <div className={styles.InfoLeftContainer}>{`${t("region")}:`}</div>
            <div className={styles.InfoRightContainer}>{contractor?.region || '-'}</div>
        </div>
        <div className={styles.InfoRow}>
            <div className={styles.InfoLeftContainer}>{`${t("state")}:`}</div>
            <div className={styles.InfoRightContainer}>{contractor?.country || '-'}</div>
        </div>
        <div className={styles.InfoRow}>
            <div className={styles.InfoLeftContainer}>{`${t("role")}:`}</div>
            <div className={styles.InfoRightContainer}>{contractor?.partnerTyp || '-'}</div>
        </div>
    </div>;
    const processInfo = <div className={styles.Topic}>
        <h1>
            {t("process")}
        </h1>
        <div className={styles.InfoRow}>
            <div className={styles.InfoLeftContainer}>{`${t("name")}:`}</div>
            <div className={styles.InfoRightContainer}>{props.selectedNode?.processName || '-'}</div>
        </div>
        <div className={styles.InfoRow}>
            <div className={styles.InfoLeftContainer}>{`${t("type")}:`}</div>
            <div className={styles.InfoRightContainer}>{(props.selectedNode?.processTypes || []).join(', ') || '-'}</div>
        </div>
        <div className={styles.InfoRow}>
            <div className={styles.InfoLeftContainer}>{`${t("material_name")}: `}</div>
            <div className={styles.InfoRightContainer}>{props.selectedNode?.materialName || '-'}</div>
        </div>
        {/*<div className={styles.InfoRow}>*/}
        {/*    <div className={styles.InfoLeftContainer}>Material Category:</div>*/}
        {/*    <div className={styles.InfoRightContainer}>{props.selectedNode?.materialCategory || '-'}</div>*/}
        {/*</div>*/}
    </div>;

    const certificateInteraction = async (certificate: Certificate | undefined) => {
        if (certificate)
            if (certificate.certificatePageURL)
                window.open(certificate.certificatePageURL, "_blank");
            else if (certificate.documentId && certificate.documentFileName)
                await downloadFile("/documents/" + certificate.documentId, certificate?.documentFileName, ()=>console.error('Error while downloading certificate PDF'))
    }

    const certificateList = props.selectedNode?.processingStandards
        ?.filter(p => (props.selectedSustainabilityCriterion?.processingStandardNames || []).includes(p))
        // ?.flatMap(p => props.selectedNode?.certificates?.filter(c => c?.processStandardName === p))
        ?.flatMap((p, id) =>{

        let certificates = [];
        certificates = props.selectedNode?.certificates?.filter(c => {
            return c.processStandardName === p &&
                (
                    c.processTypes && c.processTypes.length > 0
                        ? c.processTypes.some(x => props.selectedNode?.processTypes?.includes(x))
                        : true
                )
            }
        ) || [];
        let rows = [];
        rows = certificates.map(c => {
            const nonValidMaterialCertificate = c?.subject === 'MATERIAL' &&
                props.transformations
                    .filter(t => t.id!==props.selectedNode?.transformationId)
                    .flatMap(t => t.certificates)
                    .filter(otherCert => otherCert.subject === 'SELF' && otherCert.status === 'ACCEPTED' && otherCert.id === c.id)
                    .length === 0;
            return (
                <OverlayTrigger 
                    placement={'left'}
                    overlay={c?.documentId || c?.certificatePageURL ?
                        <Tooltip id='tooltip' className={styles.Tooltip}>{c?.certificatePageURL ? t("node_card.certificate_website") : t("node_card.certificate_download")}</Tooltip> : <div/>}>
                    <div className={`${styles.CertificateRow} ${c?.documentId || c?.certificatePageURL && styles.CertificateRowClickable}`} key={id} onClick={async () => await certificateInteraction(c)}>
                        <div className={styles.IconLinkContainer}>
                            <GoPrimitiveDot className={nonValidMaterialCertificate || c.status === 'REFUSED' ? styles.CertNonOk : c.status === 'PENDING' ? styles.CertPending : styles.CertOk}/>
                        </div>
                        <div className={styles.CertContainer}>
                            <div className={styles.CertificationInfoContainer}>
                                <div><b>{`${t("node_card.certificate_id")}: `}</b>{c.id}</div>
                                <div><b>{`${t("certifier")}: `}</b>{c.certifierCompanyName}</div>
                                <div><b>{`${t("node_card.proc_standard")}: `}</b>{c.processStandardName}</div>
                                <div><b>{`${t("issue_date")}: `}</b>{c.validFrom}</div>
                                <div><b>{`${t("valid_until")}: `}  </b>{c.validUntil}</div>
                                <div><b>{`${t("node_card.certificate_type")}: `}</b>{c.certificateTypeName}</div>
                                <div><b>{`${t("node_card.assessment_level")}: `}</b>{c.assessmentLevelName}</div>
                                <div className={c.status === 'PENDING' ? styles.CertPending : undefined}><b>{`${t("status")}: `}</b>{c.status}</div>
                            </div>

                            <div className={styles.CertificationIconContainer}>
                                <a href={c.processingStandardSiteUrl} target={"_blank"}>
                                    <img src={c.processingStandardLogoPath} />
                                </a>
                            </div>
                        </div>
                    </div>
                </OverlayTrigger>
            );
        }) || [];
        rows.length === 0 && rows.push(
                <div className={`${styles.CertificateRow}`} key={id} >
                    <div className={styles.IconLinkContainer}>
                        <GoPrimitiveDot className={styles.CertNonOk}/>
                    </div>
                    <div className={styles.CertContainer}>
                        <div className={styles.CertificationInfoContainer}>
                            <div><b>{`${t("node_card.proc_standard")}: `}</b>{p}</div>
                            <div><b>{t("errors.cert_not_available")}</b></div>
                        </div>
                    </div>
                </div>
        )
        return rows;
    })

    const certificates = <div className={styles.Topic}>
        <h1>
            {t("reference_standard")}
        </h1>
        <div className={styles.CertificateListContainer}>
            {certificateList && certificateList?.length > 0
                ? certificateList
                : t("no_certificates")}
        </div>
    </div>;

    const transactionList = (props.selectedEdge?.trades || []).map((trade, id) => {
        const certificateList = (trade?.processingStandards || []).map((p, id) => {
            const certificate = trade.tradeCertificates?.find(c => c.processStandardName === p);
            return (
                <OverlayTrigger
                    placement={'left'}
                    overlay={certificate?.documentId || certificate?.certificatePageURL ?
                        <Tooltip id='tooltip' className={styles.Tooltip}>{certificate?.certificatePageURL ? t("node_card.certificate_website") : t("node_card.certificate_download")}</Tooltip> : <div/>}>
                <div className={`${styles.CertificateRow} ${certificate?.documentId || certificate?.certificatePageURL && styles.CertificateRowClickable}`} key={id} onClick={async () => await certificateInteraction(certificate)}>
                    {
                        certificate
                            ?
                            <>
                                <div className={styles.IconLinkContainer}>
                                    <GoPrimitiveDot className={certificate.status === 'PENDING' ? styles.CertPending : styles.CertOk}/>
                                </div>
                                <div className={styles.CertContainer}>
                                    <div className={styles.CertificationInfoContainer}>
                                        <div><b>{`${t("node_card.certificate_id")}: `}</b>{certificate.id}</div>
                                        <div><b>{`${t("node_card.proc_standard")}: `}</b>{certificate.processStandardName}</div>
                                        <div><b>{`${t("issue_date")}: `}</b>{certificate.validFrom}</div>
                                        <div><b>{`${t("node_card.certificate_type")}: `}</b>{certificate.certificateTypeName}</div>
                                        <div className={certificate.status === 'PENDING' ? styles.CertPending : undefined}><b>{`${t("status")}: `}</b>{certificate.status}</div>
                                    </div>

                                    <div className={styles.CertificationIconContainer}>
                                        <a href={certificate.processingStandardSiteUrl} target={"_blank"}>
                                            <img src={certificate.processingStandardLogoPath} />
                                        </a>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className={styles.IconLinkContainer}>
                                    <GoPrimitiveDot className={styles.CertNonOk}/>
                                </div>
                                <div className={styles.MainLinkContainer}>
                                    {p}
                                </div>
                            </>
                    }
                </div>
                </OverlayTrigger>
            );
        });

        return (
            <div key={id}>
                <div className={styles.InfoRow}>
                    <div className={styles.InfoLeftContainer}>{`${t("type")}: `}</div>
                    <div className={styles.InfoRightContainer}>{trade.tradeName || '-'}</div>
                </div>
                <div className={styles.InfoRow}>
                    <div className={styles.InfoLeftContainer}>{`${t("reference_number")}: `}</div>
                    <div className={styles.InfoRightContainer}>{trade.tradeRefNumber || '-'}</div>
                </div>
                <div className={styles.InfoRow}>
                    <div className={styles.InfoLeftContainer}>{`${t("date")}: `}</div>
                    <div className={styles.InfoRightContainer}>{trade.date || '-'}</div>
                </div>
                <div className={styles.InfoRow}>
                    <div className={styles.InfoLeftContainer}>{`${t("reference_standard")}:`}</div>
                </div>
                <div className={styles.CertificateListContainer}>
                    {certificateList.length > 0
                        ? certificateList
                        : t("no_certificates")
                    }
                </div>
                <div className={styles.Divider}/>
            </div>
        )

    });
    const transactions = <div className={styles.Topic}>
        <h1>
            {t("transactions")}
        </h1>
        <div className={styles.TradeListContainer}>
            {transactionList.length > 0
                ? transactionList
                : t("transactions_not_available")}
        </div>
    </div>;

    if(isTabletOrMobile) {
        if(!isNodeSelected && !isEdgeSelected) {
            return null;
        }
        if(!expanded) {
            return <div className={styles.InfoButton} onClick={toggleExpand}>
                <AiOutlineInfoCircle />
            </div>
        }
    }
    if(!isNodeSelected && !isEdgeSelected) {//Nothing selected
        return (
            <div className={`${styles.Card} ${styles.CardCompressed}`}>
                <OverlayTrigger placement={'left'} overlay={<Tooltip id='tooltip' className={styles.Tooltip}>{t("node_card.tip")}</Tooltip>}>
                    <span className={styles.InfoContainer}>
                        <AiOutlineInfoCircle />
                    </span>
                </OverlayTrigger>
            </div>
        )
    }
    if(!expanded){
        return (
            <div className={`${styles.Card} ${styles.CardCompressed}`}>
                <OverlayTrigger placement={'left'} overlay={<Tooltip id='tooltip' className={styles.Tooltip}>{isNodeSelected ? t("node_card.material_info") : t("node_card.trade_info")}</Tooltip>}>
                        <span className={styles.InfoContainer}>
                            <AiOutlineInfoCircle />
                        </span>
                </OverlayTrigger>
                <OverlayTrigger placement={'left'} overlay={<Tooltip id='tooltip' className={styles.Tooltip}>{t("expand")}</Tooltip>}>
                    <span className={styles.ResizeContainer} onClick={toggleExpand}>
                        <AiOutlineDoubleLeft />
                    </span>
                </OverlayTrigger>
            </div>
        )
    }

    return (
        <div className={`${styles.Card} ${styles.CardExpanded}`}>
            <div className={styles.CardContent}>
                {contractorInfo}
                {isNodeSelected && processInfo}
                {isNodeSelected && certificates}
                {isEdgeSelected && transactions}
            </div>
            <OverlayTrigger placement={'left'} overlay={<Tooltip id='tooltip' className={styles.Tooltip}>{t("collapse")}</Tooltip>}>
                <span className={styles.ResizeContainer} onClick={toggleExpand}>
                    <AiOutlineDoubleRight />
                </span>
            </OverlayTrigger>
        </div>
    )
}