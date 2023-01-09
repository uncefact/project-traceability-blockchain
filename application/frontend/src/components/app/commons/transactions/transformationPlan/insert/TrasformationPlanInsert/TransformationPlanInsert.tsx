import {RootState} from "../../../../../../../redux/store";
import {selectUserLoggedIn} from "../../../../../../../redux/store/stateSelectors";
import {connect, ConnectedProps} from "react-redux";
import React, {useEffect} from "react";
import styles from "./TransformationPlanInsert.module.scss";
import {Button, Form, Jumbotron} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {
    MaterialPresentable,
    MaterialRequest, ProcessingStandard, ProcessType, ProductCategory,
    TraceabilityLevelPresentable,
    TransformationPlanPositionRequest,
    TransformationPlanRequest, TransparencyLevelPresentable
} from "@unece/cotton-fetch";
import {GenericDropdownSelector} from "../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector";
import {addErrorMessage, addSuccessMessage} from "../../../../../../../redux/store/Messages/actions";
import MaterialControllerApi from "../../../../../../../api/MaterialControllerApi";
import TransformationPlanControllerApi from "../../../../../../../api/TransformationPlanControllerApi";
import TraceabilityLevelControllerApi from "../../../../../../../api/TraceabilityLevelControllerApi";
import TransparencyLevelControllerApi from "../../../../../../../api/TransparencyLevelControllerApi";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import {useHistory} from "react-router-dom";
// @ts-ignore
import Select from 'react-select';
import ProcessControllerApi from "../../../../../../../api/ProcessTypeControllerApi";
import {isSameOrAfterOrNotSet} from "../../../../../../../utils/basicUtils";
import {useTranslation} from "react-i18next";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state)
    }
);

const mapDispatch = {
    addSuccessMessage,
    addErrorMessage
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    //props
};

export const TransformationPlanInsert = (props: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const { register, handleSubmit, errors, getValues } = useForm<TransformationPlanRequest>();

    const [positionsIn, setPositionsIn] = React.useState<TransformationPlanPositionRequest[]>([{
        contractorMaterialId: undefined,
        quantity: undefined
    }]);
    const [materialIdOut, setMaterialIdOut] = React.useState<number | undefined>();

    const [availableProcessTypes, setAvailableProcessTypes] = React.useState<ProcessType[]>([]);
    const [allProcessingStandards, setAllProcessingStandards] = React.useState<ProcessingStandard[]>([]);
    const [allProductCategories, setAllProductCategories] = React.useState<ProductCategory[]>([]);

    const [availableTraceabilityLevel, setAvailableTraceabilityLevel] = React.useState<TraceabilityLevelPresentable[]>();
    const [traceabilityLevel, setTraceabilityLevel] = React.useState<string>();
    const [availableTransparencyLevel, setAvailableTransparencyLevel] = React.useState<TransparencyLevelPresentable[]>();
    const [transparencyLevel, setTransparencyLevel] = React.useState<string>();

    const [processTypesSelected, setProcessTypesSelected] = React.useState<{value: ProcessType, label: string}[]>([]);
    const [processingStandardsSelected, setProcessingStandardsSelected] = React.useState<{value: ProcessingStandard, label: string}[]>([]);
    const [productCategorySelected, setProductCategorySelected] = React.useState<{value: ProductCategory, label: string}>();

    const [isPercentageError, setIsPercentageError] = React.useState<boolean>(false);

    const [submitted, setSubmitted] = React.useState<boolean>(false);

    useEffect(() => {
        (async () => {
            await retrieveData();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const retrieveData = async () => {
        try {
            const resp = await ProcessControllerApi.getProcessTypes();
            setAvailableProcessTypes(resp);

            const resp2 = await TraceabilityLevelControllerApi.getAllTraceabilityLevel();
            setAvailableTraceabilityLevel(resp2);

            const resp3 = await TransparencyLevelControllerApi.getAllTransparencyLevel();
            setAvailableTransparencyLevel(resp3);

            const resp4 = await TransformationPlanControllerApi.getTransformationProcessingStandards();
            setAllProcessingStandards(resp4);

            const resp5 = await CertificationControllerApi.getAllProductCategories();
            setAllProductCategories(resp5);
        }
        catch (error) {
            props.addErrorMessage(`${t("popups.errors.transformation_info")}: ${error}`);
        }
    };

    const retrieveOutputMaterials = async () => retrieveMaterials(false);

    const retrieveInputMaterials = async () => retrieveMaterials(true);

    const retrieveMaterials = async (isInput: boolean) => {
        let resp:MaterialPresentable[] = [];
        try {
            resp = await MaterialControllerApi.getMaterialsByCompany({
                company: props.userLoggedIn?.company?.companyName || "",
                isInput: isInput,
                isForTransformation:true
            });
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.materials_from_company")}: ${error}`);
        }
        return resp
    };

    const addMaterial = async (item: any, isInput: boolean) => {
        try {
            let materialRequest: MaterialRequest = {
                name: item.name,
                companyName: props.userLoggedIn?.company?.companyName || "",
                input: isInput
            };
            const resp = await MaterialControllerApi.addMaterialFromCompany({
                materialRequest: materialRequest
            });
            props.addSuccessMessage(t("popups.success.material_add"));
            return resp;
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.material_add")}: ${error}`);
        }
    }

    const selectNewMaterialIn = async (item: any, index: number) => {
        const resp = await addMaterial(item, true);
        if (resp && resp.id)
            setMaterialIdPositionIn(resp.id, index);
        else
            throw new Error("Material already exists!");
    }

    const selectNewMaterialOut = async (item: any) => {
        const resp = await addMaterial(item, false);
        if (resp && resp.id)
            setMaterialIdOut(resp.id);
        else
            throw new Error("Material already exists!");
    }

    const setMaterialIdPositionIn = (materialId: number, positionInIndex: number) => {
        setPositionsIn(positions => {
            positions[positionInIndex].contractorMaterialId = materialId;
            return positions;
        })
    }

    const increasePositionsIn = () => setPositionsIn(v => [...v, {
        contractorMaterialId: undefined,
        quantity: undefined
    }]);

    const positionsInList = positionsIn.map((p: TransformationPlanPositionRequest, index: number) =>
        <div key={"positionIn_"+index} className={styles.PositionRowContainer}>
            <Form.Group>
                <Form.Label>{`${t("material")} (${t("input")})`}</Form.Label>
                <GenericDropdownSelector
                    getItems={retrieveInputMaterials}
                    itemPropToShow={'name'}
                    selectItem={item => setMaterialIdPositionIn(item.id, index)}
                    defaultText={'Select Material'}
                    newItemFields={['name']}
                    onCreate={async (item) => await selectNewMaterialIn(item, index)}
                    creationTitle={t("material_name")}
                    createDisabled={item => !item?.name}
                    required={true}
                />
                {
                    submitted && positionsIn[index].contractorMaterialId===undefined &&
                    <div className={styles.ErrorText}>{t("errors.select_material")}</div>
                }
            </Form.Group>
            <Form.Group>
                <Form.Label>{t("transformation_plan.value")}</Form.Label>
                <Form.Control name={`positionRequestList[${index}].quantity`} ref={register({required: true})} type="number" min="0" step="0.01" placeholder={t("placeholders.transformation_plan.percentage")} defaultValue={positionsIn?.length === 1 ? 100 : undefined}/>
                {
                    errors?.positionRequestList?.[index]?.quantity && errors?.positionRequestList?.[index]?.quantity?.type === "required" &&
                    <div className={styles.ErrorText}>{t("errors.percentage")}</div>
                }
            </Form.Group>
        </div>
    );

    const onSubmit = async (transformationPlanRequest: TransformationPlanRequest) => {
        setSubmitted(true);
        if(processTypesSelected.length === 0|| (transparencyLevel?.startsWith("2") && !traceabilityLevel?.startsWith("3"))) {
            return;
        }
        // else if (transformationPlanRequest?.positionRequestList && transformationPlanRequest.positionRequestList.reduce((acc, curr) => acc + Number(curr.quantity), 0) > 100){
        //     setIsPercentageError(true);
        //     return;
        // }

        if (transformationPlanRequest.validUntil === null || transformationPlanRequest.validUntil === undefined)
            transformationPlanRequest.validUntil = transformationPlanRequest.validFrom;
        transformationPlanRequest.processingStandardList = processingStandardsSelected.map( p => p.value.name || '');
        transformationPlanRequest.productCategoryCode = productCategorySelected?.value.code;
        transformationPlanRequest.positionRequestList = transformationPlanRequest.positionRequestList
                                    ?.map((positionRequest, index) => {
                                        const position = positionsIn[index];
                                        return {
                                            contractorMaterialId: position?.contractorMaterialId,
                                            quantity: Number(positionRequest.quantity)
                                        }
                                    }) || [];
        transformationPlanRequest.positionRequestList.push({
            contractorMaterialId: materialIdOut,
            quantity: 100
        })
        transformationPlanRequest.processCodeList = processTypesSelected.map( p => p.value.code || '');

        transformationPlanRequest.traceabilityLevelName = traceabilityLevel;
        transformationPlanRequest.transparencyLevelName = transparencyLevel;

        try {
            await TransformationPlanControllerApi.createTransformationPlan({
                transformationPlanRequest
            });
            props.addSuccessMessage(`${t("popups.success.transformation_create")}: ${transformationPlanRequest.name}`);
            history.push("/");
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.transformation_insert")}: ${error}`);
        }
    }

    const processesSelectOptions = availableProcessTypes !== undefined ? availableProcessTypes.map(p => ({value: p, label: p.code +' - '+p.name})) : [];

    return(
        <Jumbotron className={styles.Container}>
            <h2>{t("transformation")}</h2>
            <Form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className={styles.NameArea}>
                    <Form.Label>{t("name")}</Form.Label>
                    <Form.Control name="name" ref={register({required: true})} placeholder={t("placeholders.transformation_plan.name")} />
                    {
                        errors.name && errors.name.type === "required" &&
                        <div className={styles.ErrorText}>{t("errors.transformation_plan.name")}</div>
                    }
                </Form.Group>
                <Form.Group className={styles.OutArea}>
                    <Form.Label>{`${t("material")} (${t("output")})`}</Form.Label>
                    <GenericDropdownSelector
                        getItems={retrieveOutputMaterials}
                        itemPropToShow={'name'}
                        selectItem={item => setMaterialIdOut(item.id)}
                        defaultText={'Select Material'}
                        newItemFields={['name']}
                        onCreate={async (item) => await selectNewMaterialOut(item)}
                        creationTitle={t("material_name")}
                        createDisabled={item => !item?.name}
                        required={true}
                    />
                    {
                        submitted && materialIdOut===undefined &&
                        <div className={styles.ErrorText}>{t("errors.transformation_plan.output_material")}</div>
                    }
                </Form.Group>
                <Form.Group className={styles.ProcessingStandardArea}>
                    <Form.Label>{t("reference_standards")}</Form.Label>
                    <Select
                        isMulti
                        value={processingStandardsSelected}
                        onChange={setProcessingStandardsSelected}
                        options={allProcessingStandards !== undefined ? allProcessingStandards.map(ps => ({value: ps, label: ps.name})) : []}
                    />
                </Form.Group>
                <Form.Group className={styles.ProductCategoryArea}>
                    <Form.Label>{t("certification.product_category")}</Form.Label>
                    <Select
                        value={productCategorySelected}
                        onChange={setProductCategorySelected}
                        options={allProductCategories !== undefined ? allProductCategories.map(pc => ({value: pc, label: pc.code + " - " + pc.name})) : []}
                    />
                </Form.Group>
                <Form.Group className={styles.ProcessTypesArea}>
                    <Form.Label>{t("certification.process_types")}</Form.Label>
                    <Select
                        isMulti
                        value={processTypesSelected}
                        onChange={setProcessTypesSelected}
                        options={processesSelectOptions}
                    />
                    {
                        submitted && processTypesSelected.length===0 &&
                        <div className={styles.ErrorText}>{t("errors.transformation_plan.process_type")}</div>
                    }
                </Form.Group>
                <Form.Group className={styles.TraceabilityLevelArea}>
                    <Form.Label>{t("transformation_plan.traceability_level")}</Form.Label>
                    <Select
                        value={traceabilityLevel ? {
                            value: traceabilityLevel,
                            label: traceabilityLevel
                        } : null}
                        onChange={(e : any) => setTraceabilityLevel(e.value)}
                        options={availableTraceabilityLevel?.map(t => ({value: t.name, label: t.name}))}
                    />
                    {
                        submitted && !traceabilityLevel &&
                        <div className={styles.ErrorText}>{t("errors.transformation_plan.traceability_level")}</div>
                        || submitted && (transparencyLevel?.startsWith("2") && !traceabilityLevel?.startsWith("3")) &&
                        <div className={styles.ErrorText}>{`${t("errors.transformation_plan.wrong_traceability_level")} ${transparencyLevel}`}</div>
                    }
                </Form.Group>
                <Form.Group className={styles.TransparencyLevelArea}>
                    <Form.Label>{t("transformation_plan.transparency_level")}</Form.Label>
                    <Select
                        value={transparencyLevel ? {
                            value: transparencyLevel,
                            label: transparencyLevel
                        } : null}
                        onChange={(e : any) => setTransparencyLevel(e.value)}
                        options={availableTransparencyLevel?.map(t => ({value: t.name, label: t.name}))}
                    />
                    {
                        submitted && !transparencyLevel &&
                        <div className={styles.ErrorText}>{t("errors.transformation_plan.transparency_level")}</div>
                    }
                </Form.Group>
                <Form.Group className={styles.ValidFromArea}>
                    <Form.Label>{t("transformation_plan.start_date")}</Form.Label>
                    <Form.Control type="date" name="validFrom" ref={register({required: true, valueAsDate: true})} placeholder={t("placeholders.date")}/>
                    {
                        errors.validFrom &&
                        <div className={styles.ErrorText}>{t("errors.valid_from")} </div>
                    }
                </Form.Group>
                <Form.Group className={styles.ValidUntilArea}>
                    <Form.Label>{t("transformation_plan.end_date")}</Form.Label>
                    <Form.Control type="date" name="validUntil" placeholder={t("placeholders.date")} ref={register({required: false, valueAsDate: true, validate: value => isSameOrAfterOrNotSet(value, getValues("validFrom"))})} />
                </Form.Group>
                <Form.Group className={styles.NotesArea}>
                    <Form.Label>{t("notes")}</Form.Label>
                    <Form.Control name="notes" ref={register({required: false})} as="textarea" type="text" placeholder={t("placeholders.notes")}/>
                    <Form.Text className="text-muted">
                        {`${t("max_characters")}: 250`}
                    </Form.Text>
                    {
                        errors.notes &&
                        <div className={styles.ErrorText}>{t("notes_mandatory")}</div>
                    }
                </Form.Group>
                <hr/>
                <h4 className={styles.AddPositionArea}>{t("line_items")}
                    <Button variant="secondary" className={styles.AddPosition} onClick={increasePositionsIn}>+</Button>
                </h4>
                <div className={styles.PositionsArea}>
                    {positionsInList}
                    {/*{ submitted && isPercentageError &&*/}
                    {/*    <div className={`${styles.ErrorText} mt-n4 mb-3`}>{t("errors.max_percentage")}</div>*/}
                    {/*}*/}
                </div>
                <div className={styles.SubmitArea}>
                    <Button variant="primary" type="submit">
                        {t("submit")}
                    </Button>
                </div>
            </Form>
        </Jumbotron>

    )
}

export default connector(TransformationPlanInsert);