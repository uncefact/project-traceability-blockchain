import React, {useEffect} from "react";
import {Button, Form, Jumbotron} from "react-bootstrap";
import styles from '../CertificationInsertion.module.scss';
import {useForm} from "react-hook-form";
import {
    AssessmentTypePresentable,
    CertificationRequest,
    CertificationRequestSubjectEnum,
    CompanyPresentable,
    MaterialPresentable,
    MaterialRequest,
} from "@unece/cotton-fetch";
import {useHistory} from "react-router-dom";
import MaterialControllerApi from "../../../../../../../api/MaterialControllerApi";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import CompanyControllerApi from "../../../../../../../api/CompanyControllerApi";
// @ts-ignore
import Select from 'react-select';
import {GenericDropdownSelector} from "../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector";
import {RootState} from "../../../../../../../redux/store";
import {selectUserLoggedIn} from "../../../../../../../redux/store/stateSelectors";
import {addErrorMessage, addSuccessMessage} from "../../../../../../../redux/store/Messages/actions";
import {startLoading, stopLoading} from "../../../../../../../redux/store/Loading/actions";
import {connect, ConnectedProps} from "react-redux";
import {Position} from "../../../trades/insert/TradeInsertion";
import {CertificationInsertionChildProps} from "../CertificationInsertion";
import {CertificationAttachment} from "../CertificationAttachment/CertificationAttachment";
import {isValidURL} from "../../../../../../../utils/basicUtils";
import {useTranslation} from "react-i18next";
import {SelectMenuButton} from "../../../../../../GenericComponents/SelectMenuButton/SelectMenuButton";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state)
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

type Props = PropsFromRedux & CertificationInsertionChildProps;

export const SelfCertificationInsert = (props: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const { register, handleSubmit, errors, getValues } = useForm<CertificationRequest>();
    const [showConsigneeInformation, setShowConsigneeInformation] = React.useState<boolean>(false);
    const [positions, setPositions] = React.useState<Position[]>([{
        id: 0,
        material: undefined,
        unit: undefined
    }]);
    const [materialsError, setMaterialsError] = React.useState<boolean[]>([]);
    const [isCertificateReferenceInserted, setIsCertificateReferenceInserted] = React.useState<boolean>(true);
    const [isUrlValidated, setIsUrlValidated] = React.useState<boolean>(true);

    const [tradersAndCertifierApprovers, setTradersAndCertifierApprovers] = React.useState<CompanyPresentable[]>([]);

    const [submitted, setSubmitted] = React.useState<boolean>(false);

    const setMaterial = (positionIndex: number, value: MaterialPresentable) => {
        setPositions(v => {
            v[positionIndex].material = value;
            return [...v];
        });
        setMaterialsError(v => {
            v[positionIndex] = false;
            return [...v];
        });
    };

    const addMaterial = async (item: any, positionIndex: number, isInput: boolean) => {
        let materialRequest: MaterialRequest = {
            name: item.name,
            companyName: props.userLoggedIn?.company?.companyName,
            input: isInput
        };
        try {
            props.startLoading(t("popups.loading.material_add"));
            const resp = await MaterialControllerApi.addMaterialFromCompany({
                materialRequest: materialRequest
            });
            setPositions(v => {
                v[positionIndex].material = resp;
                return [...v];
            });
            setMaterialsError(v => {
                v[positionIndex] = false;
                return [...v];
            });
            props.addSuccessMessage(t("popups.success.material_add"));
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.material_add")}: ${error}`);
            throw new Error("Material already exists!");
        } finally {
            props.stopLoading();
        }
    }

    const handleCertification = async (certification: CertificationRequest) => {
        if(props.assessmentTypeSelected?.name?.includes("Verified by second party") && props.companySelected.value === undefined)
            return;
        if(props.documentUploaded?.content === undefined && !certification.certificatePageUrl){
            setIsCertificateReferenceInserted(false);
            return;
        }
        else if (certification.certificatePageUrl !== undefined && !isValidURL(certification.certificatePageUrl)){
            setIsUrlValidated(false);
            return;
        }

        certification.consigneeCompanyName = props.companySelected.value?.companyName;
        certification.consigneeEmail = props.consigneeEmailSelected.value;
        certification.documentTypeCode = props.documentTypeSelected?.code;
        certification.documentUpload = props.documentUploaded;
        certification.processingStandardName = props.processingStandardSelected?.name;
        certification.assessmentName = props.assessmentTypeSelected?.name;
        certification.productCategoryCodeList = props.productCategoriesSelected.length>0 ? props.productCategoriesSelected.map(p => p.code || '') : undefined;
        certification.processTypes = props.processesTypeSelected.length>0 ? props.processesTypeSelected : undefined;
        certification.material = positions[0].material;
        // @ts-ignore
        certification.subject = CertificationRequestSubjectEnum.Self;
        certification.invitation = props.isInvitation;
        setSubmitted(true);
        try {
            if (certification.documentUpload.content) {
                // const tx = await props.uneceCottonTracking.storeDocumentHash(utils.hashMessage(certification.documentUpload.content))
                // const confirmation_promise = tx.wait();
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
            await CertificationControllerApi.createCertification({
                certificationRequest: certification
            });
            props.addSuccessMessage(t("popups.success.certification_created"));
            history.push("/");
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.certification_insert")}: ${error}`);
        }
    };


    const changeAssessmentTypeSelected = (assessmentType: AssessmentTypePresentable) => {
        props.setAssessmentTypeSelected(assessmentType);
        if (assessmentType != undefined && assessmentType.name?.includes("Verified by second party")) {
            setShowConsigneeInformation(true);
        }
        else {
            setShowConsigneeInformation(false);
            props.eraseCompanySelected();
            props.selectCompany({value: undefined, label: t("placeholders.select_company")});
        }
    };

    const getTraderAndCertifierApprovers = async () => {
        try {
            props.startLoading(t("popups.loading.self_certification_approvers"));
            const resp = await CompanyControllerApi.getTradersAndCertifierApprovers();
            resp && setTradersAndCertifierApprovers(resp);
        }
        catch (e) {
            props.addErrorMessage(`${t("popups.errors.self_certification_approvers")}: ${e}`);
        }
        finally {
            props.stopLoading();
        }
    };

    useEffect(() => {
        (async () => {
            getTraderAndCertifierApprovers();
            await props.getAssessmentTypes();
            await props.getProcessingStandards();
            await props.getProcessTypes();
            await props.getAllProductCategories();
            await props.getCertificationDocumentTypes();
            await props.getMaterialsByCompany(true, "");
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Jumbotron className={styles.Container}>
        <h2 className="mb-3">{t("certification.self_title")}</h2>
        <Form className={styles.Form} onSubmit={handleSubmit(handleCertification)}>
            <Form.Group className={styles.DocumentTypeArea}>
                <Form.Label>{t("document_type")}</Form.Label>
                <Select
                    value={props.documentTypeSelected ? {
                        value: props.documentTypeSelected,
                        label: props.documentTypeSelected.code + " - " + props.documentTypeSelected.name
                    } : null}
                    onChange={(e : any) => props.setDocumentTypeSelected(e.value)}
                    options={props.documentTypes !== undefined && props.documentTypes.map(d => ({value: d, label: d.code + " - " + d.name}))}
                />
                {
                    submitted && props.documentTypeSelected === undefined &&
                    <div className={styles.ErrorText}>{t("errors.certification.document_type")}</div>
                }
            </Form.Group>
            <Form.Group className={styles.DocumentArea}>
                <Form.Label>{t("attachment")}</Form.Label>
                <CertificationAttachment
                    register={register}
                    fileUploaded={props.documentUploaded}
                    setFileUploaded={props.setDocumentUploaded} />
                {
                    !isCertificateReferenceInserted &&
                    <div className={styles.ErrorText}>{t("errors.certification.document_url_upload")}</div>
                }
                {
                    !isUrlValidated &&
                    <div className={styles.ErrorText}>{t("errors.certification.url")}</div>
                }
            </Form.Group>

            <Form.Group className={styles.ReferencedStandardArea}>
                <Form.Label>{t("certification.proprietary_standard")}</Form.Label>
                <Select
                    value={props.processingStandardSelected ? {
                        value: props.processingStandardSelected,
                        label: props.processingStandardSelected?.name
                    } : null}
                    onChange={(e : any) => props.setProcessingStandardSelected(e?.value || null)}
                    options={props.processingStandards.map(p => ({value: p, label: p.name}))}
                    isClearable={true}
                />
                {
                    submitted && !props.processingStandardSelected &&
                    <div className={styles.ErrorText}>{t("errors.certification.proprietary_standard")}</div>
                }
            </Form.Group>
            <Form.Group className={styles.AssessmentTypeArea}>
                <Form.Label>{t("assessment_type")}</Form.Label>
                <Select
                    value={props.assessmentTypeSelected ? {
                        value: props.assessmentTypeSelected,
                        label: props.assessmentTypeSelected?.name
                    } : null}
                    onChange={(e : any) => changeAssessmentTypeSelected(e.value)}
                    options={props.assessmentTypes.map(a => ({value: a, label: a.name}))}
                />
                {
                    submitted && props.assessmentTypeSelected === undefined &&
                    <div className={styles.ErrorText}>{t("errors.certification.assessment_type")}</div>
                }
            </Form.Group>

            { showConsigneeInformation &&
            <>
                <Form.Group className={styles.VerifierNameArea}>
                    <Form.Label>{t("certification.verifier")}</Form.Label>
                    <Select
                        value={props.companySelected}
                        onChange={props.selectCompany}
                        options={tradersAndCertifierApprovers.map(c => ({value: c, label: c.companyName}))}
                        components={{ MenuList: (p: any) => <SelectMenuButton buttonText={t("certification.invite_verifier")} onClick={() => props.setInvitationModalVisible(true)} {...p}/>}}
                    />
                    {
                        submitted && props.companySelected.value === undefined &&
                        <div className={styles.ErrorText}>{t("errors.certification.verifier")}</div>
                    }
                </Form.Group>
                <Form.Group className={styles.VerifierEmailArea}>
                    <Form.Label>{t("certification.verifier_email")}</Form.Label>
                    <Select
                        value={props.consigneeEmailSelected}
                        onChange={(e: any) => props.getUserFromEmailAddress(e.value)}
                        options={props.companyEmailAddresses.map(email => ({value: email, label: email}))}
                    />
                </Form.Group>
            </>
            }

            <Form.Group className={styles.ValidFromArea}>
                <Form.Label>{t("issue_date")}</Form.Label>
                <Form.Control type="date" name="validFrom" ref={register({required: true, valueAsDate: true})} placeholder={t("placeholders.date")}/>
                {
                    errors.validFrom &&
                    <div className={styles.ErrorText}>{t("errors.valid_from")} </div>
                }
            </Form.Group>
            <Form.Group className={styles.ValidUntilArea}>
                <Form.Label>{t("valid_until")}</Form.Label>
                <Form.Control type="date" name="validUntil" placeholder={t("placeholders.date")} ref={register({required: true, valueAsDate: true, validate: value => props.checkValidUntilDate(value.getTime(), getValues("validFrom"))})} />
                {
                    errors.validUntil &&
                    <div className={styles.ErrorText}>{t("errors.until_date_valid")}</div>
                }
            </Form.Group>
            <Form.Group className={styles.CertificateIDArea}>
                <Form.Label>{t("certification.report_id")}</Form.Label>
                <Form.Control name="certificateReferenceNumber" ref={register({required: false})} type="text" placeholder={t("placeholders.certification.certificate_id")}/>
                <Form.Text className="text-muted">
                    i.e. GC14LU3
                </Form.Text>
                {
                    errors.certificateReferenceNumber && errors.certificateReferenceNumber.type === "required" &&
                    <div className={styles.ErrorText}>{t("errors.certification.reference_number")}</div>
                }
            </Form.Group>

            <Form.Group className={styles.MaterialArea}>
                <Form.Label>{`${t("material")} (${t("optional")})`}</Form.Label>
                <GenericDropdownSelector
                    // @ts-ignore
                    getItems={() => props.materials}
                    itemPropToShow={"name"}
                    selectItem={item => setMaterial(0, item)}
                    defaultText={t("select_material")}
                    newItemFields={["name"]}
                    onCreate={async (item) => addMaterial(item, 0, false)}
                    creationTitle={t("material_name")}
                    createDisabled={item => !item?.name}
                    required={true}
                />
                {
                    materialsError[0] &&
                    <div className={styles.ErrorText}>{t("errors.select_material")}</div>
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

            <div className={styles.ConfirmArea}>
                <Button variant="primary" type="submit">
                    {t("submit")}
                </Button>
            </div>
        </Form>
    </Jumbotron>
};

export default connector(SelfCertificationInsert);