import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import styles from './DocumentsHistoryPage.module.scss'
import SupplyChainInfoControllerApi from "../../../../api/SupplyChainInfoControllerApi";
import {
    SupplyChainInfoPresentable, SupplyChainTransformationPresentable
} from "@unece/cotton-fetch";
import {connect, ConnectedProps} from "react-redux";
import {startLoading, stopLoading} from "../../../../redux/store/Loading/actions";
import {AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFork} from 'react-icons/ai';
import {DocumentsHistoryElement} from "./DocumentHistoryElement/DocumentHistoryElement";
import {useTranslation} from "react-i18next";
import {RootState} from "../../../../redux/store";
import {selectCompanyIndustrialSector} from "../../../../redux/store/stateSelectors";
import {useQuery} from "../../../../utils/basicUtils";

const mapState = (state: RootState) => (
    {
        companyIndustrialSector: selectCompanyIndustrialSector(state)
    }
);

const mapDispatch = {
    startLoading,
    stopLoading
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {};
type OrderedComponent = {
    date: Date | undefined,
    component: JSX.Element
}
export const DocumentsHistoryPage = (props: Props) => {
    const history = useHistory();
    const match = useRouteMatch('/:companyIndustry/documentsHistory/:id');
    const query = useQuery();
    // @ts-ignore
    const idParam: number = Number(match?.params.id);
    const { t } = useTranslation();

    const [supplyChain, setSupplyChain] = useState<SupplyChainInfoPresentable>();
    const [isSortAscending, setIsSortAscending] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, [])

    const loadDocuments = async () => {
        try {
            props.startLoading(t("popups.loading.document_history"));
            const resp = await SupplyChainInfoControllerApi.getSupplyChain({
                materialId: idParam,
            });
            setSupplyChain(resp);
        } catch (error) {
            console.error(error)
        } finally {
            props.stopLoading();
        }
    }


    const tradesDocumentsList: OrderedComponent[] = (supplyChain?.trades || [])
        .slice()// @ts-ignore
        .map((trade, id) => {
            const materialOutId = Number(Object.keys(trade?.consigneeToContractorMaterialMap || {})[0]) || null;
            const materialInId = trade?.consigneeToContractorMaterialMap?.[materialOutId || 0] || null;

            const transformationFrom = supplyChain?.transformations?.find((t: any) => t.outputMaterialIds.includes(materialInId)) || null;
            const transformationTo = supplyChain?.transformations?.find((t: any) => t.inputMaterialIds.includes(materialOutId)) || null;

            const facilityFrom = supplyChain?.companiesInfo?.filter((c: any) => c?.name === transformationFrom?.executorCompanyId)?.[0] || null;
            const facilityTo = supplyChain?.companiesInfo?.filter((c: any) => c?.name === transformationTo?.executorCompanyId)?.[0] || null;

            const document = {
                type: trade?.type,
                referenceNumber: trade?.referenceNumber,
                issueDate: trade.issueDate,
                validUntilDate: trade.validUntilDate,
                documentType: trade?.documentType,
                assessmentType: null,
                documentId: trade?.documentId,
                documentFileName: trade?.documentFileName
            }
            const certificate = (trade?.certificates?.length || 0) > 0
                ? {
                    validFrom: trade?.certificates?.[0]?.validFrom,
                    validUntil: trade?.certificates?.[0]?.validUntil,
                    documentType: trade?.certificates?.[0]?.certificateTypeName,
                    assessmentType: trade?.certificates?.[0]?.assessmentTypeName,
                    documentId: trade?.certificates?.[0]?.documentId,
                    documentFileName: trade?.certificates?.[0]?.documentFileName,
                    processingStandardName: trade?.certificates?.[0]?.processingStandardName
                }
                : null;
            return {
                date: trade.creationDate,
                component: <DocumentsHistoryElement
                    key={'trade-'+id}
                    title={t("transaction")}
                    document={document}
                    certificate={certificate}
                    companyNameFrom={facilityFrom?.visibleName || null}
                    companyNameTo={facilityTo?.visibleName || null}
                    processingStandardNames={trade.processingStandards}
                />
            }
        })
    const transformationsDocumentsList: OrderedComponent[] = (supplyChain?.transformations || [])
        .slice()// @ts-ignore
        .filter(t => (t?.certificates?.length || 0) > 0)
        .map((transformation: SupplyChainTransformationPresentable, id: number) => {
            const facility = supplyChain?.companiesInfo?.filter((c: any) => c?.name === transformation?.executorCompanyId)?.[0] || null;

            const document = null;
            const certificate = {
                validFrom: transformation?.certificates?.[0]?.validFrom,
                validUntil: transformation?.certificates?.[0]?.validUntil,
                documentType: transformation?.certificates?.[0]?.certificateTypeName,
                assessmentType: transformation?.certificates?.[0]?.assessmentTypeName,
                documentId: transformation?.certificates?.[0]?.documentId,
                documentFileName: transformation?.certificates?.[0]?.documentFileName,
                processingStandardName: transformation?.certificates?.[0]?.processingStandardName
            };
            return {
                date: transformation?.certificates?.[0]?.creationDate,
                component: <DocumentsHistoryElement
                    key={'transformation-'+id}
                    title={t("scope_certification")}
                    document={document}
                    certificate={certificate}
                    companyNameFrom={facility?.visibleName || null}
                    companyNameTo={undefined}
                    processingStandardNames={transformation.processingStandards}
                />
            }
        })

    const componentList = [...tradesDocumentsList, ...transformationsDocumentsList];
    return (
        <div className={styles.Container}>
            <div className={styles.TitleSection}>
                <h1>{query.get("material_name")}</h1>
            </div>
            <h1>{t("document_history.page_title")}</h1>
            <div className={styles.ControlsContainer}>
                <button className={styles.ControlButton} onClick={()=>{history.push('/' + props.companyIndustrialSector + '/graph/'+idParam)}}>
                    <AiOutlineFork/> {t("show_chain")}
                </button>
                <button className={styles.ControlButton} onClick={()=>setIsSortAscending(v => !v)}>{
                    isSortAscending
                        ? <><AiOutlineArrowUp/>{t("sort_ascending")}</>
                        : <><AiOutlineArrowDown/>{t("sort_descending")}</>}
                </button>
            </div>
            {
                componentList
                .slice()
                ?.sort((a, b) => a?.date && b?.date && a.date > b.date ? (isSortAscending ? -1 : 1) : (isSortAscending ? 1 : -1))
                .map(a => a.component)
            }
        </div>
    )
}
export default connector(DocumentsHistoryPage);