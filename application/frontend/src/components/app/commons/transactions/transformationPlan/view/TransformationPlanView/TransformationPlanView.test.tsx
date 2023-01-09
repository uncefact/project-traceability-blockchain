import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Button, Form, Jumbotron, ListGroup} from "react-bootstrap";
import {act} from "react-dom/test-utils";
import TransformationPlanControllerApi from "../../../../../../../api/TransformationPlanControllerApi";
import TraceabilityLevelControllerApi from "../../../../../../../api/TraceabilityLevelControllerApi";
import TransparencyLevelControllerApi from "../../../../../../../api/TransparencyLevelControllerApi";
import {useHistory, useRouteMatch} from "react-router-dom";
// @ts-ignore
import Select from 'react-select';
import TP, {TransformationPlanView} from "./TransformationPlanView";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {useForm} from "react-hook-form";
import {
    ConfirmationCertificationPresentable,
    ConfirmationCertificationPresentableSubjectEnum,
    TransformationPlanPresentable
} from "@unece/cotton-fetch";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import CompanyControllerApi from "../../../../../../../api/CompanyControllerApi";
import {Modal} from "../../../../../../GenericComponents/Modal/Modal";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

// in questo modo preservo "initReactI18next" nel modulo che viene mockato perchè "initReactI18next" serve nella configurazione di i18n nel file config.ts
jest.mock("react-i18next", () => {
    return {
        // @ts-ignore
        ...jest.requireActual("react-i18next"),
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-hook-form', () => {
    return {
        useForm: jest.fn(),
    }
});

jest.mock("react-icons/ai", () => {
    return {
        AiFillEdit: jest.fn().mockImplementation(({children}) => <div className={'AiFillEdit'}>{children}</div>),
        AiTwotoneDelete: jest.fn().mockImplementation(({children}) => <div className={'AiTwotoneDelete'}>{children}</div>)
    }
});

jest.mock("../../../../../../GenericComponents/Modal/Modal", () => {
    return {
        Modal: jest.fn().mockImplementation(({children}) => <div className={'Modal'}>{children}</div>)
    }
});

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(),
        useRouteMatch: jest.fn()
    }
});

jest.mock("../../../../../../../api/TransformationPlanControllerApi", () => {
    return {
        getTransformationPlan: jest.fn(),
        getTransformationProcessingStandards: jest.fn(),
        updateTransformationPlan: jest.fn(),
        deleteTransformationPlan: jest.fn(),
    }
});

jest.mock("../../../../../../../api/TraceabilityLevelControllerApi", () => {
    return {
        getAllTraceabilityLevel: jest.fn(),
    }
});

jest.mock("../../../../../../../api/TransparencyLevelControllerApi", () => {
    return {
        getAllTransparencyLevel: jest.fn(),
    }
});

jest.mock("../../../../../../../api/CompanyControllerApi", () => {
    return {
        postSupplierInvitation: jest.fn(),
    }
});

jest.mock("../../../../../../../api/CertificationControllerApi", () => {
    return {
        getMyCertifications: jest.fn(),
        getCertificationsByTransactionId: jest.fn(),
    }
});

jest.mock("react-select", () => {
    return jest.fn().mockImplementation(({children}) => <div className={'Select'}>{children}</div>)
});

jest.mock('react-bootstrap', () => {
    let Button = jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>);
    let Form = jest.fn().mockImplementation(({children}) => <div className={'Form'}>{children}</div>);
    let Jumbotron = jest.fn().mockImplementation(({children}) => <div className={'Jumbotron'}>{children}</div>);
    let ListGroup = jest.fn().mockImplementation(({children}) => <div className={'ListGroup'}>{children}</div>);
    let InputGroup = jest.fn().mockImplementation(({children}) => <div className={'InputGroup'}>{children}</div>);

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
    // @ts-ignore
    ListGroup.Item = jest.fn().mockImplementation(({children}) => <div className={'ListGroupItem'}>{children}</div>);

    return {
        Button,
        Form,
        Jumbotron,
        ListGroup,
        InputGroup
    };
});


describe('TransformationPlanView test', () => {
    const MockedButton = mocked(Button, true);
    const MockedTransformationControllerApi = mocked(TransformationPlanControllerApi, true);
    const MockedCompanyControllerApi = mocked(CompanyControllerApi, true);
    const MockedTraceabilityLevelControllerApi = mocked(TraceabilityLevelControllerApi, true);
    const MockedTransparencyLevelControllerApi = mocked(TransparencyLevelControllerApi, true);
    const MockedCertificationControllerApi = mocked(CertificationControllerApi, true);
    const MockedSelect = mocked(Select, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedUseRouteMatch = mocked(useRouteMatch, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedListGroupItem = mocked(ListGroup.Item, true);
    const MockedUseForm = mocked(useForm, true);
    const MockedModal = mocked(Modal, true);
    const mockedHandleSubmit = jest.fn();
    const companyIndustrialSector = "sectorTest";

    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();
    const startLoading = jest.fn();
    const stopLoading = jest.fn();

    // @ts-ignore
    MockedUseForm.mockReturnValue({
        register: jest.fn(),
        handleSubmit: mockedHandleSubmit,
        // @ts-ignore
        errors: []
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        mount(
            <Provider store={store}>
                <TP />
            </Provider>
        );
    });
    it('Render without crashing async', async () => {
        await act(async () => {
            await mount(
                <TransformationPlanView
                    companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}
                    startLoading={startLoading}
                    stopLoading={stopLoading}
                />
            );
        });
    });

    it('Content test - generic', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            inputPositions: [
                { contractorMaterialName: "mat 1", quantity: 40.0 },
                { contractorMaterialName: "mat 2", quantity: 60.0 }
            ],
            processTypeList: [
                { code: "pt1", name: "process type 1" },
                { code: "pt2", name: "process type 2" }
            ],
            processingStandardList: [
                { name: "processing standard 1" },
                { name: "processing standard 2" }
            ]
        };

        let component = mount(
            <TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />
        );
        expect(Jumbotron).toHaveBeenCalledTimes(1);
        expect(Form).toHaveBeenCalledTimes(2);
        expect(Form.Group).toHaveBeenCalledTimes(12);
        expect(Form.Control).toHaveBeenCalledTimes(8);

        MockedFormLabel.mockClear();
        MockedTransformationControllerApi.getTransformationPlan.mockImplementation(() => Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockReturnValue(Promise.resolve([]));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockReturnValue(Promise.resolve([]));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getMyCertifications.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve([]));

        await act(async () => {
            component = await mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        expect(startLoading).toHaveBeenCalledTimes(4);
        expect(startLoading).toHaveBeenNthCalledWith(2, "popups.loading.transformation_plan");
        expect(startLoading).toHaveBeenNthCalledWith(3, "popups.loading.certificates");
        expect(stopLoading).toHaveBeenCalled();
        expect(component.find('h2').length).toEqual(1);
        expect(component.find('h2').text()).toEqual("transformation");
        expect(component.find('h4').at(0).text()).toEqual("edit");
        expect(component.find('h4').at(1).text()).toEqual("delete");
        expect(component.find('.Button').length).toEqual(1);
        expect(component.find('.Button').text()).toEqual("show_chain");
        expect(component.find('.AiFillEdit').length).toEqual(1);
        expect(component.find('.AiTwotoneDelete').length).toEqual(1);
        expect(MockedFormLabel).toHaveBeenCalledTimes(45);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(27,{children: 'supplier'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(28,{children: 'user_email'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(29,{children: 'name'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(30,{children: 'material (output)'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(31,{children: 'reference_standards'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(32,{children: 'certification.product_category'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(33,{children: 'certification.process_types'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(34,{children: 'transformation_plan.traceability_level'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(35,{children: 'transformation_plan.transparency_level'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(36,{children: 'notes'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(37,{children: 'transformation_plan.start_date'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(38,{children: 'transformation_plan.end_date'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(39,{children: 'material (input)'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(40,{children: 'supplier'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(41,{children: 'transformation_plan.value'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(45,{children: 'certificates'}, {});

        expect(component.find('.ListGroup').length).toEqual(2);
        expect(MockedListGroupItem).toHaveBeenCalledTimes(4);
        expect(MockedListGroupItem).toHaveBeenNthCalledWith(3,
            { children: "pt1 - process type 1", className: "List", disabled: true }, {});
        expect(MockedListGroupItem).toHaveBeenNthCalledWith(1,
            { children: "processing standard 1", className: "List", disabled: true }, {});

        // edit has pressed
        expect(MockedSelect).not.toHaveBeenCalled();
        await act(async () => {
            component.find("h4").at(0).simulate("click");
        });
        component.update();
        expect(component.find('.AiFillEdit').length).toEqual(0);
        expect(component.find('.Button').length).toEqual(5);
        expect(component.find('.Button').at(0).text()).toEqual("show_chain");
        expect(component.find('.Button').at(1).text()).toEqual("transformation_plan.invite_supplier");
        expect(component.find('.Button').at(2).text()).toEqual("transformation_plan.invite_supplier");
        expect(component.find('.Button').at(3).text()).toEqual("cancel");
        expect(component.find('.Button').at(4).text()).toEqual("confirm");
        expect(MockedSelect).toHaveBeenCalledTimes(18);

        // getTransformationPlan() failed
        expect(addErrorMessage).not.toHaveBeenCalled();
        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.reject("Generic error"));
        await act(async () => {
            component = await mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.transformation: Generic error");

    });

    it('Show supply chain output material', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            outputMaterial: { id: 1 }
        };

        const pushMock = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockReturnValue(Promise.resolve([]));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockReturnValue(Promise.resolve([]));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getMyCertifications.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve([]));

        await act(async () => {
            mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        expect(MockedButton).toHaveBeenCalledTimes(2);
        await act(async () => {
            // @ts-ignore
            MockedButton.mock.calls[1][0].onClick();
        });
        expect(pushMock).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(pushMock).toHaveBeenNthCalledWith(1, '/' + companyIndustrialSector + '/graph/' + transformationPlan.outputMaterial.id);
    });

    it('getTransformationCertificates test - ok', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            outputMaterial: { id: 1 }
        };
        const certificates : ConfirmationCertificationPresentable[] = [
            {id: 1, processingStandardName: "procStandard 1", subject: ConfirmationCertificationPresentableSubjectEnum.Scope},
        ];

        const pushMock = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockReturnValue(Promise.resolve([]));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockReturnValue(Promise.resolve([]));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockReturnValue(Promise.resolve([]));

        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve(certificates));


        let component: any = null;
        await act(async () => {
            component = await mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });
        component.update();

        expect(component.find('.CertificateButton').length).toEqual(1);
        expect(MockedButton).toHaveBeenCalledTimes(4);
        // @ts-ignore
        MockedButton.mock.calls[3][0].onClick();
        expect(pushMock).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(pushMock).toHaveBeenNthCalledWith(1, '/' + companyIndustrialSector + '/certifications/' + certificates[0].subject.toLowerCase() + "/" + certificates[0].id + '/confirmation');
    });

    it('getTransformationCertificates test - fail', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            outputMaterial: { id: 1 }
        };

        const pushMock = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockReturnValue(Promise.resolve([]));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockReturnValue(Promise.resolve([]));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockReturnValue(Promise.resolve([]));

        // @ts-ignore
        MockedCertificationControllerApi.getMyCertifications.mockImplementation(() => Promise.reject("Error"));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockImplementation(() => Promise.reject("Error"));

        let component: any = null;
        await act(async () => {
            component = await mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });
        component.update();

        expect(component.find('.CertificateButton').length).toEqual(0);
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.certificates: Error");
    });

    it('retrieveInformationToUpdate test', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            outputMaterial: { id: 1 },
            processingStandardList: [{name: "ps1"}]
        };
        const allTraceabilityLevels = [{name: "traceLevel1"}, {name: "traceLevel2"}];
        const allTransparencyLevels = [{name: "transLevel1"}, {name: "transLevel2"}];
        const processingStandards = [{name: "ps1"}, {name: "ps2"}];
        let component : any = null;

        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockReturnValue(Promise.resolve(processingStandards));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockReturnValue(Promise.resolve(allTraceabilityLevels));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockReturnValue(Promise.resolve(allTransparencyLevels));
        MockedCertificationControllerApi.getMyCertifications.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve([]));

        await act(async () => {
            component = mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        expect(component.find('h4').at(0).text()).toEqual("edit");
        expect(startLoading).toHaveBeenCalledTimes(2);
        expect(stopLoading).toHaveBeenCalledTimes(2);
        await act(async () => {
            component.find("h4").at(0).simulate("click");
        });
        expect(startLoading).toHaveBeenCalledTimes(3);
        expect(startLoading).toHaveBeenNthCalledWith(3, "popups.loading.transformation_plan_update");
        expect(stopLoading).toHaveBeenCalledTimes(3);
        expect(MockedSelect).toHaveBeenCalledTimes(18);

        //processing standards
        expect(MockedSelect).toHaveBeenNthCalledWith(16, {
            isMulti: true,
            value: [{value: {name: "ps1"}, label: "ps1"}],
            options: [{value: {name: "ps2"}, label: "ps2"}],
            onChange: expect.any(Function)
        }, {});

        //traceability level
        expect(MockedSelect).toHaveBeenNthCalledWith(17, {
            value: null,
            options: allTraceabilityLevels.map(tl => ({value: tl.name, label: tl.name})),
            onChange: expect.any(Function)
        }, {});

        //transparency level
        expect(MockedSelect).toHaveBeenNthCalledWith(18, {
            value: null,
            options: allTransparencyLevels.map(tl => ({value: tl.name, label: tl.name})),
            onChange: expect.any(Function)
        }, {});


        // back button pressed
        component.update();
        expect(component.find('.AiFillEdit').length).toEqual(0);
        expect(MockedButton).toHaveBeenCalledTimes(20);
        expect(MockedButton).toHaveBeenNthCalledWith(19, {
            variant: "primary",
            className: "mr-2 bg-danger border-danger",
            onClick: expect.any(Function),
            children: "cancel"
        }, {});
        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[18][0].onClick();
        });
        component.update();
        expect(component.find('.AiFillEdit').length).toEqual(1);

    });

    it('retrieveInformationToUpdate test failed', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            outputMaterial: { id: 1 },
            processingStandardList: [{name: "ps1"}]
        };

        let component : any = null;
        // test failed
        expect(addErrorMessage).not.toHaveBeenCalled();
        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockImplementation(() => Promise.reject("Error"));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockImplementation(() => Promise.reject("Error"));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockImplementation(() => Promise.reject("Error"));
        MockedCertificationControllerApi.getMyCertifications.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve([]));

        await act(async () => {
            component = await mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        expect(component.find('h4').at(0).text()).toEqual("edit");
        expect(startLoading).toHaveBeenCalledTimes(2);
        expect(stopLoading).toHaveBeenCalledTimes(2);
        await act(async () => {
            component.find("h4").at(0).simulate("click");
        });
        expect(startLoading).toHaveBeenCalledTimes(3);
        expect(startLoading).toHaveBeenNthCalledWith(3, "popups.loading.transformation_plan_update");
        expect(stopLoading).toHaveBeenCalledTimes(3);

        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.transformation_info: Error");
    });

    it('handleProcessingStandardsChange test', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            outputMaterial: { id: 1 },
            processingStandardList: [{name: "ps1"}],
            transparencyLevel: "transLevel1",
            traceabilityLevel: "traceLevel1"
        };
        const allTraceabilityLevels = [{name: "traceLevel1"}, {name: "traceLevel2"}];
        const allTransparencyLevels = [{name: "transLevel1"}, {name: "transLevel2"}];
        const processingStandards = [{name: "ps1"}, {name: "ps2"}];

        const historyPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });

        let component : any = null;
        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockReturnValue(Promise.resolve(processingStandards));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockReturnValue(Promise.resolve(allTraceabilityLevels));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockReturnValue(Promise.resolve(allTransparencyLevels));
        MockedCertificationControllerApi.getMyCertifications.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve([]));

        await act(async () => {
            component = mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        expect(component.find('h4').at(0).text()).toEqual("edit");
        await act(async () => {
            component.find("h4").at(0).simulate("click");
        });

        expect(MockedSelect).toHaveBeenCalledTimes(24);
        // change processing standards
        act(() => {
            MockedSelect.mock.calls[21][0].onChange([{value: {name: "ps3"}}, {value: {name: "ps2"}}]);
        });
        expect(MockedSelect).toHaveBeenCalledTimes(27);
        expect(MockedSelect).toHaveBeenNthCalledWith(25, {
            isMulti: true,
            value: [{value: {name: "ps3"}}, {value: {name: "ps2"}}],
            onChange: expect.any(Function),
            options: [{value: {name:"ps1"}, label: "ps1"}]
        }, {});

    });

    it('handleUpdate test', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            outputMaterial: { id: 1 },
            processingStandardList: [{name: "ps1"}],
            transparencyLevel: "transLevel1",
            traceabilityLevel: "traceLevel1"
        };
        const allTraceabilityLevels = [{name: "traceLevel1"}, {name: "traceLevel2"}];
        const allTransparencyLevels = [{name: "transLevel1"}, {name: "transLevel2"}];
        const processingStandards = [{name: "ps1"}, {name: "ps2"}];

        const historyPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });

        let component : any = null;
        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockReturnValue(Promise.resolve(processingStandards));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockReturnValue(Promise.resolve(allTraceabilityLevels));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockReturnValue(Promise.resolve(allTransparencyLevels));
        MockedTransformationControllerApi.updateTransformationPlan.mockReturnValue(Promise.resolve({}));
        MockedCertificationControllerApi.getMyCertifications.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve([]));

        await act(async () => {
            component = mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        expect(component.find('h4').at(0).text()).toEqual("edit");
        await act(async () => {
            component.find("h4").at(0).simulate("click");
        });

        expect(MockedSelect).toHaveBeenCalledTimes(24);
        // change transparency level
        act(() => {
            MockedSelect.mock.calls[23][0].onChange({value: "transLevel2"});
        });

        // change traceability level
        act(() => {
            MockedSelect.mock.calls[22][0].onChange({value: "traceLevel2"})
        });

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(12);
        expect(addSuccessMessage).not.toHaveBeenCalled();
        await act(async () => {
           mockedHandleSubmit.mock.calls[11][0]({})
        });

        expect(MockedTransformationControllerApi.updateTransformationPlan).toHaveBeenCalledTimes(1);
        expect(MockedTransformationControllerApi.updateTransformationPlan).toHaveBeenNthCalledWith(1, {
            transformationPlanUpdateRequest: {
                traceabilityLevelName: "traceLevel2",
                transparencyLevelName: "transLevel2",
                processingStandardList: ["ps1"]
            },
            id: undefined
        });
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.transformation_update: " + transformationPlan.name);
        expect(historyPush).toHaveBeenCalledTimes(1);
        expect(historyPush).toHaveBeenNthCalledWith(1, '/');
    });

    it('handleUpdate test failed', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            outputMaterial: { id: 1 },
            processingStandardList: [{name: "ps1"}],
            transparencyLevel: "transLevel1",
            traceabilityLevel: "traceLevel1"
        };
        const allTraceabilityLevels = [{name: "traceLevel1"}, {name: "traceLevel2"}];
        const allTransparencyLevels = [{name: "transLevel1"}, {name: "transLevel2"}];
        const processingStandards = [{name: "ps1"}, {name: "ps2"}];

        const historyPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });

        let component : any = null;
        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockReturnValue(Promise.resolve(processingStandards));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockReturnValue(Promise.resolve(allTraceabilityLevels));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockReturnValue(Promise.resolve(allTransparencyLevels));
        MockedTransformationControllerApi.updateTransformationPlan.mockImplementation(() => Promise.reject("Error"));
        MockedCertificationControllerApi.getMyCertifications.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve([]));

        await act(async () => {
            component = mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(2);
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act(async () => {
            mockedHandleSubmit.mock.calls[1][0]({})
        });

        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.transformation_update: Error");
    });

    it('handleUpdate test failed - wrong traceability and transparency level pair selected', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            outputMaterial: { id: 1 },
            processingStandardList: [{name: "ps1"}],
            transparencyLevel: "transLevel1",
            traceabilityLevel: "traceLevel1"
        };
        const allTraceabilityLevels = [{name: '1 - TraceLevel'}, {name: '2 - TraceLevel'}, {name: '3 - TraceLevel'}];
        const allTransparencyLevels = [{name: '1 - TransLevel'}, {name: '2 - TransLevel'}];
        const processingStandards = [{name: "ps1"}, {name: "ps2"}];

        const historyPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });

        let component : any = null;
        MockedTransformationControllerApi.getTransformationPlan.mockReturnValue(Promise.resolve(transformationPlan));
        MockedTransformationControllerApi.getTransformationProcessingStandards.mockReturnValue(Promise.resolve(processingStandards));
        MockedTraceabilityLevelControllerApi.getAllTraceabilityLevel.mockReturnValue(Promise.resolve(allTraceabilityLevels));
        MockedTransparencyLevelControllerApi.getAllTransparencyLevel.mockReturnValue(Promise.resolve(allTransparencyLevels));
        MockedTransformationControllerApi.updateTransformationPlan.mockImplementation(() => Promise.resolve({}));
        MockedCertificationControllerApi.getMyCertifications.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve([]));

        await act(async () => {
            component = mount(<TransformationPlanView
                companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        expect(component.find('h4').at(0).text()).toEqual("edit");
        await act(async () => {
            component.find("h4").at(0).simulate("click");
        });

        expect(MockedSelect).toHaveBeenCalledTimes(24);
        // change transparency level
        act(() => {
            MockedSelect.mock.calls[23][0].onChange({value: allTransparencyLevels[1].name});
        });

        // change traceability level
        act(() => {
            MockedSelect.mock.calls[22][0].onChange({value: allTraceabilityLevels[1].name})
        });

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(12);
        await act(async () => {
            mockedHandleSubmit.mock.calls[11][0]({})
        });

        component.update();
        expect(addSuccessMessage).not.toHaveBeenCalled();
        expect(component.find('.ErrorText').length).toEqual(1);
        expect(component.find('.ErrorText').text()).toEqual("errors.transformation_plan.wrong_traceability_level 2 - TransLevel");

    });

    it('deleteTransformation test', async () => {
        const pushMock = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        MockedUseRouteMatch.mockReturnValue({// @ts-ignore
            params: {id: 1}
        })

        let component: any = null;
        await act(async () => {
            component = await mount(
                <TransformationPlanView
                    companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}
                    startLoading={startLoading}
                    stopLoading={stopLoading}
                />
            );
        });

        expect(MockedModal).toHaveBeenCalledTimes(4);
        // @ts-ignore
        expect(component.find('.Click').length).toEqual(2);
        await act(async () => {
            // @ts-ignore
            await component.find('.Click').at(1).simulate('click');
        });
        expect(MockedModal).toHaveBeenCalledTimes(6);
        expect(MockedModal).toHaveBeenNthCalledWith(5, {
            show: true,
            handleClose: expect.anything(),
            handleConfirm: expect.anything(),
            title: 'transformation_plan.delete',
            children: 'transformation_plan.delete_confirm',
        }, {});

        act(() => {
            MockedModal.mock.calls[4][0].handleClose();
        });
        expect(addSuccessMessage).not.toHaveBeenCalled();
        expect(MockedTransformationControllerApi.deleteTransformationPlan).not.toHaveBeenCalled();

        await act(async () => {
            await MockedModal.mock.calls[4][0].handleConfirm();
        });
        expect(startLoading).toHaveBeenCalledTimes(3);
        expect(stopLoading).toHaveBeenCalledTimes(3);
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, 'popups.success.transformation_delete');
        expect(MockedTransformationControllerApi.deleteTransformationPlan).toHaveBeenCalledTimes(1);
        expect(MockedTransformationControllerApi.deleteTransformationPlan).toHaveBeenNthCalledWith(1, {
            id: 1
        });
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenNthCalledWith(1, '/');

    });
    it('deleteTransformation test - error', async () => {
        const pushMock = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        MockedUseRouteMatch.mockReturnValue({// @ts-ignore
            params: {id: 1}
        })

        let component: any = null;
        await act(async () => {
            component = await mount(
                <TransformationPlanView
                    companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}
                    startLoading={startLoading}
                    stopLoading={stopLoading}
                />
            );
        });

        expect(MockedModal).toHaveBeenCalledTimes(4);
        // @ts-ignore
        expect(component.find('.Click').length).toEqual(2);

        MockedTransformationControllerApi.deleteTransformationPlan.mockImplementation(() => {
            throw 'Generic_Error'
        })
        await act(async () => {
            // @ts-ignore
            await component.find('.Click').at(1).simulate('click');
        });
        expect(MockedModal).toHaveBeenCalledTimes(6);
        expect(MockedModal).toHaveBeenNthCalledWith(5, {
            show: true,
            handleClose: expect.anything(),
            handleConfirm: expect.anything(),
            title: 'transformation_plan.delete',
            children: 'transformation_plan.delete_confirm',
        }, {})
        await act(async () => {
            await MockedModal.mock.calls[4][0].handleConfirm();
        });
        expect(startLoading).toHaveBeenCalledTimes(3);
        expect(stopLoading).toHaveBeenCalledTimes(3);
        expect(addSuccessMessage).toHaveBeenCalledTimes(0);
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, 'popups.errors.transformation_delete: Generic_Error');
        expect(MockedTransformationControllerApi.deleteTransformationPlan).toHaveBeenCalledTimes(1);
        expect(MockedTransformationControllerApi.deleteTransformationPlan).toHaveBeenNthCalledWith(1, {
            id: 1
        });
    });

    it('addInvitedCompany test', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            inputPositions: [
                { contractorMaterialName: "mat 1", quantity: 100.0 }
            ]
        };
        let component: any = null;
        MockedTransformationControllerApi.getTransformationPlan.mockImplementation(() => Promise.resolve(transformationPlan));
        await act(async () => {
            component = await mount(
                <TransformationPlanView
                    companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}
                    startLoading={startLoading}
                    stopLoading={stopLoading}
                />
            );
        });

        expect(MockedModal).toHaveBeenCalledTimes(4);
        expect(MockedButton).toHaveBeenCalledTimes(3);
        expect(MockedButton).toHaveBeenNthCalledWith(3, {
            children: "transformation_plan.invite_supplier",
            onClick: expect.any(Function),
            variant: "primary"
        }, {});
        await act(async () => {
            // @ts-ignore
            MockedButton.mock.calls[2][0].onClick();
        });
        expect(MockedModal).toHaveBeenCalledTimes(6);
        expect(MockedModal).toHaveBeenNthCalledWith(6, {
            show: true,
            handleClose: expect.anything(),
            handleConfirm: expect.anything(),
            title: 'transformation_plan.supplier_invitation',
            children: expect.anything(),
        }, {});

        act(() => {
            MockedModal.mock.calls[5][0].handleClose();
        });
        expect(addSuccessMessage).not.toHaveBeenCalled();
        expect(MockedTransformationControllerApi.deleteTransformationPlan).not.toHaveBeenCalled();

        // add the name of the company to invite and the user email address of the employee to send the email to
        expect(MockedFormControl).toHaveBeenCalledTimes(41);
        expect(MockedFormControl).toHaveBeenNthCalledWith(31, {
            type: "text",
            placeholder: "placeholders.transformation_plan.supplier_invitation",
            onChange: expect.any(Function)
        }, {});
        expect(MockedFormControl).toHaveBeenNthCalledWith(32, {
            type: "email",
            placeholder: "placeholders.trade.company_user_invitation",
            onChange: expect.any(Function)
        }, {});

        act(() => {
            // @ts-ignore
            MockedFormControl.mock.calls[30][0].onChange({target: {value: "newCompanyName"}});
            // @ts-ignore
            MockedFormControl.mock.calls[31][0].onChange({target: {value: "userEmail@mail.ch"}});
        });
        expect(MockedModal).toHaveBeenCalledTimes(10);

        await act(async () => {
            await MockedModal.mock.calls[9][0].handleConfirm();
        });
        expect(MockedCompanyControllerApi.postSupplierInvitation).toHaveBeenCalledTimes(1);
        expect(MockedCompanyControllerApi.postSupplierInvitation).toHaveBeenNthCalledWith(1, {
            totalOnboardingRequest: {
                companyName: "newCompanyName",
                userEmailAddress: "userEmail@mail.ch"
            }
        });
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, 'popups.success.invitation');

        // test error
        expect(addErrorMessage).not.toHaveBeenCalled();
        MockedCompanyControllerApi.postSupplierInvitation.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            await MockedModal.mock.calls[9][0].handleConfirm();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, 'popups.errors.company_invitation: Generic error');
    });

    it('addInvitedCompany test - form values error', async () => {
        const transformationPlan : TransformationPlanPresentable = {
            name: "tr 1",
            inputPositions: [
                { contractorMaterialName: "mat 1", quantity: 100.0 }
            ]
        };
        let component: any = null;
        MockedTransformationControllerApi.getTransformationPlan.mockImplementation(() => Promise.resolve(transformationPlan));
        await act(async () => {
            component = await mount(
                <TransformationPlanView
                    companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}
                    startLoading={startLoading}
                    stopLoading={stopLoading}
                />
            );
        });

        expect(MockedModal).toHaveBeenCalledTimes(4);
        expect(MockedButton).toHaveBeenCalledTimes(3);
        expect(MockedButton).toHaveBeenNthCalledWith(3, {
            children: "transformation_plan.invite_supplier",
            onClick: expect.any(Function),
            variant: "primary"
        }, {});
        await act(async () => {
            // @ts-ignore
            MockedButton.mock.calls[2][0].onClick();
        });
        expect(MockedModal).toHaveBeenCalledTimes(6);
        expect(MockedModal).toHaveBeenNthCalledWith(6, {
            show: true,
            handleClose: expect.anything(),
            handleConfirm: expect.anything(),
            title: 'transformation_plan.supplier_invitation',
            children: expect.anything(),
        }, {});

        await act(async () => {
            await MockedModal.mock.calls[5][0].handleConfirm();
        });
        component.update();
        expect(component.find('.ErrorText').length).toEqual(1);
        expect(component.find('.ErrorText').text()).toEqual("errors.company_invitation");

        expect(MockedFormControl).toHaveBeenCalledTimes(41);
        expect(MockedFormControl).toHaveBeenNthCalledWith(31, {
            type: "text",
            placeholder: "placeholders.transformation_plan.supplier_invitation",
            onChange: expect.any(Function)
        }, {});
        expect(MockedFormControl).toHaveBeenNthCalledWith(32, {
            type: "email",
            placeholder: "placeholders.trade.company_user_invitation",
            onChange: expect.any(Function)
        }, {});
        // wrong email format
        act(() => {
            // @ts-ignore
            MockedFormControl.mock.calls[30][0].onChange({target: {value: "newCompanyName"}});
            // @ts-ignore
            MockedFormControl.mock.calls[31][0].onChange({target: {value: "wrongemail@mail"}});
        });
        expect(MockedModal).toHaveBeenCalledTimes(10);
        await act(async () => {
            await MockedModal.mock.calls[9][0].handleConfirm();
        });

        component.update();
        expect(component.find('.ErrorText').length).toEqual(1);
        expect(component.find('.ErrorText').text()).toEqual("errors.email_validation");

    });

});
