import {RootState} from "../../../../../../redux/store";
import {selectUserLoggedIn} from "../../../../../../redux/store/stateSelectors";
import {addErrorMessage, addSuccessMessage} from "../../../../../../redux/store/Messages/actions";
import {startLoading, stopLoading} from "../../../../../../redux/store/Loading/actions";
import {connect, ConnectedProps} from "react-redux";
import {
    AssessmentTypePresentable,
    CompanyPresentable,
    DocumentRequest,
    DocumentTypePresentable,
    MaterialPresentable,
    ProcessingStandardPresentable,
    ProcessType,
    ProductCategory,
    TradePresentable,
    UserPresentable
} from "@unece/cotton-fetch";
import ProcessTypeControllerApi from "../../../../../../api/ProcessTypeControllerApi";
import UserControllerApi from "../../../../../../api/UserControllerApi";
import MaterialControllerApi from "../../../../../../api/MaterialControllerApi";
import CertificationControllerApi from "../../../../../../api/CertificationControllerApi";
import CompanyControllerApi from "../../../../../../api/CompanyControllerApi";
import DocumentControllerApi from "../../../../../../api/DocumentControllerApi";
import {getBase64, isValidEmail} from "../../../../../../utils/basicUtils";
import {useRouteMatch} from "react-router-dom";
import React from "react";
import {useTranslation} from "react-i18next";
import {Modal} from "../../../../../GenericComponents/Modal/Modal";
import {Form} from "react-bootstrap";
import styles from "../../trades/insert/TradeInsertion.module.scss";

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

type Props = PropsFromRedux & {
    component: any
};

export const CERTIFICATION_TYPE_SCOPE = 'scope';
export const CERTIFICATION_TYPE_TRANSACTION = 'transaction';
export const CERTIFICATION_TYPE_MATERIAL = 'material';
export const CERTIFICATION_TYPE_SELF = 'self';

interface UrlMatchParams {
    certificationType: string;
}

export type CertificationInsertionChildProps = {
    selectCompany: (company: {value: CompanyPresentable | undefined, label: string}) => void
    getUserFromEmailAddress: (email: string | undefined) => void

    // solo in MATERIAL e SELF
    // setMaterial: (positionIndex: number, value: MaterialPresentable) => void
    // addMaterial: (item: any, positionIndex: number, isInput: boolean) => void
    getMaterialsByCompany: (isForTransformation: boolean, companyName: string | undefined) => void
    checkValidUntilDate: (dateTimestamp: number, validFromDate: Date | undefined) => boolean
    getApprovers: () => void
    getAssessmentTypes: () => void
    getProcessTypes: () => void
    getAllProductCategories: () => void
    handleDocumentUpload: (file: File) => void
    getCertificationDocumentTypes: () => void
    getProcessingStandards: () => void

    // setter redux state
    setAssessmentTypeSelected: (assessmentType: AssessmentTypePresentable) => void
    setProcessingStandardSelected: (processingStandard: ProcessingStandardPresentable) => void
    setProductCategoriesSelected: (productCategory: ProductCategory[]) => void
    setProcessesTypeSelected: (processesType: ProcessType[]) => void
    setDocumentTypeSelected: (documentType: DocumentTypePresentable) => void
    setDocumentUploaded: (documentUpload: DocumentRequest) => void
    setInvitationModalVisible: (isVisible: boolean) => void
    eraseCompanySelected: () => void

    // getter redux state
    assessmentTypeSelected: AssessmentTypePresentable
    assessmentTypes: AssessmentTypePresentable[]
    companySelected: {value: CompanyPresentable | undefined, label: string}
    consigneeEmailSelected: {value: string, label: string}
    documentUploaded: DocumentRequest
    shippingsReferenceNumberSelected: TradePresentable[]
    approvers: CompanyPresentable[]
    companyEmailAddresses: string[]
    userSelected: UserPresentable
    documentTypes: DocumentTypePresentable[]
    documentTypeSelected: DocumentTypePresentable
    productCategories: ProductCategory[]
    productCategoriesSelected: ProductCategory[]
    processTypes: ProcessType[]
    processesTypeSelected: ProcessType[]
    processingStandards: ProcessingStandardPresentable[]
    processingStandardSelected: ProcessingStandardPresentable
    materials: MaterialPresentable[]
    isInvitation: boolean

}

export const CertificationInsertion = (props: Props) => {
    const Component = props.component;
    const { t } = useTranslation();
    const [assessmentTypes, setAssessmentTypes] = React.useState<AssessmentTypePresentable[]>([]);
    const [processTypes, setProcessTypes] = React.useState<ProcessType[]>([]);
    const [processesTypeSelected, setProcessesTypeSelected] = React.useState<ProcessType[]>([]);
    const [productCategories, setProductCategories] = React.useState<ProductCategory[]>([]);
    const [productCategoriesSelected, setProductCategoriesSelected] = React.useState<ProductCategory[]>([]);
    const [documentUploaded, setDocumentUploaded] = React.useState<DocumentRequest>({name: t("upload_document"), contentType:"", content:undefined});
    const [documentTypes, setDocumentTypes] = React.useState<DocumentTypePresentable[]>([]);
    const [documentTypeSelected, setDocumentTypeSelected] = React.useState<DocumentTypePresentable>();
    const [assessmentTypeSelected, setAssessmentTypeSelected] = React.useState<AssessmentTypePresentable>();
    const [processingStandards, setProcessingStandards] = React.useState<ProcessingStandardPresentable[]>([]);
    const [processingStandardSelected, setProcessingStandardSelected] = React.useState<ProcessingStandardPresentable | undefined>(undefined);

    const [materials, setMaterials] = React.useState<MaterialPresentable[]>([]);
    const [companyEmailAddresses, setCompanyEmailAddresses] = React.useState<string[]>([]);
    const [companySelected, setCompanySelected] = React.useState<{value: CompanyPresentable | undefined, label: string}>({value: undefined, label: t("placeholders.select_company")});
    const [consigneeEmailSelected, setConsigneeEmailSelected] = React.useState<{value: string, label: string}>({value: "", label: t("no_company_emails")});
    const [userSelected, setUserSelected] = React.useState<UserPresentable>({});

    const [invitationModalVisible, setInvitationModalVisible] = React.useState<boolean>(false);
    const [invitationFieldsMissing, setInvitationFieldsMissing] = React.useState<boolean>(false);
    const [invitationEmailError, setInvitationEmailError] = React.useState<boolean>(false);
    const [isInvitation, setIsInvitation] = React.useState<boolean>(false);

    const [approvers, setApprovers] = React.useState<CompanyPresentable[]>([]);

    const match = useRouteMatch<UrlMatchParams>('/:companyIndustry/transactions/certification/:certificationType');
    const certificationType = match?.params?.certificationType;

    const selectCompany = async (company: {value: CompanyPresentable | undefined, label: string}) => {
        if (company.value != undefined) {
            setCompanySelected(company);
            await getCompanyEmailAddresses(company.value.companyName);
        }
        else {
            setConsigneeEmailSelected({value: "", label: t("no_company_emails")});
            setCompanyEmailAddresses([]);
            setCompanySelected({value: undefined, label: t("placeholders.select_company")});
            setUserSelected({});
        }
    }

    const getCompanyEmailAddresses = async (company: string | undefined) => {
        let companyEmails = null;
        if (company !== undefined) {
            try {
                const resp = await CompanyControllerApi.getCompanyEmails({
                    companyName: company
                });
                companyEmails = resp.sort();
                setCompanyEmailAddresses(companyEmails);
                await getUserFromEmailAddress(companyEmails[0])
                return companyEmails;
            } catch (error) {
                props.addErrorMessage(`${t("popups.errors.company_email")}: ${error}`);
            }
        }
        return null;
    };

    const getUserFromEmailAddress = async (email: string | undefined) => {
        if (email !== undefined){
            try {
                setConsigneeEmailSelected({value: email, label: email});
                const resp = await UserControllerApi.getUserFromEmailAddress({email});
                setUserSelected(resp);
            }
            catch (error) {
                props.addErrorMessage(`${t("popups.errors.user_from_email")}: ${error}`);
            }
        }
    };

    const getMaterialsByCompany = async (isForTransformation: boolean, companyName: string | undefined) => {
        let mat: any[] = [];
        try {
            if (companyName === undefined && props.userLoggedIn?.company?.companyName)
                companyName = props.userLoggedIn?.company?.companyName;
            props.startLoading(t("popups.loading.materials"));
            let inputMaterials = await MaterialControllerApi.getMaterialsByCompany({
                // @ts-ignore
                company: companyName,
                isInput: true,
                isForTransformation: isForTransformation
            });
            let outputMaterials = await MaterialControllerApi.getMaterialsByCompany({
                // @ts-ignore
                company: companyName,
                isInput: false,
                isForTransformation: !isForTransformation
            });
            mat = [...inputMaterials, ...outputMaterials];
            setMaterials(mat);
        }
        catch (error) {
            props.addErrorMessage(`${t("popups.errors.materials_from_company")}: ${error}`);
        } finally {
            props.stopLoading();
        }
        return mat;
    };

    const checkValidUntilDate = (dateTimestamp: number, validFromDate: Date | undefined) => {
        if (validFromDate) {
            // @ts-ignore
            return dateTimestamp >= validFromDate?.getTime();
        }
        return false;
    };

    const getApprovers = async () => {
        try {
            props.startLoading(t("popups.loading.approvers"));
            const resp = await CompanyControllerApi.getCompanyApprovers();
            resp && setApprovers(resp);
        }
        catch (error) {
            props.addErrorMessage(`${t("popups.errors.approvers")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    };

    const getAssessmentTypes = async () => {
        try {
            const resp = await CertificationControllerApi.getAssessmentTypes({
                type: certificationType
            });
            resp && resp.length>0 && setAssessmentTypes(resp);
        }
        catch (error) {
            props.addErrorMessage(`${t("popups.errors.assessment_types")}: ${error}`);
        }
    };

    const getProcessTypes = async () => {
        try {
            const resp = await ProcessTypeControllerApi.getProcessTypes();
            resp && resp.length>0 && setProcessTypes(resp);
        }
        catch (error) {
            props.addErrorMessage(`${t("popups.errors.process_types")}: ${error}`);
        }
    }

    const getAllProductCategories = async () => {
        try {
            const resp = await CertificationControllerApi.getAllProductCategories();
            resp && resp.length>0 && setProductCategories(resp);
        }
        catch (error){
            props.addErrorMessage(`${t("popups.errors.product_categories")}: ${error}`);
        }
    }

    const handleDocumentUpload = async (file: File) => {
        getBase64(file).then(contentFile => {
            // @ts-ignore
            setDocumentUploaded({name: file.name, contentType: file.type, content: contentFile});
        });
    };

    const getCertificationDocumentTypes = async () => {
        try {
            const resp = await DocumentControllerApi.getDocumentTypes({
                type: certificationType + "_certification"
            });
            setDocumentTypes(resp);
        }
        catch(error) {
            props.addErrorMessage(`${t("popups.errors.document_types")}: ${error}`);
        }
    };

    const getProcessingStandards = async () => {
        try {
            props.startLoading(t("popups.loading.processing_standard_cert"));
            const resp = await CertificationControllerApi.getCertificationProcessingStandards({
                type: certificationType
            });
            setProcessingStandards(resp);
        }
        catch (error){
            props.addErrorMessage(`${t("popups.errors.certification_processing_standard")}: ${error}`);
        }
        finally {
            props.stopLoading();
        }
    }

    const eraseCompanySelected = () => {
        setCompanySelected({value: undefined, label: t("placeholders.select_company")});
    }

    const addInvitedCertifier = async () => {
        if (companySelected.value?.companyName && consigneeEmailSelected.value) {
            if (isValidEmail(consigneeEmailSelected.value)){
                setUserSelected({firstName: "-", lastName: "", city: "-"});
                setInvitationModalVisible(false);
                setInvitationEmailError(false);
                setIsInvitation(true);
                props.addSuccessMessage(t("popups.success.invitation_submit"));
            }
            else {
                setInvitationEmailError(true);
                setInvitationFieldsMissing(false);
                setIsInvitation(false);
            }
        }
        else {
            setInvitationFieldsMissing(true);
        }
    }

    const closeModal = () => {
        setInvitationModalVisible(false);
        setCompanySelected({value: undefined, label: t("placeholders.select_company")});
        setConsigneeEmailSelected({value: "", label: t("no_company_emails")});
        setUserSelected({});
        setInvitationEmailError(false);
        setInvitationFieldsMissing(false);
    }

    return (
        <>
            <Modal show={invitationModalVisible} handleClose={closeModal} handleConfirm={addInvitedCertifier}
                   title={props.userLoggedIn?.company?.partnerType?.name === 'certifier' ? t("trade.company_invitation") : t("certification.company_invitation")}>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>{props.userLoggedIn?.company?.partnerType?.name === 'certifier' ? t("trader") : t("certifier")}</Form.Label>
                        <Form.Control type="text" placeholder={t("placeholders.certification.company_invitation")} onChange={e => setCompanySelected({value: {companyName: e.target.value, address: '-'}, label: e.target.value})}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{t("user_email")}</Form.Label>
                        <Form.Control type="email" onChange={e => setConsigneeEmailSelected({value: e.target.value, label: e.target.value})} placeholder={t("placeholders.certification.company_user_invitation")}/>
                        <Form.Text className="text-muted">{t("company_invitation_hint")}</Form.Text>
                        {
                            invitationEmailError &&
                            <div className={styles.ErrorText}>{t("errors.email_validation")}</div>
                        }
                    </Form.Group>
                    {
                        invitationFieldsMissing &&
                        <div className={styles.ErrorText}>{t("errors.company_invitation")}</div>
                    }
                </Form>
            </Modal>
            <Component
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers}
                getAssessmentTypes={getAssessmentTypes}
                getProcessTypes={getProcessTypes}
                getAllProductCategories={getAllProductCategories}
                handleDocumentUpload={handleDocumentUpload}
                getCertificationDocumentTypes={getCertificationDocumentTypes}
                getProcessingStandards={getProcessingStandards}
                // setter redux state
                setAssessmentTypeSelected={setAssessmentTypeSelected}
                setProcessingStandardSelected={setProcessingStandardSelected}
                setProcessesTypeSelected={setProcessesTypeSelected}
                setProductCategoriesSelected={setProductCategoriesSelected}
                setDocumentTypeSelected={setDocumentTypeSelected}
                setDocumentUploaded={setDocumentUploaded}
                setInvitationModalVisible={setInvitationModalVisible}
                eraseCompanySelected={eraseCompanySelected}
                // getter redux state
                assessmentTypeSelected={assessmentTypeSelected}
                assessmentTypes={assessmentTypes}
                companySelected={companySelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                approvers={approvers}
                companyEmailAddresses={companyEmailAddresses}
                userSelected={userSelected}
                documentTypes={documentTypes}
                documentTypeSelected={documentTypeSelected}
                productCategories={productCategories}
                productCategoriesSelected={productCategoriesSelected}
                processTypes={processTypes}
                processesTypeSelected={processesTypeSelected}
                processingStandards={processingStandards}
                processingStandardSelected={processingStandardSelected}
                materials={materials}
                isInvitation={isInvitation}
            />
        </>
    );
}

export default connector(CertificationInsertion);