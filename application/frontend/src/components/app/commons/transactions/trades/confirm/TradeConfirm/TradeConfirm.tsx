import React, {useEffect} from "react";
import {Button, Form, Jumbotron} from "react-bootstrap";
import {
    ConfirmationCertificationPresentable,
    ConfirmationTradePresentable, ConfirmationTransactionRequest,
    ConfirmationTransactionRequestTransactionStatusEnum,
    MaterialPresentable,
    MaterialRequest, PositionPresentable, Unit,
} from "@unece/cotton-fetch";
import styles from "./TradeConfirm.module.scss";
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";
import TransactionControllerApi from "../../../../../../../api/TransactionControllerApi";
import MaterialControllerApi from "../../../../../../../api/MaterialControllerApi";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import {FaDownload} from "react-icons/fa";
import {downloadFile} from "../../../../../../../utils/downloadFile";
import {GenericDropdownSelector} from "../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector";
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

type Position = {
    id: number,
    material: undefined | MaterialPresentable,
    unit: undefined | Unit
}

export const TradeConfirm = (props: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const tradeType = new URLSearchParams(useLocation().search).get("type");
    const match = useRouteMatch('/:companyIndustry' + TRADE_CONFIRMATION_PATH);
    const [positionsToConfirm, setPositionsToConfirm] = React.useState<Position[]>([]);
    const [consigneeReferenceNumber, setConsigneeReferenceNumber] = React.useState<string>("");
    const [documentBlockchainVerified, setDocumentBlockchainVerified] = React.useState<boolean>(false);

    const [contractorMaterialsToShow, setContractorMaterialsToShow] = React.useState<MaterialPresentable[]>([]);
    const [contractorMaterialsSelected, setContractorMaterialsSelected] = React.useState<MaterialPresentable[]>([]);

    const [tradeCertificates, setTradeCertificates] = React.useState<ConfirmationCertificationPresentable[]>([]);
    const [materials, setMaterials] = React.useState<MaterialPresentable[]>([]);
    const [materialsError, setMaterialsError] = React.useState<boolean[]>([]);
    // @ts-ignore
    const idParam = match?.params.id;

    const getMaterialsByCompany = async (isInput: boolean, isForTransformation: boolean, companyName: string) => {
        let resp:MaterialPresentable[] = [];
        try {
            if (companyName === "" && props.userLoggedIn?.company?.companyName)
                companyName = props.userLoggedIn?.company?.companyName;
            props.startLoading(t("popups.loading.materials"));
            resp = await MaterialControllerApi.getMaterialsByCompany({
                company: companyName,
                isInput: isInput,
                isForTransformation: isForTransformation
            });
            setMaterials(resp);
        }
        catch (error) {
            props.addErrorMessage(`${t("popups.errors.materials_from_company")}: ${error}`);
        } finally {
            props.stopLoading();
        }
        return resp;
    };

    const isMaterialMissing = (positions: Position[]): boolean => {
        for (let posIndex in positions){
            if (positions[posIndex].material == null){
                // @ts-ignore
                setMaterialsError(v => {
                    v[posIndex] = true;
                    return [...v];
                });
                return true;
            }
            setMaterialsError(v => {
                v[posIndex] = false;
                return [...v];
            });
        }
        return false;
    }

    const getTradeInformationToConfirm = async () => {

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

        // @ts-ignore
        setPositionsToConfirm((v) => [...v, ...props.trade.positions?.map(value => {
            if (value.consigneeMaterialId != null)
                return {id: value.id, material: {id: value.consigneeMaterialId, name: value.consigneeMaterialName}};
            else
                return {id: value.id, material: undefined};
        })]);

    };

    const getContractorMaterials = async () => {
        let resp: MaterialPresentable[];
        try {
            props.startLoading(t("popups.loading.contractor_materials"));
            resp = await getMaterialsByCompany(true, false, "");
            setContractorMaterialsToShow(resp);
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.contractor_materials")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    };

    const setConsigneeMaterial = (index: number, value: MaterialPresentable) => {
        setPositionsToConfirm(v => {
            v[index].material = value;
            return [...v];
        });
        // @ts-ignore
        setMaterialsError(v => {
            v[index] = false;
            return [...v];
        });

        let materialsSelected = [...contractorMaterialsSelected];
        materialsSelected.splice(index, 1, value);
        let materialsFiltered = materials
            .filter(mToShow => !materialsSelected.find((mSelected: MaterialPresentable) => mToShow.id === mSelected.id));
        setContractorMaterialsToShow(materialsFiltered);

        setContractorMaterialsSelected(m => {
            m[index] = value;
            return [...m];
        });
    };

    const addConsigneeMaterial = async (materialNameAdded: string, indexPosition: number, isInput: boolean) => {
        let consigneeMaterialRequest: MaterialRequest = {
            name: materialNameAdded,
            companyName: props.userLoggedIn?.company?.companyName,
            input: isInput
        };
        try {
            const resp = await MaterialControllerApi.addMaterialFromCompany({
                materialRequest: consigneeMaterialRequest
            });
            setPositionsToConfirm(v => {
                v[indexPosition].material = resp;
                return [...v];
            });
            // @ts-ignore
            setMaterialsError(v => {
                v[indexPosition] = false;
                return [...v];
            });
            props.addSuccessMessage(t("popups.success.material_add"));
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.material_add")}: ${error}`);
            throw new Error("Material already exists!");
        }
    };

    const handleConfirmation = async (isConfirmed: boolean) => {
        const status = isConfirmed ? ConfirmationTransactionRequestTransactionStatusEnum.Accepted : ConfirmationTransactionRequestTransactionStatusEnum.Refused;
        const confirmationRequest: ConfirmationTransactionRequest = {
            consigneeReferenceNumber: consigneeReferenceNumber,
            // @ts-ignore
            positions: positionsToConfirm.map(position => ({
                    id: position.id,
                    material: position.material
                })
            ),
            transactionStatus: status
        };
        try {
            if (isMaterialMissing(positionsToConfirm))
                return;
            await TransactionControllerApi.confirmTransaction({
                id: idParam,
                confirmationTransactionRequest: confirmationRequest,
                // @ts-ignore
                type: tradeType
            });
            props.addSuccessMessage(`${tradeType}: ${t("popups.success.trade_update")}`);
            history.push("/");
        } catch (error) {
            const errorText = error.status === 401 ? "UNAUTHORIZED" : error;
            props.addErrorMessage(`${t("popups.errors.trade_update")}: ${errorText}`);
        }
    };

    const getTradeCertificates = async () => {
        try {
            props.startLoading(t("popups.loading.certificates"));
            const resp = await  CertificationControllerApi.getCertificationsByTransactionId({
                transactionType: tradeType || '',
                id: idParam
            });
            resp && resp.length && resp.length>0 && setTradeCertificates(resp);
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.certificates")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    }

    useEffect(() => {
        (async () => {
            await getTradeCertificates();
            await getTradeInformationToConfirm();
            await getContractorMaterials();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const positionsRows = props.trade?.positions?.map((position: PositionPresentable, index: number) => {
        return <div key={index} className={styles.PositionsArea}>
                <div className={styles.ConsigneeMaterialArea}>
                    <Form.Group>
                        <Form.Label>{t("trade.consignee_material")}</Form.Label>
                        { position.consigneeMaterialId == null ?
                            <div className="w-100">
                                <GenericDropdownSelector
                                    getItems={() => contractorMaterialsToShow}
                                    itemPropToShow={"name"}
                                    selectItem={item => setConsigneeMaterial(index, item)}
                                    defaultText={t("select_material")}
                                    newItemFields={["name"]}
                                    onCreate={async (item) => await addConsigneeMaterial(item.name, index, true)}
                                    creationTitle={t("material_name")}
                                    createDisabled={item => !item?.name}
                                    required={true}
                                />
                                {
                                    materialsError != undefined && materialsError[index] &&
                                    <div className={styles.ErrorText}>{t("errors.select_material")}</div>
                                }
                            </div>
                            :
                            <Form.Control type="text" value={position.consigneeMaterialName} disabled/>
                        }

                    </Form.Group>
                </div>
            <div className={styles.ContractorMaterialArea}>
                <Form.Group>
                    <Form.Label>{t("trade.contractor_material")}</Form.Label>
                    <Form.Control type="text" value={position.contractorMaterialName} disabled/>
                </Form.Group>
                <Button className={styles.ShowSupplyChainBtn} variant="primary" onClick={() => {history.push('/' + props.companyIndustrialSector + '/graph/' + position.contractorMaterialId)}}>
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
                    <Form.Label>{t("positions.unit")}</Form.Label>
                    <Form.Control type="number" placeholder={t("placeholders.trade.no_weight")} value={position.weight} disabled/>
                </Form.Group>

                <Form.Group className={styles.DescriptionArea}>
                    <Form.Label>{t("positions.material_description")}</Form.Label>
                    <Form.Control as="textarea" rows={10} type="text" placeholder={t("placeholders.trade.no_description")} value={position.externalDescription} disabled/>
                </Form.Group>
            </div>
        </div>
    });

    return (
        <Jumbotron className={styles.Container}>
            <h2>{`${t("trade.confirmation_title")}: ${tradeType}`}</h2>
            <Form className={styles.Form}>
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
                    {props.trade?.document != null ?
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
                                        <p className={`${styles.ErrorText} ${styles.Preview} text-center`}>
                                            {t("preview_not_supported")}</p>
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
                    <Form.Control type="text" value={props.trade?.processingStandardName} placeholder={t("placeholders.no_reference_standard")} disabled/>
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
                                            history.push(`/certifications/${certType}/${certificate.id}/confirmation`)
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
                    <Form.Label>{tradeType === 'shipping' ? t("shipping_date") : t("valid_from")}</Form.Label>
                    <Form.Control type="text" value={props.trade?.validFrom?.toLocaleDateString()} disabled/>
                </Form.Group>
                {tradeType !== 'shipping' &&
                    <Form.Group className={styles.ValidUntilArea}>
                        <Form.Label>{t("valid_until")}</Form.Label>
                        <Form.Control type="text" value={props.trade?.validUntil?.toLocaleDateString()} disabled/>
                    </Form.Group>
                }

                <Form.Group className={styles.ConsigneeRefNumberArea}>
                    <Form.Label>{t("trade.consignee_id")}</Form.Label>
                    <Form.Control name="consigneeReferenceNumber" type="text"
                                  onChange={e => setConsigneeReferenceNumber(e.target.value)}
                                  placeholder={t("placeholders.trade.enter_consignee_id")}
                                  value={props.trade?.consigneeReferenceNumber}/>
                </Form.Group>
                <Form.Group className={styles.ContractorRefNumberArea}>
                    <Form.Label>{t("trade.contractor_id")}</Form.Label>
                    <Form.Control name="consigneeReferenceNumber" type="text"
                                  value={props.trade?.contractorReferenceNumber}
                                  placeholder={t("placeholders.not_specified")} disabled/>
                </Form.Group>

                <div className={styles.PositionsContainer}>
                    <div className={styles.PositionsTitleArea}>
                        <hr/>
                        <h4>{t("line_items")}</h4>
                    </div>
                    {positionsRows}
                </div>

                <div className={styles.ConfirmArea}>
                    <Button variant="primary" className="mr-2 bg-danger border-danger" onClick={() => handleConfirmation(false)}>{t("refuse")}</Button>
                    <Button variant="primary" onClick={() => handleConfirmation(true)}>{t("confirm")}</Button>
                </div>

            </Form>
        </Jumbotron>
    );

};

export default connector(TradeConfirm);
