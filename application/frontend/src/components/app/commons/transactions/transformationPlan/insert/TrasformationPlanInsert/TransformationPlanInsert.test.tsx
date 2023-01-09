import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import React from "react";
import {Provider} from "react-redux";
import CNTP, {TransformationPlanInsert} from './TransformationPlanInsert'
import {mocked} from "ts-jest/utils";
import {useForm} from "react-hook-form";
import {Button, Form} from "react-bootstrap";
import {GenericDropdownSelector} from "../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector";
import {act} from "react-dom/test-utils";
import MaterialControllerApi from "../../../../../../../api/MaterialControllerApi";
import TransformationPlanControllerApi from "../../../../../../../api/TransformationPlanControllerApi";
import {useHistory} from "react-router-dom";
import ProcessTypeControllerApi from "../../../../../../../api/ProcessTypeControllerApi";
// @ts-ignore
import Select from 'react-select';
import {isSameOrAfterOrNotSet} from "../../../../../../../utils/basicUtils";
import TraceabilityLevelControllerApi from "../../../../../../../api/TraceabilityLevelControllerApi";
import TransparencyLevelControllerApi from "../../../../../../../api/TransparencyLevelControllerApi";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn()
    }
});

jest.mock('react-hook-form', () => {
    return {
        useForm: jest.fn(),
    }
});
jest.mock('../../../../../../../utils/basicUtils', () => {
    return {
        isSameOrAfterOrNotSet: jest.fn(),
    }
});

jest.mock('../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector', () => {
    return {
        GenericDropdownSelector: jest.fn().mockImplementation(({children}) => <div className={'GenericDropdownSelector'}>{children}</div>),
    }
});

jest.mock('../../../../../../../api/MaterialControllerApi', () => {
    return {
        getMaterialsByCompany: jest.fn(),
        addMaterialFromCompany: jest.fn(),
    }
});

jest.mock('../../../../../../../api/CertificationControllerApi', () => {
    return {
        getAllProductCategories: jest.fn(),
    }
});

jest.mock('../../../../../../../api/TransformationPlanControllerApi', () => {
    return {
        createTransformationPlan: jest.fn(),
        getTransformationProcessingStandards: jest.fn(),
    }
});
jest.mock('react-select', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'Select'}>{children}</div>)
});
jest.mock('../../../../../../../api/ProcessTypeControllerApi', () => {
    return {
        getProcessTypes: jest.fn(),
    }
});

jest.mock('../../../../../../../api/TraceabilityLevelControllerApi', () => {
    return {
        getAllTraceabilityLevel: jest.fn(),
    }
});
jest.mock('../../../../../../../api/TransparencyLevelControllerApi', () => {
    return {
        getAllTransparencyLevel: jest.fn(),
    }
});

jest.mock('react-bootstrap', () => {
    let Button = jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>);
    let Form = jest.fn().mockImplementation(({children}) => <div className={'Form'}>{children}</div>);
    let Jumbotron = jest.fn().mockImplementation(({children}) => <div className={'Jumbotron'}>{children}</div>);

    // @ts-ignore
    Form.Group = jest.fn().mockImplementation(({children}) => <div className={'FormGroup'}>{children}</div>);
    // @ts-ignore
    Form.Label = jest.fn().mockImplementation(({children}) => <div className={'FormLabel'}>{children}</div>);
    // @ts-ignore
    Form.Control = jest.fn().mockImplementation(({children}) => <div className={'FormControl'}>{children}</div>);
    // @ts-ignore
    Form.Text = jest.fn().mockImplementation(({children}) => <div className={'FormText'}>{children}</div>);
    // @ts-ignore
    Form.File = jest.fn().mockImplementation(({children}) => <div className={'FormFile'}>{children}</div>);

    return {
        Button,
        Form,
        Jumbotron
    };
});

describe('TransformationPlanInsert test', () => {
    const mockedRegister = jest.fn();
    const mockedHandleSubmit = jest.fn();
    // @ts-ignore
    const mockedErrors = [];
    const MockedUseForm = mocked(useForm, true);
    const MockedFormGroup = mocked(Form.Group, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedGenericDropdownSelector = mocked(GenericDropdownSelector, true);
    const MockedButton = mocked(Button, true);
    const MockedGetMaterialsFromCompany = mocked(MaterialControllerApi.getMaterialsByCompany, true);
    const MockedAddMaterialFromCompany = mocked(MaterialControllerApi.addMaterialFromCompany, true);
    const MockedGetTransformationProcessingStandard = mocked(TransformationPlanControllerApi.getTransformationProcessingStandards, true);
    const MockedCreateTransformationPlan = mocked(TransformationPlanControllerApi.createTransformationPlan, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedGetProcessTypes = mocked(ProcessTypeControllerApi.getProcessTypes, true);
    const MockedSelect = mocked(Select, true);
    const MockedIsAfterDate = mocked(isSameOrAfterOrNotSet, true);
    const MockedGetAllTraceabilityLevel = mocked(TraceabilityLevelControllerApi.getAllTraceabilityLevel, true);
    const MockedGetAllTransparencyLevel = mocked(TransparencyLevelControllerApi.getAllTransparencyLevel, true);
    const MockedGetAllProductCategories = mocked(CertificationControllerApi.getAllProductCategories, true);

    // @ts-ignore
    MockedUseForm.mockReturnValue({
        register: mockedRegister,
        handleSubmit: mockedHandleSubmit,
        // @ts-ignore
        errors: mockedErrors,
        getValues: jest.fn(),
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        await act(async () => {
            await mount(
                <Provider store={store}>
                    <CNTP/>
                </Provider>
            );
        });
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    userLoggedIn={null}
                    addSuccessMessage={jest.fn()}
                    addErrorMessage={jest.fn()}/>
            )
        });
    });
    it('Initial content test', async () => {
        const processTypes = [
            {code: 'PR1', name: 'Process1Test'},
            {code: 'PR2', name: 'Process2Test'}
        ];
        MockedGetProcessTypes.mockReturnValue(Promise.resolve(processTypes));
        const processingStandards = [
            { name: "Processing standard 1" },
            { name: "Processing standard 2" },
        ];
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve(processingStandards));
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    userLoggedIn={null}
                    addSuccessMessage={jest.fn()}
                    addErrorMessage={jest.fn()}/>
            )
        });
        expect(MockedFormGroup).toHaveBeenCalledTimes(48);
        expect(MockedFormLabel).toHaveBeenCalledTimes(48);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(48,{children: 'transformation_plan.value'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(47,{children: 'material (input)'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(46,{children: 'notes'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(45,{children: 'transformation_plan.end_date'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(44,{children: 'transformation_plan.start_date'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(43,{children: 'transformation_plan.transparency_level'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(42,{children: 'transformation_plan.traceability_level'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(41,{children: 'certification.process_types'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(40,{children: 'certification.product_category'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(39,{children: 'reference_standards'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(38,{children: 'material (output)'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(37,{children: 'name'}, {});

        expect(MockedSelect).toHaveBeenCalledTimes(20);
    });

    it('retrieveData failed test', async () => {
        const addErrorMessage = jest.fn();
        MockedGetProcessTypes.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            mount(
                <TransformationPlanInsert
                    userLoggedIn={null}
                    addSuccessMessage={jest.fn()}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.transformation_info: Generic error");
    });

    it('increasePositionsIn test', async () => {
        MockedGetProcessTypes.mockReturnValue(Promise.resolve([]));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    userLoggedIn={null}
                    addSuccessMessage={jest.fn()}
                    addErrorMessage={jest.fn()}/>
            )
        });
        expect(MockedFormGroup).toHaveBeenCalledTimes(48);
        expect(MockedFormLabel).toHaveBeenCalledTimes(48);
        expect(MockedButton).toHaveBeenCalledTimes(8);
        MockedFormGroup.mockClear();
        MockedFormLabel.mockClear();
        await act(async () => {
            // @ts-ignore
            await MockedButton.mock.calls[6][0].onClick();
        });
        expect(MockedFormGroup).toHaveBeenCalledTimes(14);
        expect(MockedFormLabel).toHaveBeenCalledTimes(14);
    });
    it('retrieveMaterials test', async () => {
        MockedGetProcessTypes.mockReturnValue(Promise.resolve([]));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addErrorMessage = jest.fn();
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={jest.fn()}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(8);
        // @ts-ignore
        MockedGetMaterialsFromCompany.mockReturnValue('respTest');
        let resp = null;
        await act(async () => {
            // @ts-ignore
            resp = await MockedGenericDropdownSelector.mock.calls[0][0].getItems();
        });
        expect(resp).toEqual('respTest');
        expect(MockedGetMaterialsFromCompany).toHaveBeenCalledTimes(1);
        expect(MockedGetMaterialsFromCompany).toHaveBeenNthCalledWith(1, {
            company: userLoggedIn.company.companyName,
            isInput: false,
            isForTransformation: true
        });

        //Error
        MockedGetMaterialsFromCompany.mockImplementation(() => {
            throw 'GENERIC_ERROR';
        });
        await act(async () => {
            // @ts-ignore
            resp = await MockedGenericDropdownSelector.mock.calls[0][0].getItems();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, 'popups.errors.materials_from_company: GENERIC_ERROR');
        expect(resp).toEqual([]);
    });
    it('addMaterial test - position in', async () => {
        MockedGetProcessTypes.mockReturnValue(Promise.resolve([]));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(8);
        MockedAddMaterialFromCompany.mockReturnValue({        // @ts-ignore
            id: 1
        });
        expect(MockedGenericDropdownSelector.mock.calls[7][0].creationTitle).toEqual("material_name");
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[7][0].onCreate({
                name: 'itemNameTest'
            });
        });
        expect(MockedAddMaterialFromCompany).toHaveBeenCalledTimes(1);
        expect(MockedAddMaterialFromCompany).toHaveBeenNthCalledWith(1, {
            materialRequest: {
                name: 'itemNameTest',
                companyName: 'companyNameTest',
                input: true
            }
        });
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.material_add");

        //Error
        MockedAddMaterialFromCompany.mockImplementation(() => {
            throw 'GENERIC_ERROR';
        });
        expect(MockedGenericDropdownSelector.mock.calls[5][0].creationTitle).toEqual("material_name");
        await act(async () => {
            await expect(MockedGenericDropdownSelector.mock.calls[1][0].onCreate({name: "material1"})).rejects.toThrow("Material already exists!");
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, 'popups.errors.material_add: GENERIC_ERROR');
    });
    it('addMaterial test - position out', async () => {
        MockedGetProcessTypes.mockReturnValue(Promise.resolve([]));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(8);
        MockedAddMaterialFromCompany.mockReturnValue({        // @ts-ignore
            id: 1
        });
        expect(MockedGenericDropdownSelector.mock.calls[6][0].creationTitle).toEqual("material_name");
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[6][0].onCreate({
                name: 'itemNameTest'
            });
        });
        expect(MockedAddMaterialFromCompany).toHaveBeenCalledTimes(1);
        expect(MockedAddMaterialFromCompany).toHaveBeenNthCalledWith(1, {
            materialRequest: {
                name: 'itemNameTest',
                companyName: 'companyNameTest',
                input: false
            }
        });
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.material_add");

        //Error
        MockedAddMaterialFromCompany.mockImplementation(() => {
            throw 'GENERIC_ERROR';
        });

        await act(async () => {
            await expect(MockedGenericDropdownSelector.mock.calls[4][0].onCreate({name: "material1"})).rejects.toThrow("Material already exists!");
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, 'popups.errors.material_add: GENERIC_ERROR');
    });
    it('setMaterialIdPositionIn test', async () => {
        MockedGetProcessTypes.mockReturnValue(Promise.resolve([]));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(8);
        MockedAddMaterialFromCompany.mockReturnValue({        // @ts-ignore
            id: 1
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[0][0].selectItem({
                id: 1
            });
        });
        expect(MockedGenericDropdownSelector.mock.calls[0][0].createDisabled({name: 'ok'})).toBeFalsy()
        expect(MockedGenericDropdownSelector.mock.calls[0][0].createDisabled({name: ''})).toBeTruthy()
    });
    it('setMaterialIdPositionOut test', async () => {
        MockedGetProcessTypes.mockReturnValue(Promise.resolve([]));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(8);
        MockedAddMaterialFromCompany.mockReturnValue({        // @ts-ignore
            id: 1
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[1][0].selectItem({
                id: 1
            });
        });
        expect(MockedGenericDropdownSelector.mock.calls[1][0].createDisabled({name: 'ok'})).toBeFalsy()
        expect(MockedGenericDropdownSelector.mock.calls[1][0].createDisabled({name: ''})).toBeTruthy()
    });
    it('onSubmit test', async () => {
        const processingStandards = [{name: "ProcStandard1Test"}, {name: "ProcStandard2Test"}];
        const processTypes = [{code: 'PR1', name: 'Process1Test'}, {code: 'PR2', name: 'Process2Test'}];
        const traceabilityLevels = [{name: 'TraceLevel1'}, {name: 'TraceLevel2'}];
        const transparencyLevels = [{name: 'TransLevel1'}, {name: 'TransLevel2'}];
        const productCategories = [{code: "pc1", name: "prod1"}, {code: "pc2", name: "prod2"}];
        MockedGetProcessTypes.mockReturnValue(Promise.resolve(processTypes));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        MockedGetAllTraceabilityLevel.mockReturnValue(Promise.resolve(traceabilityLevels));
        MockedGetAllTransparencyLevel.mockReturnValue(Promise.resolve(transparencyLevels));
        MockedGetAllProductCategories.mockReturnValue(Promise.resolve(productCategories));
        const historyPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(12);
        expect(MockedSelect).toHaveBeenCalledTimes(30);
        act(() => {
           MockedSelect.mock.calls[25][0].onChange([{value: processingStandards[0], label: processingStandards[0].name}]);
        });
        act(() => {
            MockedSelect.mock.calls[26][0].onChange({value: productCategories[0], label: productCategories[0].code + " - " + productCategories[0].name});
        });
        act(() => {
            MockedSelect.mock.calls[27][0].onChange([{value: processTypes[0], label: processTypes[0].name}])
        });
        act(() => {
            MockedSelect.mock.calls[28][0].onChange({value: traceabilityLevels[0].name})
        });
        act(() => {
            MockedSelect.mock.calls[29][0].onChange({value: transparencyLevels[0].name})
        });
        MockedAddMaterialFromCompany.mockReturnValue({        // @ts-ignore
            id: 1
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[0][0].selectItem({
                id: 1
            });
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[1][0].selectItem({
                id: 2
            });
        });
        expect(mockedHandleSubmit).toHaveBeenCalledTimes(13);

        await act(async () => {
            mockedHandleSubmit.mock.calls[12][0]({
                name: 'transformationPlanNameTest',
                positionRequestList: [
                    {
                        quantity: 90
                    },
                    {
                        quantity: 10
                    }
                ]
            });
        });
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.transformation_create: transformationPlanNameTest");

        //Error
        MockedCreateTransformationPlan.mockImplementation(() => {
            throw 'GENERIC_ERROR';
        });
        await act(async () => {
            // @ts-ignore
            await mockedHandleSubmit.mock.calls[12][0]({
                transformationPlanName: 'transformationPlanNameTest',
                transformationPlanPositionRequestList: [
                    {
                        quantity: 100
                    }
                ]
            });
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.transformation_insert: GENERIC_ERROR");
    });

    // it('onSubmit test - total percentage exceed 100%', async () => {
    //     const processingStandards = [{name: "ProcStandard1Test"}, {name: "ProcStandard2Test"}];
    //     const processTypes = [{code: 'PR1', name: 'Process1Test'}, {code: 'PR2', name: 'Process2Test'}];
    //     const traceabilityLevels = [{name: 'TraceLevel1'}, {name: 'TraceLevel2'}];
    //     const transparencyLevels = [{name: 'TransLevel1'}, {name: 'TransLevel2'}];
    //     const productCategories = [{code: "pc1", name: "prod1"}, {code: "pc2", name: "prod2"}];
    //     MockedGetProcessTypes.mockReturnValue(Promise.resolve(processTypes));
    //     MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
    //     MockedGetAllTraceabilityLevel.mockReturnValue(Promise.resolve(traceabilityLevels));
    //     MockedGetAllTransparencyLevel.mockReturnValue(Promise.resolve(transparencyLevels));
    //     MockedGetAllProductCategories.mockReturnValue(Promise.resolve(productCategories));
    //     const historyPush = jest.fn();
    //     // @ts-ignore
    //     MockedUseHistory.mockReturnValue({
    //         push: historyPush
    //     });
    //     const userLoggedIn = {
    //         company: {
    //             companyName: 'companyNameTest'
    //         }
    //     }
    //     const addSuccessMessage = jest.fn();
    //     const addErrorMessage = jest.fn();
    //     let component: any = null;
    //     await act(async () => {
    //         component = await mount(
    //             <TransformationPlanInsert
    //                 // @ts-ignore
    //                 userLoggedIn={userLoggedIn}
    //                 addSuccessMessage={addSuccessMessage}
    //                 addErrorMessage={addErrorMessage}/>
    //         )
    //     });
    //     expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(12);
    //     expect(MockedSelect).toHaveBeenCalledTimes(30);
    //     act(() => {
    //         MockedSelect.mock.calls[25][0].onChange([{value: processingStandards[0], label: processingStandards[0].name}]);
    //     });
    //     act(() => {
    //         MockedSelect.mock.calls[26][0].onChange({value: productCategories[0], label: productCategories[0].code + " - " + productCategories[0].name});
    //     });
    //     act(() => {
    //         MockedSelect.mock.calls[27][0].onChange([{value: processTypes[0], label: processTypes[0].name}])
    //     });
    //     act(() => {
    //         MockedSelect.mock.calls[28][0].onChange({value: traceabilityLevels[0].name})
    //     });
    //     act(() => {
    //         MockedSelect.mock.calls[29][0].onChange({value: transparencyLevels[0].name})
    //     });
    //     MockedAddMaterialFromCompany.mockReturnValue({        // @ts-ignore
    //         id: 1
    //     });
    //     await act(async () => {
    //         // @ts-ignore
    //         await MockedGenericDropdownSelector.mock.calls[0][0].selectItem({
    //             id: 1
    //         });
    //     });
    //     await act(async () => {
    //         // @ts-ignore
    //         await MockedGenericDropdownSelector.mock.calls[1][0].selectItem({
    //             id: 2
    //         });
    //     });
    //     expect(mockedHandleSubmit).toHaveBeenCalledTimes(13);
    //
    //     await act(async () => {
    //         mockedHandleSubmit.mock.calls[12][0]({
    //             name: 'transformationPlanNameTest',
    //             positionRequestList: [
    //                 {
    //                     quantity: 90
    //                 },
    //                 {
    //                     quantity: 20
    //                 }
    //             ]
    //         });
    //     });
    //     expect(addSuccessMessage).not.toHaveBeenCalled();
    //     component.update();
    //     expect(component.find('.ErrorText').length).toEqual(1);
    //     expect(component.find('.ErrorText').text()).toEqual("errors.max_percentage");
    //
    // });

    it('onSubmit test - no process types selected', async () => {
        const processTypes = [
            {code: 'PR1', name: 'Process1Test'},
            {code: 'PR2', name: 'Process2Test'}
        ];
        const traceabilityLevels = [{name: 'TraceLevel1'}, {name: 'TraceLevel2'}];
        const transparencyLevels = [{name: 'TransLevel1'}, {name: 'TransLevel2'}];
        MockedGetProcessTypes.mockReturnValue(Promise.resolve(processTypes));
        MockedGetAllTraceabilityLevel.mockReturnValue(Promise.resolve(traceabilityLevels));
        MockedGetAllTransparencyLevel.mockReturnValue(Promise.resolve(transparencyLevels));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        const historyPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(12);
        expect(MockedSelect).toHaveBeenCalledTimes(30);
        MockedAddMaterialFromCompany.mockReturnValue({        // @ts-ignore
            id: 1
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[0][0].selectItem({
                id: 1
            });
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[1][0].selectItem({
                id: 2
            });
        });
        expect(mockedHandleSubmit).toHaveBeenCalledTimes(8);
        await act(async () => {
            // @ts-ignore
            await mockedHandleSubmit.mock.calls[7][0]({
                transformationPlanName: 'transformationPlanNameTest',
                transformationPlanPositionRequestList: [
                    {
                        quantity: 100
                    },
                    {
                        quantity: 345
                    }
                ]
            });
        });
        expect(MockedCreateTransformationPlan).not.toHaveBeenCalled();
    });

    it('onSubmit test - no processing standard selected', async () => {
        const processingStandards = [
            {name: 'ProcessStandard1Test'},
            {name: 'ProcessStandard2Test'}
        ];
        const traceabilityLevels = [{name: 'TraceLevel1'}, {name: 'TraceLevel2'}];
        const transparencyLevels = [{name: 'TransLevel1'}, {name: 'TransLevel2'}];
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve(processingStandards));
        MockedGetProcessTypes.mockReturnValue(Promise.resolve([]));
        MockedGetAllTraceabilityLevel.mockReturnValue(Promise.resolve(traceabilityLevels));
        MockedGetAllTransparencyLevel.mockReturnValue(Promise.resolve(transparencyLevels));
        const historyPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(12);
        expect(MockedSelect).toHaveBeenCalledTimes(30);
        MockedAddMaterialFromCompany.mockReturnValue({        // @ts-ignore
            id: 1
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[0][0].selectItem({
                id: 1
            });
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[1][0].selectItem({
                id: 2
            });
        });
        expect(mockedHandleSubmit).toHaveBeenCalledTimes(8);
        await act(async () => {
            // @ts-ignore
            await mockedHandleSubmit.mock.calls[7][0]({
                transformationPlanName: 'transformationPlanNameTest',
                transformationPlanPositionRequestList: [
                    {
                        quantity: 100
                    },
                    {
                        quantity: 345
                    }
                ]
            });
        });
        expect(MockedCreateTransformationPlan).toHaveBeenCalledTimes(0);
    });

    it('onSubmit test - wrong traceability and transparency level pair selected', async () => {
        const processingStandards = [{name: "ProcStandard1Test"}, {name: "ProcStandard2Test"}];
        const processTypes = [{code: 'PR1', name: 'Process1Test'}, {code: 'PR2', name: 'Process2Test'}];
        const traceabilityLevels = [{name: '1 - TraceLevel'}, {name: '2 - TraceLevel'}, {name: '3 - TraceLevel'}];
        const transparencyLevels = [{name: '1 - TransLevel'}, {name: '2 - TransLevel'}];
        const productCategories = [{code: "pc1", name: "prod1"}, {code: "pc2", name: "prod2"}];
        MockedGetProcessTypes.mockReturnValue(Promise.resolve(processTypes));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        MockedGetAllTraceabilityLevel.mockReturnValue(Promise.resolve(traceabilityLevels));
        MockedGetAllTransparencyLevel.mockReturnValue(Promise.resolve(transparencyLevels));
        MockedGetAllProductCategories.mockReturnValue(Promise.resolve(productCategories));
        const historyPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();

        let component: any = null;
        await act(async () => {
            component = await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(12);
        expect(MockedSelect).toHaveBeenCalledTimes(30);
        act(() => {
            MockedSelect.mock.calls[25][0].onChange([{value: processingStandards[0], label: processingStandards[0].name}]);
        });
        act(() => {
            MockedSelect.mock.calls[26][0].onChange({value: productCategories[0], label: productCategories[0].code + " - " + productCategories[0].name});
        });
        act(() => {
            MockedSelect.mock.calls[27][0].onChange([{value: processTypes[0], label: processTypes[0].name}])
        });
        act(() => {
            MockedSelect.mock.calls[28][0].onChange({value: traceabilityLevels[1].name})
        });
        act(() => {
            MockedSelect.mock.calls[29][0].onChange({value: transparencyLevels[1].name})
        });
        MockedAddMaterialFromCompany.mockReturnValue({        // @ts-ignore
            id: 1
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[0][0].selectItem({
                id: 1
            });
        });
        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[1][0].selectItem({
                id: 2
            });
        });
        expect(mockedHandleSubmit).toHaveBeenCalledTimes(13);
        await act(async () => {
            mockedHandleSubmit.mock.calls[12][0]({
                transformationPlanName: 'transformationPlanNameTest',
                transformationPlanPositionRequestList: [
                    {
                        quantity: 100
                    },
                    {
                        quantity: 345
                    }
                ]
            });
        });
        component.update();
        expect(addSuccessMessage).not.toHaveBeenCalled();
        expect(component.find('.ErrorText').length).toEqual(1);
        expect(component.find('.ErrorText').text()).toEqual("errors.transformation_plan.wrong_traceability_level 2 - TransLevel");

    });

    it('FormControl date test', async () => {
        const processTypes = [
            {code: 'PR1', name: 'Process1Test'},
            {code: 'PR2', name: 'Process2Test'}
        ];
        const traceabilityLevels = [{name: 'TraceLevel1'}, {name: 'TraceLevel2'}];
        const transparencyLevels = [{name: 'TransLevel1'}, {name: 'TransLevel2'}];
        MockedGetProcessTypes.mockReturnValue(Promise.resolve(processTypes));
        MockedGetAllTraceabilityLevel.mockReturnValue(Promise.resolve(traceabilityLevels));
        MockedGetAllTransparencyLevel.mockReturnValue(Promise.resolve(transparencyLevels));
        MockedGetTransformationProcessingStandard.mockReturnValue(Promise.resolve([]));
        const historyPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });
        const userLoggedIn = {
            company: {
                companyName: 'companyNameTest'
            }
        }
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();
        await act(async () => {
            await mount(
                <TransformationPlanInsert
                    // @ts-ignore
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}/>
            )
        });
        expect(MockedFormControl).toHaveBeenCalledTimes(30);
        expect(mockedRegister).toHaveBeenCalledTimes(30);
        expect(mockedRegister).toHaveBeenNthCalledWith(18, {
            required: true,
            valueAsDate: true
        });
        expect(mockedRegister).toHaveBeenNthCalledWith(19, {
            required: false,
            valueAsDate: true,
            validate:expect.any(Function)
        });
        MockedIsAfterDate.mockReturnValue(true);
        expect(mockedRegister.mock.calls[18][0].validate(new Date())).toBeTruthy();
    });

});
