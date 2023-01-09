import Enzyme, {mount} from "enzyme";
import React, {Component} from "react";
import {act} from "react-dom/test-utils";
import Adapter from "enzyme-adapter-react-16";
import MCI, {MaterialCertificationInsert} from "./MaterialCertificationInsert";
import {useForm} from "react-hook-form";
import {
    AssessmentTypePresentable, CertificationRequest,
    CompanyPresentable, DocumentRequest,
    DocumentTypePresentable, MaterialPresentable, ProcessingStandardPresentable,
    ProcessType,
    ProductCategory, TradePresentable, UserPresentable
} from "@unece/cotton-fetch";
import MaterialControllerApi from "../../../../../../../api/MaterialControllerApi";
import CompanyControllerApi from "../../../../../../../api/CompanyControllerApi";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import {GenericDropdownSelector} from "../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector";
import {mocked} from "ts-jest/utils";
import {Button, Form} from "react-bootstrap";
// @ts-ignore
import Select from 'react-select';
import moment from "moment";
import {getBase64} from "../../../../../../../utils/basicUtils";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {CertificationAttachment} from "../CertificationAttachment/CertificationAttachment";
import {SelectMenuButton} from "../../../../../../GenericComponents/SelectMenuButton/SelectMenuButton";

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

jest.mock("react-select", () => {
    return jest.fn().mockImplementation(({children}) => <div className={'Select'}>{children}</div>)
});

jest.mock("../../../../../../GenericComponents/SelectMenuButton/SelectMenuButton", () => {
    return {
        SelectMenuButton: jest.fn().mockImplementation(({children}) => <div className={'SelectMenuButton'}>{children}</div>)
    }
});

jest.mock('../CertificationAttachment/CertificationAttachment', () => {
    return {
        CertificationAttachment: jest.fn().mockImplementation(({children}) => <div className={'CertificationAttachment'}>{children}</div>)
    }
});

jest.mock("../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector", () => {
    return {
        GenericDropdownSelector: jest.fn().mockImplementation(({children}) => <div className={'GenericDropdownSelector'}>{children}</div>)
    }
});

jest.mock("../../../../../../GenericComponents/GenericCard/GenericCard", () => {
    return {
        GenericCard: jest.fn().mockImplementation(({children}) => <div className={'GenericCard'}>{children}</div>)
    }
});

jest.mock("../../../../../../../api/CertificationControllerApi", () => {
   return {
       createCertification: jest.fn()
   }
});

jest.mock("../../../../../../../api/CompanyControllerApi", () => {
   return {
       getCompanyEmails: jest.fn()
   }
});

jest.mock("../../../../../../../api/MaterialControllerApi", () => {
    return {
        addMaterialFromCompany: jest.fn()
    }
});

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(),
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
        Jumbotron,
    };
});

describe('Material certification insert test', () => {
    const MockedUseForm = mocked(useForm, true);
    const MockedFormGroup = mocked(Form.Group, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedSelect = mocked(Select, true);
    const MockedCertificationControllerApi = mocked(CertificationControllerApi, true);
    const MockedCompanyControllerApi = mocked(CompanyControllerApi, true);
    const MockedMaterialControllerApi = mocked(MaterialControllerApi, true);
    const MockedGenericDropdownSelector = mocked(GenericDropdownSelector, true);
    const MockedButton = mocked(Button, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedCertificationAttachment = mocked(CertificationAttachment, true);

    const selectCompany = jest.fn();
    const companySelected : {value: CompanyPresentable | undefined, label: string} = {value: {companyName: "companyTest"}, label: "companyTest"};
    const consigneeEmailSelected = {value: "testemail@test.ch", label: "testemail@test.ch"};
    const getUserFromEmailAddress = jest.fn();
    const companyEmailAddresses : string[] = ['address1@mail.ch', 'address2@mail.ch'];
    const getMaterialsByCompany = jest.fn();
    const checkValidUntilDate = jest.fn();
    const getApprovers = jest.fn();
    const approvers : CompanyPresentable[] = [{companyName: "company1"}, {companyName: "company2"}];
    const getAssessmentTypes = jest.fn();
    const getAllProcessTypes = jest.fn();
    const getAllProductCategories = jest.fn();
    const handleDocumentUpload = jest.fn();
    const getCertificationDocumentTypes = jest.fn();
    const getProcessingStandards = jest.fn();
    const isInvitation = false;

    const setAssessmentTypeSelected = jest.fn();
    const setProcessingStandardSelected = jest.fn();
    const setProductCategoriesSelected = jest.fn();
    const setProcessesTypeSelected = jest.fn();
    const setDocumentTypeSelected = jest.fn();
    const setDocumentUploaded = jest.fn();
    const setInvitationModalVisible = jest.fn();
    // @ts-ignore
    const assessmentTypeSelected : AssessmentTypePresentable = undefined;
    const assessmentTypes : AssessmentTypePresentable[] = [{name: 'assessmentType1'}, {name: 'assessmentType2'}];
    const documentUploaded = {};
    const shippingsReferenceNumberSelected : TradePresentable[] = [];
    const userSelected : UserPresentable = {};
    const documentTypes : DocumentTypePresentable[] = [{code: '123', name: 'doc1'}, {code: '1234', name: 'doc2'}];
    // @ts-ignore
    const documentTypeSelected : DocumentTypePresentable = undefined;
    const productCategories : ProductCategory[] = [{name: 'prodCategory1'}, {name: 'prodCategory2'}];
    const productCategoriesSelected : ProductCategory[] = [{name: 'prodCategory1'}];
    const processTypes : ProcessType[] = [{name: 'processType1'}, {name: 'processType2'}];
    const processesTypeSelected : ProcessType[] = [{name: 'processType1'}, {name: 'processType2'}];
    const processingStandards : ProcessingStandardPresentable[] = [{name: 'procStandard1'}, {name: 'procStandard2'}];
    // @ts-ignore
    const processingStandardSelected : ProcessingStandardPresentable = undefined;
    const materials : MaterialPresentable[] = [{id: 1, name: 'material1'}, {id: 2, name: 'material2'}];

    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();
    const startLoading = jest.fn();
    const stopLoading = jest.fn();
    const userLoggedIn = {};
    // @ts-ignore
    const uneceCottonTracking : UneceCottonTracking = {};

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
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
            mount(
                <Provider store={store}>
                    <MCI
                        selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                        getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                        getMaterialsByCompany={getMaterialsByCompany}
                        checkValidUntilDate={checkValidUntilDate}
                        getApprovers={getApprovers} approvers={approvers}
                        getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                        getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                        getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                        handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                        getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                        getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                        assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                        shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                        userSelected={userSelected}
                        materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}/>
                </Provider>
            );
        });

        await act(async () => {
            mount(<MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />);
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

        await act(async () => {
            mount(<MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />);
        });

        expect(MockedFormGroup).toHaveBeenCalledTimes(12);
        expect(MockedFormLabel).toHaveBeenCalledTimes(12);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(1, {children: 'company'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(2, {children: 'user_email'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(3, {children: 'document_type'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(4, {children: 'attachment'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(5, {children: 'reference_standard'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(6, {children: 'assessment_type'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(7, {children: 'certification.product_categories'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(8, {children: 'issue_date'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(9, {children: 'valid_until'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(10, {children: 'certification.report_id'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(11, {children: 'material'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(12, {children: 'notes'}, {});

        expect(MockedCertificationAttachment).toHaveBeenCalledTimes(1);
        expect(MockedCertificationAttachment).toHaveBeenNthCalledWith(1, {
            register: expect.any(Function),
            fileUploaded: documentUploaded,
            setFileUploaded: setDocumentUploaded
        }, {});

        expect(MockedSelect).toHaveBeenCalledTimes(6);
        expect(MockedSelect).toHaveBeenNthCalledWith(1, {
            value: {value: {companyName: "companyTest"}, label: "companyTest"},
            onChange: selectCompany,
            options: approvers.map(a => ({value: a, label: a.companyName})),
            components: {MenuList: expect.anything()}
        }, {});
        expect(MockedSelect).toHaveBeenNthCalledWith(2, {
            value: {value: "testemail@test.ch", label: "testemail@test.ch"},
            onChange: expect.any(Function),
            options: companyEmailAddresses.map(a => ({value: a, label: a}))
        }, {});
        expect(MockedSelect).toHaveBeenNthCalledWith(3, {
            value: null,
            onChange: expect.any(Function),
            options: documentTypes.map(d => ({value: d, label: d.code + " - " + d.name}))
        }, {});
        expect(MockedSelect).toHaveBeenNthCalledWith(4, {
            value: null,
            onChange: expect.any(Function),
            options: processingStandards.map(p => ({value: p, label: p.name})),
            isClearable: true
        }, {});
        expect(MockedSelect).toHaveBeenNthCalledWith(5, {
            value: null,
            onChange: expect.any(Function),
            options: assessmentTypes.map(a => ({value: a, label: a.name}))
        }, {});
        expect(MockedSelect).toHaveBeenNthCalledWith(6, {
            value: productCategoriesSelected.map(p => {
                return {
                    value: p,
                    label: p?.name
                };
            }),
            isMulti: true,
            onChange: expect.any(Function),
            options: productCategories.map(p => ({value: p, label: p.name}))
        }, {});

        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(1);
        expect(MockedGenericDropdownSelector).toHaveBeenNthCalledWith(1, {
            getItems: expect.any(Function),
            itemPropToShow: "name",
            selectItem: expect.any(Function),
            defaultText: "select_material",
            newItemFields: ["name"],
            onCreate: expect.any(Function),
            creationTitle: "material_name",
            createDisabled: expect.any(Function),
            required: true,
            disabled: companySelected === undefined
        }, {});

        expect(MockedButton).toHaveBeenCalledTimes(1);
        expect(MockedButton).toHaveBeenNthCalledWith(1, {
            variant: "primary",
            type: "submit",
            children: "submit"
        }, {});
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
            component = mount(<MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />);
        });

        await act(async () => {
            // @ts-ignore
            MockedGenericDropdownSelector.mock.calls[0][0].selectItem({id: 1});
            MockedGenericDropdownSelector.mock.calls[0][0].getItems();
        });

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
            errors: { validUntil: true },
            getValues: jest.fn()
        });

        let component = mount(
            <MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />
        );

        expect(component.find('.ErrorText')).toHaveLength(1);

        // the day have to be > of today
        expect(registerMock).toHaveBeenCalledTimes(4);
        isValidated = registerMock.mock.calls[1][0].validate(yesterday)
        expect(isValidated).toBeFalsy();
    });

    it('addMaterial from dropdown test', async () => {
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

        const materialAdded : MaterialPresentable = { name: "material1" };

        MockedMaterialControllerApi.addMaterialFromCompany.mockReturnValue(Promise.resolve(materialAdded));
        await act(async () => {
            mount(<MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />);
        });

        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(1);
        await act(async () => {
           MockedGenericDropdownSelector.mock.calls[0][0].onCreate({name: "material1"}) ;
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, "popups.loading.material_add");
        expect(MockedMaterialControllerApi.addMaterialFromCompany).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.material_add");


        // add material error
        MockedMaterialControllerApi.addMaterialFromCompany.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            mount(<MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />);
        });

        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(4);
        await act(async () => {
            await expect(MockedGenericDropdownSelector.mock.calls[3][0].onCreate({name: "material1"})).rejects.toThrow("Material already exists!");
        });

        expect(MockedMaterialControllerApi.addMaterialFromCompany).toHaveBeenCalledTimes(2);
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.material_add: Generic error");

    });

    it('handleCertification test', async () => {
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

        const date = moment().toDate();
        const certificationRequest: CertificationRequest = {
            consigneeCompanyName: 'consigneeCompanyNameTest',
            consigneeEmail: 'consigneeEmailTest',
            validFrom: date,
            validUntil: date,
            certificateReferenceNumber: 'certificateReferenceNumberTest',
            notes: 'notesTest',
            certificatePageUrl: 'https://www.test.ch'
        };
        const companySelectedEmails = ['test1@mail.ch', 'test2@mail.ch'];
        const documentUploaded : DocumentRequest = {content: "Content file"};

        MockedCertificationControllerApi.createCertification.mockReturnValue(Promise.resolve({}));
        MockedCompanyControllerApi.getCompanyEmails.mockReturnValue(Promise.resolve(companySelectedEmails));
        await act(async () => {
            mount(<MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />);
        });

        expect(MockedSelect).toHaveBeenCalledTimes(6);
        //Set certificationTypeCode
        act(() => {
            MockedSelect.mock.calls[2][0].onChange({value: {code: 'certificationTypeCodeTest'}})
        });
        //Set processingStandardName
        act(() => {
            MockedSelect.mock.calls[3][0].onChange({value: {name: 'processingStandardName'}})
        });
        //Set assessmentName
        act(() => {
            MockedSelect.mock.calls[4][0].onChange({value: {name: 'assessmentNameTest'}})
        });
        //Set productCategoryCodeList
        act(() => {
            MockedSelect.mock.calls[5][0].onChange([{value: {code: 'productCategoryCode1Test'}}, {value: {code: 'productCategoryCode2Test'}}])
        });

        // select a material from dropdown in order to pass material missing check
        expect(GenericDropdownSelector).toHaveBeenCalledTimes(1);
        act(() => {
            MockedGenericDropdownSelector.mock.calls[0][0].selectItem({name: 'material1'});
        });

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(2);
        await act(async () => {
            mockedHandleSubmit.mock.calls[1][0](certificationRequest);
        });

        expect(MockedCertificationControllerApi.createCertification).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.certification_created");
    });

    it('handleCertification failed due to document not uploaded', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        const date = moment().toDate();
        const certificationRequest: CertificationRequest = {
            consigneeCompanyName: 'consigneeCompanyNameTest',
            consigneeEmail: 'consigneeEmailTest',
            validFrom: date,
            validUntil: date,
            certificateReferenceNumber: 'certificateReferenceNumberTest',
            notes: 'notesTest',
        };

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        MockedCertificationControllerApi.createCertification.mockReturnValue(Promise.resolve({}));
        let component : any = null;
        await act(async () => {
            component = mount(<MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />);
        });

        // select a material from dropdown in order to pass material missing check
        expect(GenericDropdownSelector).toHaveBeenCalledTimes(1);
        act(() => {
            MockedGenericDropdownSelector.mock.calls[0][0].selectItem({name: 'material1'});
        });

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(2);

        await act(async () => {
            mockedHandleSubmit.mock.calls[1][0](certificationRequest);
        });

        expect(MockedCertificationControllerApi.createCertification).not.toHaveBeenCalled();

        component.update();
        expect(component.find('.ErrorText').at(0).text()).toEqual("errors.certification.document_url_upload");

    });

    it('handleCertification failed due to wrong document URL', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const mockedGetValues = jest.fn();

        const date = moment().toDate();
        const certificationRequest: CertificationRequest = {
            consigneeCompanyName: 'consigneeCompanyNameTest',
            consigneeEmail: 'consigneeEmailTest',
            validFrom: date,
            validUntil: date,
            certificateReferenceNumber: 'certificateReferenceNumberTest',
            notes: 'notesTest',
            certificatePageUrl: 'www.test.ch'
        };
        const documentUploaded : DocumentRequest = {content: "Content file"};

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors,
            getValues: mockedGetValues
        });

        MockedCertificationControllerApi.createCertification.mockReturnValue(Promise.resolve({}));
        let component : any = null;
        await act(async () => {
            component = mount(<MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />);
        });

        // select a material from dropdown in order to pass material missing check
        expect(GenericDropdownSelector).toHaveBeenCalledTimes(1);
        act(() => {
            MockedGenericDropdownSelector.mock.calls[0][0].selectItem({name: 'material1'});
        });

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(2);

        await act(async () => {
            mockedHandleSubmit.mock.calls[1][0](certificationRequest);
        });

        expect(MockedCertificationControllerApi.createCertification).not.toHaveBeenCalled();

        component.update();
        expect(component.find('.ErrorText').at(0).text()).toEqual("errors.certification.url");

    });

    it('isMaterialMissing test during handleCertification()', async () => {
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

        const date = moment().toDate();
        const certificationRequest: CertificationRequest = {
            consigneeCompanyName: 'consigneeCompanyNameTest',
            consigneeEmail: 'consigneeEmailTest',
            validFrom: date,
            validUntil: date,
            certificateReferenceNumber: 'certificateReferenceNumberTest',
            notes: 'notesTest',
        };
        const companySelectedEmails = ['test1@mail.ch', 'test2@mail.ch'];

        MockedCertificationControllerApi.createCertification.mockReturnValue(Promise.resolve({}));
        MockedCompanyControllerApi.getCompanyEmails.mockReturnValue(Promise.resolve(companySelectedEmails));
        await act(async () => {
            mount(<MaterialCertificationInsert
                selectCompany={selectCompany} companySelected={companySelected} consigneeEmailSelected={consigneeEmailSelected}
                getUserFromEmailAddress={getUserFromEmailAddress} companyEmailAddresses={companyEmailAddresses}
                getMaterialsByCompany={getMaterialsByCompany}
                checkValidUntilDate={checkValidUntilDate}
                getApprovers={getApprovers} approvers={approvers}
                getAssessmentTypes={getAssessmentTypes} setAssessmentTypeSelected={setAssessmentTypeSelected}
                getProcessTypes={getAllProcessTypes} setProcessesTypeSelected={setProcessesTypeSelected} processTypes={processTypes} processesTypeSelected={processesTypeSelected}
                getAllProductCategories={getAllProductCategories} setProductCategoriesSelected={setProductCategoriesSelected} productCategories={productCategories} productCategoriesSelected={productCategoriesSelected}
                handleDocumentUpload={handleDocumentUpload} documentUploaded={documentUploaded} setDocumentUploaded={setDocumentUploaded}
                getCertificationDocumentTypes={getCertificationDocumentTypes} setDocumentTypeSelected={setDocumentTypeSelected} documentTypes={documentTypes} documentTypeSelected={documentTypeSelected}
                getProcessingStandards={getProcessingStandards} setProcessingStandardSelected={setProcessingStandardSelected}
                assessmentTypeSelected={assessmentTypeSelected} assessmentTypes={assessmentTypes} processingStandards={processingStandards} processingStandardSelected={processingStandardSelected}
                shippingsReferenceNumberSelected={shippingsReferenceNumberSelected}
                userSelected={userSelected}
                materials={materials} isInvitation={isInvitation} setInvitationModalVisible={setInvitationModalVisible}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage} startLoading={startLoading} stopLoading={stopLoading} userLoggedIn={userLoggedIn} />);
        });

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(1);
        await act(async () => {
            mockedHandleSubmit.mock.calls[0][0](certificationRequest);
        });
    });
});