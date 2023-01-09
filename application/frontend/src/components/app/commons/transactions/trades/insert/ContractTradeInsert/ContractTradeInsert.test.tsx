import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {useForm} from "react-hook-form";
import {Button, Form, Jumbotron} from "react-bootstrap";
import {act} from "react-dom/test-utils";
import TradeControllerApi from "../../../../../../../api/TradeControllerApi";
import DocumentControllerApi from "../../../../../../../api/DocumentControllerApi";
import {
    CompanyPresentable, DocumentRequest,
    DocumentTypePresentable,
    ProcessingStandard,
    TradePresentable,
    Unit,
    UserPresentable
} from "@unece/cotton-fetch";
import {useHistory} from "react-router-dom";
import {getBase64} from "../../../../../../../utils/basicUtils";
import {
    GenericDropdownSelector
} from "../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector";
// @ts-ignore
import Select from 'react-select';
import CTI, {ContractTradeInsert} from "./ContractTradeInsert";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import {Position} from "../TradeInsertion";

Enzyme.configure({adapter: new Adapter()});
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-hook-form', () => {
    return {
        useForm: jest.fn(),
    }
});

jest.mock("../../../../../../GenericComponents/SelectMenuButton/SelectMenuButton", () => {
    return {
        SelectMenuButton: jest.fn().mockImplementation(({children}) => <div
            className={'SelectMenuButton'}>{children}</div>)
    }
});

jest.mock("react-select", () => {
    return jest.fn().mockImplementation(({children}) => <div className={'Select'}>{children}</div>)
});

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn()
    }
});

jest.mock("../../../../../../../api/TradeControllerApi", () => {
    return {
        createContract: jest.fn()
    }
});

jest.mock("../../../../../../../api/DocumentControllerApi", () => {
    return {
        getDocumentTypes: jest.fn()
    }
});

jest.mock("../../../../../../../utils/basicUtils", () => {
    return {
        getBase64: jest.fn(),
        isSameOrAfterOrNotSet: jest.fn()
    }
});

jest.mock("../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector", () => {
    return {
        GenericDropdownSelector: jest.fn().mockImplementation(({children}) => <div
            className={'GenericDropdownSelector'}>{children}</div>)
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
    Form.Check = jest.fn().mockImplementation(({children}) => <div className={'FormCheck'}>{children}</div>);
    // @ts-ignore
    Form.Text = jest.fn().mockImplementation(({children}) => <div className={'FormText'}>{children}</div>);
    // @ts-ignore
    Form.File = jest.fn().mockImplementation(({children}) => <div className={'FormFile'}>{children}</div>);

    return {
        Button,
        Form,
        Jumbotron,
    };
});


describe('Contract insertion test', () => {
    const MockedUseForm = mocked(useForm, true);
    const MockedButton = mocked(Button, true);
    const MockedFormGroup = mocked(Form.Group, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedTradeControllerApi = mocked(TradeControllerApi, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedFormFile = mocked(Form.File, true);
    const MockedGetBase64 = mocked(getBase64, true);
    const MockedGenericDropdownSelector = mocked(GenericDropdownSelector, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedSelect = mocked(Select, true);

    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();
    const startLoading = jest.fn();
    const stopLoading = jest.fn();
    const getCompanies = jest.fn();
    const getMaterialsFromCompany = jest.fn();
    const addMaterial = jest.fn();
    const getAllUnits = jest.fn();
    const getAllProcessingStandards = jest.fn();
    const addPosition = jest.fn();
    const setDocument = jest.fn();
    const setMaterial = jest.fn();
    const isMaterialMissing = jest.fn();
    const selectCompany = jest.fn();
    const getUserFromEmailAddress = jest.fn();
    const setInvitationModalVisible = jest.fn();

    const companyEmailAddresses: string[] = [];
    const companies: CompanyPresentable[] = [];
    const allUnits: Unit[] = [];
    const allProcessingStandards: ProcessingStandard[] = [];
    const positions: Position[] = [{id: 0, material: undefined, unit: undefined}];
    const materialsError: boolean[] = [];
    const companySelected: { value: CompanyPresentable | undefined, label: string } = {value: undefined, label: ''};
    const userSelected: UserPresentable = {};
    const consigneeEmailSelected: { value: string, label: string } = {value: '', label: ''};
    const documentUploaded: DocumentRequest = {name: 'doc1', contentType: 'pdf', content: 'content base64'};
    const isInvitation: boolean = false;

    const userLoggedIn = {};
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        await act(async () => {
            mount(
                <Provider store={store}>
                    <CTI
                        getCompanyTraders={getCompanies}
                        getMaterialsByCompany={getMaterialsFromCompany}
                        addMaterial={addMaterial}
                        getAllUnits={getAllUnits}
                        getTradeProcessingStandards={getAllProcessingStandards}
                        addPosition={addPosition}
                        setDocument={setDocument}
                        setMaterial={setMaterial}
                        isMaterialMissing={isMaterialMissing}
                        selectCompany={selectCompany}
                        getUserFromEmailAddress={getUserFromEmailAddress}
                        setInvitationModalVisible={setInvitationModalVisible}

                        companies={companies}
                        companyEmailAddresses={companyEmailAddresses}
                        allUnits={allUnits}
                        tradeProcessingStandards={allProcessingStandards}
                        positions={positions}
                        materialsError={materialsError}
                        companySelected={companySelected}
                        userSelected={userSelected}
                        consigneeEmailSelected={consigneeEmailSelected}
                        documentUploaded={documentUploaded}
                        isInvitation={isInvitation}/>
                </Provider>
            )
        });

        await act(async () => {
            mount(
                <ContractTradeInsert
                    getCompanyTraders={getCompanies}
                    getMaterialsByCompany={getMaterialsFromCompany}
                    addMaterial={addMaterial}
                    getAllUnits={getAllUnits}
                    getTradeProcessingStandards={getAllProcessingStandards}
                    addPosition={addPosition}
                    setDocument={setDocument}
                    setMaterial={setMaterial}
                    isMaterialMissing={isMaterialMissing}
                    selectCompany={selectCompany}
                    getUserFromEmailAddress={getUserFromEmailAddress}
                    setInvitationModalVisible={setInvitationModalVisible}

                    companies={companies}
                    companyEmailAddresses={companyEmailAddresses}
                    allUnits={allUnits}
                    tradeProcessingStandards={allProcessingStandards}
                    positions={positions}
                    materialsError={materialsError}
                    companySelected={companySelected}
                    userSelected={userSelected}
                    consigneeEmailSelected={consigneeEmailSelected}
                    documentUploaded={documentUploaded}
                    isInvitation={isInvitation}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                    stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });
    });
    it('Render without crashing async', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        await act(async () => {
            await mount(
                <ContractTradeInsert
                    getCompanyTraders={getCompanies}
                    getMaterialsByCompany={getMaterialsFromCompany}
                    addMaterial={addMaterial}
                    getAllUnits={getAllUnits}
                    getTradeProcessingStandards={getAllProcessingStandards}
                    addPosition={addPosition}
                    setDocument={setDocument}
                    setMaterial={setMaterial}
                    isMaterialMissing={isMaterialMissing}
                    selectCompany={selectCompany}
                    getUserFromEmailAddress={getUserFromEmailAddress}
                    setInvitationModalVisible={setInvitationModalVisible}

                    companies={companies}
                    companyEmailAddresses={companyEmailAddresses}
                    allUnits={allUnits}
                    tradeProcessingStandards={allProcessingStandards}
                    positions={positions}
                    materialsError={materialsError}
                    companySelected={companySelected}
                    userSelected={userSelected}
                    consigneeEmailSelected={consigneeEmailSelected}
                    documentUploaded={documentUploaded}
                    isInvitation={isInvitation}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                    stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });
    });
    it('Content test', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        let component = mount(
            <ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        );
        expect(Jumbotron).toHaveBeenCalledTimes(1);
        expect(Form).toHaveBeenCalledTimes(1);
        expect(MockedFormGroup).toHaveBeenCalledTimes(14);
        expect(MockedFormLabel).toHaveBeenCalledTimes(14);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(1, {children: "trade.consignee"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(2, {children: "user_email"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(3, {children: "trade.contract_type"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(4, {children: "attachment"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(5, {children: "valid_from"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(6, {children: "valid_until"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(7, {children: "reference_standard"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(8, {children: "trade.contract_id"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(9, {children: "notes"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(10, {children: "material"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(11, {children: "positions.quantity"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(12, {children: "positions.unit"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(13, {children: "positions.weight"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(14, {children: "positions.material_description"}, {});

        expect(GenericDropdownSelector).toHaveBeenCalledTimes(1);
        expect(MockedGenericDropdownSelector).toHaveBeenNthCalledWith(1, {
            getItems: expect.any(Function),
            itemPropToShow: "name",
            selectItem: expect.any(Function),
            defaultText: "select_material",
            newItemFields: ["name"],
            onCreate: expect.any(Function),
            creationTitle: "material_name",
            createDisabled: expect.any(Function),
            required: true
        }, {});
        expect(MockedSelect).toHaveBeenCalledTimes(4);

        expect(component.find('h2').length).toEqual(2);
        expect(component.find('h2').at(0).text()).toEqual("transaction: contract");
    });

    it('Document upload test', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        MockedGetBase64.mockReturnValue(Promise.resolve("test content"));
        let component = mount(
            <ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        );

        expect(Form.Group).toHaveBeenCalledTimes(14);
        expect(Form.Label).toHaveBeenCalledTimes(14);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(4, {
            children: "attachment"
        }, {});
        expect(MockedFormFile).toHaveBeenCalledTimes(1);

        await act(async () => {
            MockedFormFile.mock.calls[0][0].onChange({
                target: {
                    files: [new File([new Blob(['a'.repeat(100)], {type: 'application/pdf'})], "testfile.pdf")]
                }
            });
        });

        expect(MockedFormFile.mock.calls[1][0].label).toEqual(documentUploaded.name);
    });

    it('Content test - add positions', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        let component = mount(
            <ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        );
        expect(Form.Group).toHaveBeenCalledTimes(14);
        expect(Form.Label).toHaveBeenNthCalledWith(10, {children: "material"}, {});
        expect(component.find('h2').at(1).text()).toEqual("line_items+");
        expect(component.find('h2').at(1).childAt(1).text()).toEqual("+");
        expect(MockedButton).toHaveBeenCalledTimes(2);
        MockedFormGroup.mockClear();
        MockedFormLabel.mockClear();
        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[0][0].onClick();
        });
        expect(addPosition).toHaveBeenCalledTimes(1);

    });

    it('addMaterial test', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        let component;
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(2);
        expect(MockedGenericDropdownSelector.mock.calls[1][0].defaultText).toEqual("select_material");

        // create new Material
        expect(MockedGenericDropdownSelector.mock.calls[0][0].creationTitle).toEqual("material_name");
        await act(async () => {
            // @ts-ignore
            MockedGenericDropdownSelector.mock.calls[0][0].onCreate({
                name: 'Material test name'
            });
        });

        expect(addMaterial).toHaveBeenCalledTimes(1);

    });

    it('consigneeEmail selected test', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        let component;
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        expect(MockedSelect).toHaveBeenCalledTimes(8);
        expect(getUserFromEmailAddress).not.toHaveBeenCalled();
        act(() => {
            // @ts-ignore
            MockedSelect.mock.calls[5][0].onChange({value: "test1@mail.ch"});
        });
        expect(getUserFromEmailAddress).toHaveBeenCalledTimes(1);
    });

    it('handleTransaction test', async () => {
        const pushMock = jest.fn();
        const handleSubmit = jest.fn();
        const contractRequest = {
            positions: [
                {
                    contractorMaterial: {
                        id: 1,
                        name: "cp test"
                    }
                }
            ],
            consigneeNameIndex: 1
        };
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: jest.fn(),
            // @ts-ignore
            // handleSubmit: jest.fn().mockImplementation(fn => value => fn(value)),
            handleSubmit: handleSubmit,
            errors: []
        });

        let component;
        const companies = [
            {id: 1, companyName: "company1"},
            {id: 2, companyName: "company2"},
            {id: 3, companyName: "company3"}
        ];
        const trade: TradePresentable = {// @ts-ignore
            contractorReferenceNumber: "431GL"
        }

        MockedTradeControllerApi.createContract.mockImplementation(() => Promise.resolve(trade));
        await act(async () => {
            component = mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });


        expect(MockedSelect).toHaveBeenNthCalledWith(3, {
            value: undefined,
            onChange: expect.any(Function),
            options: []
        }, {});

        // @ts-ignore
        expect(component.find('.Button').length).toEqual(2);
        // @ts-ignore
        expect(component.find('.Button').at(1).text()).toEqual("submit");

        expect(handleSubmit).toHaveBeenCalledTimes(2);

        // select a company
        await act(async () => {
            MockedSelect.mock.calls[0][0].onChange({target: {value: "1"}});
        });
        expect(selectCompany).toHaveBeenCalledTimes(1);

        // select a document type
        expect(MockedSelect).toHaveBeenCalledTimes(8);
        await act(async () => {
            MockedSelect.mock.calls[6][0].onChange({code: "12", name: "doc"});
        });

        expect(handleSubmit).toHaveBeenCalledTimes(3);
        await handleSubmit.mock.calls[2][0](contractRequest);

        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.contract_create");
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenNthCalledWith(1, '/');
    });

    it('handleTransaction test - no material', async () => {
        const pushMock = jest.fn();
        const handleSubmit = jest.fn();
        const contractRequest = {
            positions: [
                {
                    externalDescription: "description position"
                }
            ],
            consigneeNameIndex: 1
        };
        const isMaterialMissing = jest.fn().mockReturnValue(true);

        const companies = [
            {id: 1, companyName: "company1"},
            {id: 2, companyName: "company2"},
            {id: 3, companyName: "company3"}
        ];
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: jest.fn(),
            // @ts-ignore
            // handleSubmit: jest.fn().mockImplementation(fn => value => fn(value)),
            handleSubmit: handleSubmit,
            errors: []
        });

        let component;
        const trade: TradePresentable = {// @ts-ignore
            contractorReferenceNumber: "431GL"
        }

        MockedTradeControllerApi.createContract.mockImplementation(() => Promise.resolve(trade));
        await act(async () => {
            component = mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}  positions={positions}/>);
        });

        // @ts-ignore
        expect(component.find('.Button').length).toEqual(2);
        // @ts-ignore
        expect(component.find('.Button').at(1).text()).toEqual("submit");

        // select a company
        await act(async () => {
            MockedSelect.mock.calls[0][0].onChange({target: {value: "1"}});
        });
        expect(selectCompany).toHaveBeenCalledTimes(1);

        // select a document type
        expect(MockedSelect).toHaveBeenCalledTimes(8);
        await act(async () => {
            MockedSelect.mock.calls[6][0].onChange({code: "12", name: "doc"});
        });

        expect(handleSubmit).toHaveBeenCalledTimes(3);
        await handleSubmit.mock.calls[2][0](contractRequest);

        expect(isMaterialMissing).toHaveBeenCalledTimes(1);

        expect(addSuccessMessage).toHaveBeenCalledTimes(0);
        expect(addErrorMessage).toHaveBeenCalledTimes(0);
        expect(pushMock).toHaveBeenCalledTimes(0);
    });

    it('handleTransaction test - failed', async () => {
        const pushMock = jest.fn();
        const handleSubmit = jest.fn();
        const contractRequest = {
            positions: [
                {
                    contractorMaterial: {
                        id: 1,
                        name: "cp test"
                    }
                }
            ],
            consigneeNameIndex: 1
        };

        const companies = [
            {id: 1, companyName: "company1"},
            {id: 2, companyName: "company2"},
            {id: 3, companyName: "company3"}
        ];
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: jest.fn(),
            // @ts-ignore
            // handleSubmit: jest.fn().mockImplementation(fn => value => fn(value)),
            handleSubmit: handleSubmit,
            errors: []
        });

        let component;
        MockedTradeControllerApi.createContract.mockImplementation(() => Promise.reject("Generic Error"));
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        // @ts-ignore
        expect(component.find('.Button').length).toEqual(2);
        // @ts-ignore
        expect(component.find('.Button').at(1).text()).toEqual("submit");

        // select a company
        await act(async () => {
            MockedSelect.mock.calls[0][0].onChange({target: {value: "1"}});
        });
        expect(selectCompany).toHaveBeenCalledTimes(1);

        // select a document type
        expect(MockedSelect).toHaveBeenCalledTimes(8);
        await act(async () => {
            MockedSelect.mock.calls[6][0].onChange({code: "12", name: "doc"});
        });

        expect(handleSubmit).toHaveBeenCalledTimes(3);
        await handleSubmit.mock.calls[2][0](contractRequest);

        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.trade_insert: Generic Error");
    });

});

describe('Graphical behaviour', () => {
    const MockedUseForm = mocked(useForm, true);
    const MockedButton = mocked(Button, true);
    const MockedGenericDropdownSelector = mocked(GenericDropdownSelector, true);
    const MockedSelect = mocked(Select, true);
    const MockedDocumentControllerApi = mocked(DocumentControllerApi, true);

    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();
    const startLoading = jest.fn();
    const stopLoading = jest.fn();
    const getCompanies = jest.fn();
    const getMaterialsFromCompany = jest.fn();
    const addMaterial = jest.fn();
    const getAllUnits = jest.fn();
    const getAllProcessingStandards = jest.fn();
    const addPosition = jest.fn();
    const setDocument = jest.fn();
    const setMaterial = jest.fn();
    const isMaterialMissing = jest.fn();
    const selectCompany = jest.fn();
    const getUserFromEmailAddress = jest.fn();
    const setInvitationModalVisible = jest.fn();

    const companyEmailAddresses: string[] = [];
    const companies: CompanyPresentable[] = [];
    const allUnits: Unit[] = [];
    const allProcessingStandards: ProcessingStandard[] = [];
    const positions: Position[] = [{id: 0, material: undefined, unit: undefined}];
    const materialsError: boolean[] = [];
    const companySelected: { value: CompanyPresentable | undefined, label: string } = {value: undefined, label: ''};
    const userSelected: UserPresentable = {};
    const consigneeEmailSelected: { value: string, label: string } = {value: '', label: ''};
    const documentUploaded: DocumentRequest = {name: 'doc1', contentType: 'pdf', content: 'content base64'};
    const isInvitation: boolean = false;

    const userLoggedIn = {};
    

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('Add position', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        const positions: Position[] = [{id: 0, material: undefined, unit: undefined}, {
            id: 1,
            material: undefined,
            unit: undefined
        }];

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        let component = mount(
            <ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}  positions={positions}/>
        );
        expect(component.find('h2').at(1).text()).toEqual("line_items+");
        expect(component.find('h2').at(1).childAt(1).text()).toEqual("+");
        expect(MockedButton).toHaveBeenCalledTimes(2);

        // there are already 2 positions (as one position has been already added)
        expect(Form.Group).toHaveBeenCalledTimes(19);
        expect(Form.Label).toHaveBeenNthCalledWith(10, {children: "material"}, {});
        expect(Form.Label).toHaveBeenNthCalledWith(15, {children: "material"}, {});
    });

    it('Content test - getDocumentTypes option select', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        const docTypes: DocumentTypePresentable[] = [
            {code: "dc1", name: "doc1"},
            {code: "dc2", name: "doc2"},
            {code: "dc3", name: "doc3"},
        ];
        let component;

        MockedDocumentControllerApi.getDocumentTypes.mockReturnValue(Promise.resolve(docTypes));
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        if (component) {
            // @ts-ignore
            component.update();
            // @ts-ignore
            expect(component.find('.FormControl').length).toEqual(8);

            expect(MockedSelect).toHaveBeenCalledTimes(8);
            expect(MockedSelect.mock.calls[6][0].options).toEqual(docTypes.map(d => ({
                value: d,
                label: d.code + " - " + d.name
            })));
        }

        //test error
        expect(addErrorMessage).not.toHaveBeenCalled();
        MockedDocumentControllerApi.getDocumentTypes.mockReturnValue(Promise.reject("Generic error"));
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.document_types: Generic error");
    });

    it('Content test - getAllUnits option select', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        const allUnits: Unit[] = [
            {code: "123", name: "kg"},
            {code: "132", name: "ml"},
            {code: "321", name: "mm"},
        ];
        let component;
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        if (component) {
            // @ts-ignore
            expect(component.find('.FormControl').length).toEqual(8);
            // @ts-ignore
            expect(component.find('.FormControl').at(5).find('option').length).toEqual(4);
            // @ts-ignore
            expect(component.find('.FormControl').at(5).find('option').at(1).html()).toEqual("<option value=\"123\">123 - kg</option>")
            // @ts-ignore
            expect(component.find('.FormControl').at(5).find('option').at(2).html()).toEqual("<option value=\"132\">132 - ml</option>")
            // @ts-ignore
            expect(component.find('.FormControl').at(5).find('option').at(3).html()).toEqual("<option value=\"321\">321 - mm</option>")
        }
    });

    it('Content test - getCompanies option select', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        const companies = [
            {id: 1, companyName: "company1"},
            {id: 2, companyName: "company2"},
            {id: 3, companyName: "company3"},
        ];
        let component;
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        if (component) {
            // @ts-ignore
            expect(component.find('.FormControl').length).toEqual(8);

            expect(MockedSelect).toHaveBeenCalledTimes(4);
            expect(MockedSelect.mock.calls[0][0].options).toEqual(companies.map(c => ({
                value: c,
                label: c.companyName
            })));
        }
    });

    it('Content test - getAllProcessingStandards option select', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        const allProcessingStandards = [
            {name: "Proc standard 1"},
            {name: "Proc standard 2"},
            {name: "Proc standard 3"},
        ];
        let component;
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        if (component) {
            // @ts-ignore
            expect(component.find('.FormControl').length).toEqual(8);

            expect(MockedSelect).toHaveBeenCalledTimes(4);
            expect(MockedSelect.mock.calls[3][0].options).toEqual(allProcessingStandards.map(ps => ({
                value: ps,
                label: ps.name
            })));
        }
    });

    it('Content test - selectCompany option select', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        const companyEmailAddresses = [
            "test1@mail.ch",
            "test2@mail.ch",
            "test3@mail.ch"
        ];
        let component;
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        expect(MockedSelect).toHaveBeenCalledTimes(4);
        expect(MockedSelect).toHaveBeenNthCalledWith(2, {
            value: consigneeEmailSelected,
            onChange: expect.any(Function),
            options: companyEmailAddresses.map(email => ({value: email, label: email}))
        }, {});

        // selection of a company
        expect(selectCompany).not.toHaveBeenCalled();
        await act(async () => {
            // @ts-ignore
            MockedSelect.mock.calls[0][0].onChange({value: {companyName: "company1"}, label: "company1"});
        });
        expect(selectCompany).toHaveBeenCalledTimes(1);
    });

    it('Content test - materials interactions', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        let component;
        await act(async () => {
            component = await mount(<ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        await act(async () => {
            // @ts-ignore
            await MockedGenericDropdownSelector.mock.calls[0][0].selectItem({
                id: 1
            });
        });

        expect(getMaterialsFromCompany).not.toHaveBeenCalled();
        await act(async () => {
            MockedGenericDropdownSelector.mock.calls[0][0].getItems();
        });
        expect(getMaterialsFromCompany).toHaveBeenCalledTimes(1);

        expect(MockedGenericDropdownSelector.mock.calls[0][0].createDisabled({name: 'material test'})).toBeFalsy();
        expect(MockedGenericDropdownSelector.mock.calls[0][0].createDisabled({name: ''})).toBeTruthy();
    });

    it('Content test - valid until date input error', async () => {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const registerMock = jest.fn();
        let isValidated = false;

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: registerMock,
            handleSubmit: jest.fn(),
            errors: {validUntil: true},
            getValues: jest.fn()
        });

        let component = mount(
            <ContractTradeInsert
                getCompanyTraders={getCompanies}
                getMaterialsByCompany={getMaterialsFromCompany}
                addMaterial={addMaterial}
                getAllUnits={getAllUnits}
                getTradeProcessingStandards={getAllProcessingStandards}
                addPosition={addPosition}
                setDocument={setDocument}
                setMaterial={setMaterial}
                isMaterialMissing={isMaterialMissing}
                selectCompany={selectCompany}
                getUserFromEmailAddress={getUserFromEmailAddress}
                setInvitationModalVisible={setInvitationModalVisible}

                companies={companies}
                companyEmailAddresses={companyEmailAddresses}
                allUnits={allUnits}
                tradeProcessingStandards={allProcessingStandards}
                positions={positions}
                materialsError={materialsError}
                companySelected={companySelected}
                userSelected={userSelected}
                consigneeEmailSelected={consigneeEmailSelected}
                documentUploaded={documentUploaded}
                isInvitation={isInvitation}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        );

        expect(component.find('.ErrorText')).toHaveLength(1);

        // the day have to be > of today
        expect(registerMock).toHaveBeenCalledTimes(9);
        isValidated = registerMock.mock.calls[2][0].validate(yesterday)
        expect(isValidated).toBeFalsy();
    });
});
