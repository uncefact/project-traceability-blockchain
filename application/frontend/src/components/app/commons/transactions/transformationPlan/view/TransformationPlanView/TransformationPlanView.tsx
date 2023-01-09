import React, {useEffect} from "react";
import {Button, Form, InputGroup, Jumbotron, ListGroup} from "react-bootstrap";
import {
    ConfirmationCertificationPresentable,
    PositionPresentable,
    ProcessingStandard,
    ProcessType,
    TraceabilityLevelPresentable,
    TransformationPlanPresentable,
    TransformationPlanUpdateRequest,
    TransparencyLevelPresentable,
} from "@unece/cotton-fetch";
import styles from "./TransformationPlanView.module.scss";
import {addErrorMessage, addSuccessMessage} from "../../../../../../../redux/store/Messages/actions";
import {startLoading, stopLoading} from "../../../../../../../redux/store/Loading/actions";
import {connect, ConnectedProps} from "react-redux";
import TransformationPlanControllerApi from "../../../../../../../api/TransformationPlanControllerApi";
import TransparencyLevelControllerApi from "../../../../../../../api/TransparencyLevelControllerApi";
import TraceabilityLevelControllerApi from "../../../../../../../api/TraceabilityLevelControllerApi";
import {useHistory, useRouteMatch} from "react-router-dom";
import {AiFillEdit, AiTwotoneDelete} from "react-icons/ai";
// @ts-ignore
import Select from 'react-select';
import {useForm} from "react-hook-form";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import CompanyControllerApi from "../../../../../../../api/CompanyControllerApi";
import {Modal} from "../../../../../../GenericComponents/Modal/Modal";
import {selectCompanyIndustrialSector} from "../../../../../../../redux/store/stateSelectors";
import {RootState} from "../../../../../../../redux/store";
import {useTranslation} from "react-i18next";
import {TRANSFORMATION_PLAN_PATH} from "../../../../../../../routes/Routes";
import {isValidEmail} from "../../../../../../../utils/basicUtils";
import {ProcessingStandardPresentable} from "../../../../../../../../clients/unece-cotton-fetch";

const mapState = () => (state: RootState) => (
    {
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
};


export const TransformationPlanView = (props: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const { handleSubmit } = useForm<TransformationPlanUpdateRequest>();

    const match = useRouteMatch('/:companyIndustry' + TRANSFORMATION_PLAN_PATH);
    // @ts-ignore
    const idParam = match?.params.id;
    const [invitationModalVisible, setInvitationModalVisible] = React.useState<boolean>(false);
    const [invitationEmailError, setInvitationEmailError] = React.useState<boolean>(false);
    const [invitationFieldsMissing, setInvitationFieldsMissing] = React.useState<boolean>(false);
    const [companyInvitedName, setCompanyInvitedName] = React.useState<string>();
    const [userInvitedEmail, setUserInvitedEmail] = React.useState<string>();

    const [transformationPlan, setTransformationPlan] = React.useState<TransformationPlanPresentable>({});
    const [editMode, setEditMode] = React.useState<boolean>(false);
    const [availableTransparencyLevels, setAvailableTransparencyLevels] = React.useState<TransparencyLevelPresentable[]>();
    const [transparencyLevelSelected, setTransparencyLevelSelected] = React.useState<string>();

    const [availableTraceabilityLevels, setAvailableTraceabilityLevels] = React.useState<TraceabilityLevelPresentable[]>();
    const [traceabilityLevelSelected, setTraceabilityLevelSelected] = React.useState<string>();

    const [allProcessingStandards, setAllProcessingStandards] = React.useState<ProcessingStandardPresentable[]>([]);
    const [processingStandards, setProcessingStandards] = React.useState<ProcessingStandardPresentable[]>([]);
    const [processingStandardsSelected, setProcessingStandardsSelected] = React.useState<{value: ProcessingStandard, label: string | undefined}[]>([]);

    const [submitted, setSubmitted] = React.useState<boolean>(false);

    const [transformationCertificates, setTransformationCertificates] = React.useState<ConfirmationCertificationPresentable[]>([]);

    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

    const getTransformationPlan = async () => {
        let resp;
        try {
            props.startLoading(t("popups.loading.transformation_plan"));
            resp = await TransformationPlanControllerApi.getTransformationPlan({id: idParam});
            setTransformationPlan(resp);
        }
        catch(error){
            props.addErrorMessage(`${t("popups.errors.transformation")}: ${error}`);
        }
        finally {
            props.stopLoading();
        }
    }

    const handleUpdate = async (updateRequest: TransformationPlanUpdateRequest) => {
        setSubmitted(true);

        if ((transparencyLevelSelected?.startsWith("2") && !traceabilityLevelSelected?.startsWith("3")))
            return;

        updateRequest.traceabilityLevelName = traceabilityLevelSelected;
        updateRequest.transparencyLevelName = transparencyLevelSelected;
        updateRequest.processingStandardList = processingStandardsSelected?.map(p => p.value.name || '');

        try {
            // @ts-ignore
            await TransformationPlanControllerApi.updateTransformationPlan({
                transformationPlanUpdateRequest: updateRequest,
                id: idParam
            });
            props.addSuccessMessage(`${t("popups.success.transformation_update")}: ${transformationPlan.name}`);
            history.push("/");
        }
        catch(error){
            props.addErrorMessage(`${t("popups.errors.transformation_update")}: ${error}`);
        }
    }

    const retrieveInformationToUpdate = async () => {
        setEditMode(true);

        try {
            props.startLoading(t("popups.loading.transformation_plan_update"));
            const traceabilityLevels = await TraceabilityLevelControllerApi.getAllTraceabilityLevel();
            setAvailableTraceabilityLevels(traceabilityLevels);
            setTraceabilityLevelSelected(transformationPlan.traceabilityLevel);

            const transparencyLevels = await TransparencyLevelControllerApi.getAllTransparencyLevel();
            setAvailableTransparencyLevels(transparencyLevels);
            setTransparencyLevelSelected(transformationPlan.transparencyLevel);
            const processingStandards = await TransformationPlanControllerApi.getTransformationProcessingStandards();
            setAllProcessingStandards(processingStandards);
            // remove the processing standards already selected
            const processingStandardsFiltered = processingStandards.filter(ps => !transformationPlan.processingStandardList?.find(ps1 => ps.name === ps1.name));
            setProcessingStandards(processingStandardsFiltered);
            // @ts-ignore
            setProcessingStandardsSelected(transformationPlan.processingStandardList?.map(ps => ({value: ps, label: ps.name})));
        }
        catch (error) {
            props.addErrorMessage(`${t("popups.errors.transformation_info")}: ${error}`);
        }
        finally {
            props.stopLoading();
        }
    }

    const handleProcessingStandardsChange = (standards: any) => {
        const processingStandardsFiltered = allProcessingStandards
            .filter(ps => !standards.find((ps1: { value: ProcessingStandard }) => ps.name === ps1.value.name));
        setProcessingStandards(processingStandardsFiltered)
        setProcessingStandardsSelected(standards);
    }

    const getTransformationCertificates = async () => {
        try {
            props.startLoading(t("popups.loading.certificates"));
            const resp = await  CertificationControllerApi.getCertificationsByTransactionId({
                transactionType: 'transformation',
                id: idParam
            });
            resp && resp.length && resp.length>0 && setTransformationCertificates(resp);
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.certificates")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    }

    const deleteTransformation = async () => {
        try {
            setDeleteModalVisible(false);
            props.startLoading(t("popups.loading.transformation_delete"));
            await TransformationPlanControllerApi.deleteTransformationPlan({
                id: idParam
            })
            props.addSuccessMessage(t("popups.success.transformation_delete"));
            history.push('/');
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.transformation_delete")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    }

    const closeModal = () => {
        setInvitationModalVisible(false);
        setInvitationEmailError(false);
        setInvitationFieldsMissing(false);
        setCompanyInvitedName(undefined);
        setUserInvitedEmail(undefined);
    }

    const addInvitedCompany = async () => {
        if (companyInvitedName && userInvitedEmail) {
            if (isValidEmail(userInvitedEmail)){
                setInvitationModalVisible(false);
                setInvitationEmailError(false);
                try {
                    await CompanyControllerApi.postSupplierInvitation({
                        totalOnboardingRequest: {
                            companyName: companyInvitedName,
                            userEmailAddress: userInvitedEmail
                        }
                    });
                    props.addSuccessMessage(t("popups.success.invitation"));
                }
                catch (error) {
                    props.addErrorMessage(`${t("popups.errors.company_invitation")}: ${error}`)
                }
            }
            else {
                setInvitationEmailError(true);
                setInvitationFieldsMissing(false);
            }
        }
        else {
            setInvitationFieldsMissing(true);
        }
    }

    useEffect(() => {
        (async () => {
            await getTransformationPlan();
            await getTransformationCertificates();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <Modal show={deleteModalVisible} handleClose={() => setDeleteModalVisible(false)} handleConfirm={deleteTransformation} title={t("transformation_plan.delete")}>
                {t("transformation_plan.delete_confirm")}
            </Modal>
            <Modal show={invitationModalVisible} handleClose={closeModal} handleConfirm={addInvitedCompany} title={t("transformation_plan.supplier_invitation")}>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>{t("supplier")}</Form.Label>
                        <Form.Control type="text" placeholder={t("placeholders.transformation_plan.supplier_invitation")} onChange={e => setCompanyInvitedName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{t("user_email")}</Form.Label>
                        <Form.Control type="email" onChange={e => setUserInvitedEmail(e.target.value)} placeholder={t("placeholders.trade.company_user_invitation")}/>
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
            <Jumbotron className={styles.Container}>
                <div className={styles.TitleSection}>
                    <h2>{t("transformation")}</h2>
                    <div className={styles.ActionsContainer}>
                        {
                            !editMode && <h4 className={styles.Click} onClick={retrieveInformationToUpdate}>{t("edit")}<AiFillEdit/></h4>
                        }
                        <h4 className={styles.Click} onClick={() => setDeleteModalVisible(true)}>{t("delete")}<AiTwotoneDelete/></h4>
                    </div>

                </div>

                <Form className={styles.Form} onSubmit={handleSubmit(handleUpdate)}>
                    <Form.Group className={styles.NameArea}>
                        <Form.Label>{t("name")}</Form.Label>
                        <Form.Control type="text" value={transformationPlan?.name} disabled/>
                    </Form.Group>
                    <Form.Group className={styles.OutputMaterialArea}>
                        <Form.Label>{`${t("material")} (${t("output")})`}</Form.Label>
                        <Form.Control type="text" value={transformationPlan?.outputMaterial?.name} disabled/>
                        <Button className={styles.ShowSupplyChainBtn} variant="primary" style={{marginTop:"10px"}} onClick={()=>{history.push('/' + props.companyIndustrialSector + '/graph/'+transformationPlan.outputMaterial?.id)}}>
                            {t("show_chain")}
                        </Button>
                    </Form.Group>

                    <Form.Group className={styles.ProcessingStandardArea}>
                        <Form.Label>{t("reference_standards")}</Form.Label>
                        { editMode ?
                            <Select
                                isMulti
                                value={processingStandardsSelected}
                                onChange={handleProcessingStandardsChange}
                                options={processingStandards !== undefined ? processingStandards.map(ps => ({value: ps, label: ps.name})) : []}
                            />
                            :
                            <ListGroup variant="flush">
                                {
                                    // @ts-ignore
                                    transformationPlan?.processingStandardList?.length > 0 && transformationPlan.processingStandardList.map((ps: ProcessingStandard, index: number) => {
                                        return <ListGroup.Item className={styles.List} disabled key={index}>{ps.name}</ListGroup.Item>
                                    })
                                }
                                { transformationPlan?.processingStandardList?.length === 0 && <ListGroup.Item className={styles.List} disabled>{t("transformation_plan.no_reference_standards")}</ListGroup.Item> }
                            </ListGroup>
                        }
                    </Form.Group>

                    <Form.Group className={styles.ProductCategoryArea}>
                        <Form.Label>{t("certification.product_category")}</Form.Label>
                        <Form.Control type="text" placeholder={t("certification.no_product_category")} value={transformationPlan?.productCategory?.code !== undefined ? transformationPlan?.productCategory?.code + " - " + transformationPlan?.productCategory?.name : undefined} disabled/>
                    </Form.Group>

                    <Form.Group className={styles.ProcessTypesArea}>
                        <Form.Label>{t("certification.process_types")}</Form.Label>
                        <ListGroup variant="flush">
                            {
                                // @ts-ignore
                                transformationPlan?.processTypeList?.length > 0 && transformationPlan.processTypeList.map((pt: ProcessType, index: number) => {
                                    return <ListGroup.Item className={styles.List} disabled key={index}>{pt.code + " - " + pt.name}</ListGroup.Item>
                                })
                            }
                            { transformationPlan?.processTypeList?.length === 0 && <ListGroup.Item className={styles.List} disabled>{t("certification.no_process_types")}</ListGroup.Item> }
                        </ListGroup>
                    </Form.Group>
                    <Form.Group className={styles.TraceabilityLevelArea}>
                        <Form.Label>{t("transformation_plan.traceability_level")}</Form.Label>
                        { editMode ?
                            <Select
                                value={traceabilityLevelSelected ? {
                                    value: traceabilityLevelSelected,
                                    label: traceabilityLevelSelected
                                } : null}
                                onChange={(e: any) => setTraceabilityLevelSelected(e.value)}
                                options={availableTraceabilityLevels?.map(t => ({value: t.name, label: t.name}))}
                            />
                            :
                            <div>{transformationPlan?.traceabilityLevel}</div>
                        }
                        {
                            submitted && (transparencyLevelSelected?.startsWith("2") && !traceabilityLevelSelected?.startsWith("3")) &&
                            <div className={styles.ErrorText}>{`${t("errors.transformation_plan.wrong_traceability_level")} ${transparencyLevelSelected}`}</div>
                        }
                    </Form.Group>
                    <Form.Group className={styles.TransparencyLevelArea}>
                        <Form.Label>{t("transformation_plan.transparency_level")}</Form.Label>
                        { editMode ?
                            <Select
                                value={transparencyLevelSelected ? {
                                    value: transparencyLevelSelected,
                                    label: transparencyLevelSelected
                                } : null}
                                onChange={(e: any) => setTransparencyLevelSelected(e.value)}
                                options={availableTransparencyLevels?.map(t => ({value: t.name, label: t.name}))}
                            />
                            :
                            <div>{transformationPlan?.transparencyLevel}</div>
                        }
                    </Form.Group>

                    <Form.Group className={styles.NotesArea}>
                        <Form.Label>{t("notes")}</Form.Label>
                        <Form.Control as="textarea" placeholder={t("placeholders.no_notes")} value={transformationPlan?.notes} disabled/>
                    </Form.Group>

                    <Form.Group className={styles.ValidFromArea}>
                        <Form.Label>{t("transformation_plan.start_date")}</Form.Label>
                        <Form.Control type="text" value={transformationPlan?.validFrom?.toLocaleDateString()} disabled/>
                    </Form.Group>
                    <Form.Group className={styles.ValidUntilArea}>
                        <Form.Label>{t("transformation_plan.end_date")}</Form.Label>
                        <Form.Control type="text" value={transformationPlan?.validUntil?.toLocaleDateString()} disabled/>
                    </Form.Group>
                    {
                        // @ts-ignore
                        transformationPlan?.inputPositions?.length > 0 &&
                        <div className={styles.PositionsTitleArea}>
                            <hr/>
                            <h4>{t("line_items")}</h4>
                        </div>
                    }
                    <div className={styles.PositionsContainer}>
                        {
                            transformationPlan?.inputPositions?.map((position: PositionPresentable, index: number) => {
                                return <div key={index} className={styles.PositionsArea}>
                                    <Form.Group className={styles.InputMaterialName}>
                                        <Form.Label>{`${t("material")} (${t("input")})`}</Form.Label>
                                        <Form.Control type="text" value={position.contractorMaterialName} disabled/>
                                    </Form.Group>
                                    <Form.Group className={styles.InputMaterialSupplier}>
                                        <Form.Label>{t("supplier")}</Form.Label>
                                        { position.contractorSupplierName ?
                                            <Form.Control type="text" value={position.contractorSupplierName} disabled/>
                                            :
                                            <InputGroup>
                                                <Form.Control type="text" placeholder={t("placeholders.transformation_plan.no_supplier")} disabled/>
                                                <Button variant="primary" onClick={() => setInvitationModalVisible(true)}>{t("transformation_plan.invite_supplier")}</Button>
                                            </InputGroup>
                                        }
                                    </Form.Group>
                                    <Form.Group className={styles.InputMaterialPercentage}>
                                        <Form.Label>{t("transformation_plan.value")}</Form.Label>
                                        <Form.Control type="text" value={position.quantity} disabled/>
                                    </Form.Group>
                                </div>
                            })
                        }
                    </div>

                    <div className={styles.CertificatesArea}>
                        <Form.Label>{t("certificates")}</Form.Label>
                        <div className={styles.ButtonsContainer}>
                            {
                                transformationCertificates.length>0
                                    ? transformationCertificates.map((certificate, index) => {
                                        const refStd = certificate?.processingStandardName;
                                        const certType = certificate?.subject?.toLowerCase();
                                        return (
                                            <Button className={styles.CertificateButton} key={'cert_id'} variant="primary" onClick={() => {history.push(`/${props.companyIndustrialSector}/certifications/${certType}/${certificate.id}/confirmation`)}}>
                                                {t("show_certificate")} {transformationCertificates.length > 1 ? index : ''} {refStd && '- '+refStd}
                                            </Button>
                                        )
                                    })
                                    : t("no_certificates")
                            }
                        </div>
                    </div>

                    { editMode &&
                    <div className={styles.ConfirmArea}>
                        <Button variant="primary" className="mr-2 bg-danger border-danger" onClick={() => setEditMode(false)}>{t("cancel")}</Button>
                        <Button variant="primary" type="submit">{t("confirm")}</Button>
                    </div>
                    }

                </Form>
            </Jumbotron>
        </>
    );
};

export default connector(TransformationPlanView);
