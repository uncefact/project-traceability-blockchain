import {RootState} from "../../../../../../redux/store";
import {selectUserLoggedIn} from "../../../../../../redux/store/stateSelectors";
import {addErrorMessage, addSuccessMessage} from "../../../../../../redux/store/Messages/actions";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import {
    CompanyPresentable, DocumentRequest,
    MaterialPresentable, MaterialRequest, ProcessingStandardPresentable,
    Unit, UserPresentable
} from "@unece/cotton-fetch";
import CompanyControllerApi from "../../../../../../api/CompanyControllerApi";
import MaterialControllerApi from "../../../../../../api/MaterialControllerApi";
import TradeControllerApi from "../../../../../../api/TradeControllerApi";
import UnitControllerApi from "../../../../../../api/UnitControllerApi";
import UserControllerApi from "../../../../../../api/UserControllerApi";
import {startLoading, stopLoading} from "../../../../../../redux/store/Loading/actions";
import {getBase64, isValidEmail} from "../../../../../../utils/basicUtils";
import {useTranslation} from "react-i18next";
import {Form} from "react-bootstrap";
import {Modal} from "../../../../../GenericComponents/Modal/Modal";
import styles from "./TradeInsertion.module.scss";


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
type Props = PropsFromRedux & {
    component: any
};

//i componenti che ereditano da questo non hanno bisogno di redux o altro perchè ereditano tutto da qui

//i metodi vanno testati in questo componente, mentre negli altri che lo ereditano si testano solo i comportamenti grafici
//che sono ottenuti dalla funzione eseguita da Transaction.tsx

// questo tipo sarà in ingresso per i componenti che useranno i metodi esposti in questo componente
export type TradeInsertionChildProps = {
    // methods
    getCompanyTraders: () => void
    getMaterialsByCompany: (isInput: boolean, isForTransformation: boolean, companyName: string) => MaterialPresentable[]
    addMaterial: (item: any, positionIndex: number, isInput: boolean) => void
    getAllUnits: () => void
    getTradeProcessingStandards: () => void
    addPosition: () => void
    setMaterial: (positionIndex: number, value: MaterialPresentable) => void
    setDocument: (file: File) => void
    isMaterialMissing: (positions: Position[]) => boolean
    selectCompany: (company: {value: CompanyPresentable | undefined, label: string}) => void
    getUserFromEmailAddress: (emailAddress: string) => void
    setInvitationModalVisible: (isVisible: boolean) => void

    // getters of states
    companies: CompanyPresentable[]
    companyEmailAddresses: string[]
    allUnits: Unit[]
    tradeProcessingStandards: ProcessingStandardPresentable[]
    positions: Position[]
    materialsError: boolean[]
    companySelected: {value: CompanyPresentable | undefined, label: string}
    userSelected: UserPresentable
    consigneeEmailSelected: {value: string, label: string}
    documentUploaded: DocumentRequest
    isInvitation: boolean
}

export type Position = {
    id: number,
    material: undefined | MaterialPresentable,
    unit: undefined | Unit
}

export const TradeInsertion = (props: Props) => {
    const Component = props.component;
    const { t } = useTranslation();
    const [companies, setCompanies] = React.useState<CompanyPresentable[]>([]);
    const [materials, setMaterials] = React.useState<MaterialPresentable[]>([]);
    const [allUnits, setAllUnits] = React.useState<Unit[]>([]);
    const [tradeProcessingStandards, setTradeProcessingStandards] = React.useState<ProcessingStandardPresentable[]>([]);
    const [companyEmailAddresses, setCompanyEmailAddresses] = React.useState<string[]>([]);
    const [materialsError, setMaterialsError] = React.useState<boolean[]>([]);
    const [documentUploaded, setDocumentUploaded] = React.useState<DocumentRequest>({name: t("upload_document"), contentType:"", content:undefined});
    const [positions, setPositions] = React.useState<Position[]>([{
        id: 0,
        material: undefined,
        unit: undefined
    }]);
    const [companySelected, setCompanySelected] = React.useState<{value: CompanyPresentable | undefined, label: string}>({value: undefined, label: t("placeholders.select_company")});
    const [userSelected, setUserSelected] = React.useState<UserPresentable>({});
    const [consigneeEmailSelected, setConsigneeEmailSelected] = React.useState<{value: string, label: string}>({value: "", label: t("no_company_emails")});
    const [invitationModalVisible, setInvitationModalVisible] = React.useState<boolean>(false);
    const [invitationFieldsMissing, setInvitationFieldsMissing] = React.useState<boolean>(false);
    const [invitationEmailError, setInvitationEmailError] = React.useState<boolean>(false);
    const [isInvitation, setIsInvitation] = React.useState<boolean>(false);

    const selectCompany = async (company: {value: CompanyPresentable | undefined, label: string}) => {
        if (company.value !== undefined) {
            setCompanySelected(company);
            await getCompanyEmailAddresses(company.value.companyName);
        }
        else {
            setCompanyEmailAddresses([]);
            setCompanySelected({value: undefined, label: t("placeholders.select_company")});
            setUserSelected({});
        }
    }

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

    const getCompanyTraders = async () => {
        try {
            props.startLoading(t("popups.loading.company_traders"));
            const resp = await CompanyControllerApi.getCompanyTraders();
            resp && setCompanies(resp);
        }
        catch (error) {
            props.addErrorMessage(`${t("popups.errors.company_traders")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    };

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

    const getAllUnits = async () => {
        try {
            props.startLoading(t("popups.loading.units"));
            const resp = await UnitControllerApi.getAllUnits();
            setAllUnits(resp);
        }
        catch (error){
            props.addErrorMessage(`${t("popups.errors.units")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    };

    const getTradeProcessingStandards = async () => {
        try {
            props.startLoading(t("popups.loading.processing_standard"));
            const resp = await TradeControllerApi.getTradeProcessingStandards();
            setTradeProcessingStandards(resp);
        }
        catch (error){
            props.addErrorMessage(`${t("popups.errors.processing_standards")}: ${error}`);
        }
        finally {
            props.stopLoading();
        }
    }

    const addPosition = () => {
        setPositions(v => [...v, {
            id: v.length,
            material: undefined,
            unit: undefined
        }]);
    };

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

    const setDocument = async (file: File) => {
        getBase64(file).then(contentFile => {
            // @ts-ignore
            setDocumentUploaded({name: file.name, contentType: file.type, content: contentFile});
        });
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

    const addInvitedCompany = async () => {
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
            <Modal show={invitationModalVisible} handleClose={closeModal} handleConfirm={addInvitedCompany} title={t("trade.company_invitation")}>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>{t("trade.consignee")}</Form.Label>
                        <Form.Control type="text" placeholder={t("placeholders.trade.company_invitation")} onChange={e => setCompanySelected({value: {companyName: e.target.value, address: '-'}, label: e.target.value})}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{t("user_email")}</Form.Label>
                        <Form.Control type="email" onChange={e => setConsigneeEmailSelected({value: e.target.value, label: e.target.value})} placeholder={t("placeholders.trade.company_user_invitation")}/>
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
                getCompanyTraders={getCompanyTraders}
                getMaterialsByCompany={getMaterialsByCompany}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getTradeProcessingStandards}
                addMaterial={addMaterial}
                addPosition={addPosition}
                setMaterial={setMaterial}
                setDocument={setDocument}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}
                // getters of states
                materials={materials}
                companies={companies}
                allUnits={allUnits}
                tradeProcessingStandards={tradeProcessingStandards}
                positions={positions}
                companyEmailAddresses={companyEmailAddresses}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
            />
        </>
    );
};

export default connector(TradeInsertion);