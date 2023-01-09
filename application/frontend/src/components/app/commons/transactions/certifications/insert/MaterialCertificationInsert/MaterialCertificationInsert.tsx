import React, {useEffect} from "react";
import {Button, Form, Jumbotron} from "react-bootstrap";
import styles from '../CertificationInsertion.module.scss';
import {useForm} from "react-hook-form";
import {
    CertificationRequest, CertificationRequestSubjectEnum,
    MaterialPresentable, MaterialRequest,
} from "@unece/cotton-fetch";
import {useHistory} from "react-router-dom";
import MaterialControllerApi from "../../../../../../../api/MaterialControllerApi";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import {GenericCard} from "../../../../../../GenericComponents/GenericCard/GenericCard";
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

export const MaterialCertificationInsert = (props: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const { register, handleSubmit, errors, getValues } = useForm<CertificationRequest>();
    const [positions, setPositions] = React.useState<Position[]>([{
        id: 0,
        material: undefined,
        unit: undefined
    }]);
    const [materialsError, setMaterialsError] = React.useState<boolean[]>([]);
    const [submitted, setSubmitted] = React.useState<boolean>(false);
    const [isCertificateReferenceInserted,setIsCertificateReferenceInserted] = React.useState<boolean>(true);
    const [isUrlValidated, setIsUrlValidated] = React.useState<boolean>(true);

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
    };


    const handleCertification = async (certification: CertificationRequest) => {
        if (isMaterialMissing(positions))
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
        certification.subject = CertificationRequestSubjectEnum.Material || null;
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

    useEffect(() => {
        (async () => {
            await props.getApprovers();
            await props.getAssessmentTypes();
            await props.getProcessingStandards();
            await props.getAllProductCategories();
            await props.getCertificationDocumentTypes();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Jumbotron className={styles.Container}>
        <h2 className="mb-3">{t("certification.material_title")}</h2>
        <Form className={styles.Form} onSubmit={handleSubmit(handleCertification)}>
            <Form.Group className={styles.CompanyNameArea}>
                <Form.Label>{t("company")}</Form.Label>
                <Select
                    value={props.companySelected}
                    onChange={props.selectCompany}
                    options={props.approvers.map(c => ({value: c, label: c.companyName}))}
                    components={props.userLoggedIn?.company?.partnerType?.name !== 'certifier' ?
                                { MenuList: (p: any) => <SelectMenuButton onClick={() => props.setInvitationModalVisible(true)} {...p} buttonText={t("certification.invite_company")} /> }
                                : undefined }
                />
                {
                    submitted && props.companySelected.value === undefined &&
                    <div className={styles.ErrorText}>{t("errors.certification.consignee")}</div>
                }
            </Form.Group>
            <div className={styles.CompanyInfoArea}>
                <GenericCard
                    title={`${t("company_information")}:`}
                    elements={[
                        {name: t("name"), value: props.companySelected && props.companySelected.value?.companyName},
                        {name: t("address"), value: props.companySelected && props.companySelected.value?.address}
                    ]}/>
            </div>
            <Form.Group className={styles.UserEmailArea}>
                <Form.Label>{t("user_email")}</Form.Label>
                <Select
                    value={props.consigneeEmailSelected}
                    onChange={(e: any) => props.getUserFromEmailAddress(e.value)}
                    options={props.companyEmailAddresses.map(email => ({value: email, label: email}))}
                />
            </Form.Group>
            <div className={styles.UserInfoArea}>
                <GenericCard
                    title={`${t("user_information")}:`}
                    elements={[
                        {name: t("user.name_surname"), value: props.userSelected && props.userSelected.firstName ? props.userSelected.firstName + " " + props.userSelected.lastName : ""},
                        {name: t("city"), value: props.userSelected && props.userSelected.city}
                    ]}/>
            </div>

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
                <Form.Label>{t("reference_standard")}</Form.Label>
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
                    <div className={styles.ErrorText}>{t("errors.certification.reference_standard")}</div>
                }
            </Form.Group>
            <Form.Group className={styles.AssessmentTypeArea}>
                <Form.Label>{t("assessment_type")}</Form.Label>
                <Select
                    value={props.assessmentTypeSelected ? {
                        value: props.assessmentTypeSelected,
                        label: props.assessmentTypeSelected?.name
                    } : null}
                    onChange={(e : any) => props.setAssessmentTypeSelected(e.value)}
                    options={props.assessmentTypes.map(a => ({value: a, label: a.name}))}
                />
                {
                    submitted && props.assessmentTypeSelected === undefined &&
                    <div className={styles.ErrorText}>{t("errors.certification.assessment_type")}</div>
                }
            </Form.Group>

            <Form.Group className={styles.ProductCategoriesArea}>
                <Form.Label>{t("certification.product_categories")}</Form.Label>
                <Select
                    value={props.productCategoriesSelected.map(p => {
                        return {
                            value: p,
                            label: p?.name
                        };
                    })}
                    onChange={(e: any) => props.setProductCategoriesSelected(e.map((v: any) => v.value))}
                    options={props.productCategories.map(p => ({value: p, label: p.name}))}
                    isMulti
                />
            </Form.Group>

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
                <Form.Label>{t("material")}</Form.Label>
                <GenericDropdownSelector
                    getItems={() => props.getMaterialsByCompany(
                        true,
                        props?.userLoggedIn?.company?.partnerType?.name==='certifier' ? props.companySelected.value?.companyName : props?.userLoggedIn?.company?.companyName
                    )}
                    itemPropToShow={"name"}
                    selectItem={item => setMaterial(0, item)}
                    defaultText={t("select_material")}
                    newItemFields={["name"]}
                    onCreate={async (item) => addMaterial(item, 0, false)}
                    creationTitle={t("material_name")}
                    createDisabled={item => !item?.name}
                    required={true}
                    // @ts-ignore
                    disabled={props.companySelected === undefined}
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

export default connector(MaterialCertificationInsert);