import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {mocked} from "ts-jest/utils";
import {act} from "react-dom/test-utils";
import CompanyControllerApi from "../../../../../../api/CompanyControllerApi";
import MaterialControllerApi from "../../../../../../api/MaterialControllerApi";
import UserControllerApi from "../../../../../../api/UserControllerApi";
import DocumentControllerApi from "../../../../../../api/DocumentControllerApi";
import CertificationControllerApi from "../../../../../../api/CertificationControllerApi";
import ProcessTypeControllerApi from "../../../../../../api/ProcessTypeControllerApi";
import {
    AssessmentTypePresentable,
    CompanyPresentable,
    DocumentTypePresentable,
    MaterialPresentable,
    ProcessingStandardPresentable,
    ProcessType,
    ProductCategory,
    User,
    UserPresentable
} from "@unece/cotton-fetch";
import T, {CertificationInsertion} from "./CertificationInsertion";
import {getBase64} from "../../../../../../utils/basicUtils";
import {Form} from "react-bootstrap";
import {Modal} from "../../../../../GenericComponents/Modal/Modal";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock("../../../../../GenericComponents/Modal/Modal", () => {
    return {
        Modal: jest.fn().mockImplementation(({children}) => <div className={'Modal'}>{children}</div>)
    }
});

jest.mock("../../../../../../api/CompanyControllerApi", () => {
    return {
        getCompanies: jest.fn(),
        getCompanyEmails: jest.fn(),
        getCompanyApprovers: jest.fn()
    }
});

jest.mock("../../../../../../api/UserControllerApi", () => {
    return {
        getUserFromEmailAddress: jest.fn()
    }
});

jest.mock("../../../../../../api/DocumentControllerApi", () => {
    return {
        getDocumentTypes: jest.fn()
    }
});

jest.mock("../../../../../../api/TradeControllerApi", () => {
    return {
        getTradeProcessingStandards: jest.fn()
    }
});

jest.mock("../../../../../../api/MaterialControllerApi", () => {
    return {
        getMaterialsByCompany: jest.fn(),
        addMaterialFromCompany: jest.fn()
    }
});

jest.mock("../../../../../../utils/basicUtils", () => {
    return {
        // @ts-ignore
        ...jest.requireActual("../../../../../../utils/basicUtils"),
        getBase64: jest.fn()
    }
});

jest.mock("../../../../../../api/CertificationControllerApi", () => {
    return {
        getCertificationProcessingStandards: jest.fn(),
        getAssessmentTypes: jest.fn(),
        getAllProductCategories: jest.fn()
    }
});

jest.mock("../../../../../../api/ProcessTypeControllerApi", () => {
    return {
        getProcessTypes: jest.fn(),
    }
});

jest.mock("react-router-dom", () => {
   return {
       useRouteMatch: jest.fn()
   }
});

jest.mock('react-bootstrap', () => {
    let Form = jest.fn().mockImplementation(({children}) => <div className={'Form'}>{children}</div>);

    // @ts-ignore
    Form.Group = jest.fn().mockImplementation(({children}) => <div className={'FormGroup'}>{children}</div>);
    // @ts-ignore
    Form.Label = jest.fn().mockImplementation(({children}) => <div className={'FormLabel'}>{children}</div>);
    // @ts-ignore
    Form.Text = jest.fn().mockImplementation(({children}) => <div className={'FormText'}>{children}</div>);
    // @ts-ignore
    Form.Control = jest.fn().mockImplementation(({children}) => <div className={'FormControl'}>{children}</div>);

    return {
        Form,
        Button: jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>)
    };
});

describe('Certification insertion test', () => {
    const MockedCompanyControllerApi = mocked(CompanyControllerApi, true);
    const MockedMaterialControllerApi = mocked(MaterialControllerApi, true);
    const MockedUserControllerApi = mocked(UserControllerApi, true);
    const MockedCertificationControllerApi = mocked(CertificationControllerApi, true);
    const MockedProcessTypeControllerApi = mocked(ProcessTypeControllerApi, true);
    const MockedDocumentControllerApi = mocked(DocumentControllerApi, true);
    const MockedGetBase64 = mocked(getBase64, true);
    const MockedModal = mocked(Modal, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedFormGroup = mocked(Form.Group, true);
    const MockedFormText = mocked(Form.Text, true);
    const MockedFormControl = mocked(Form.Control, true);

    const startLoading = jest.fn();
    const stopLoading = jest.fn();

    jest.useFakeTimers();

    const userLoggedIn: User = {
        firstname: 'test',
        company: {
            companyName: "companyTest"
        }
    };
    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();
    // @ts-ignore
    const uneceCottonTracking : UneceCottonTracking = {};

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        const Component = jest.fn().mockImplementation(() => <div>Component</div>);
        mount(
            <Provider store={store}>
                <T component={Component}/>
            </Provider>
        );
        mount(
            <CertificationInsertion
                component={Component}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />
        );
    });
    it('Render without crashing async', async () => {
        const Component = jest.fn().mockImplementation(() => <div>Component</div>);
        await act(async () => {
            await mount(
                <CertificationInsertion
                    component={Component}
                    addErrorMessage={addErrorMessage}
                    addSuccessMessage={addSuccessMessage}
                    userLoggedIn={userLoggedIn}
                    startLoading={startLoading}
                    stopLoading={stopLoading}

                />
            );
        });

    });

    it('Modal invitation render and interaction', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);
        let component: any = null;
        await act(async () => {
            component = await mount(
                <CertificationInsertion
                    component={GenericComponent}
                    addErrorMessage={addErrorMessage}
                    addSuccessMessage={addSuccessMessage}
                    startLoading={startLoading}
                    stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn}
                />
            );
        });

        expect(Form).toHaveBeenCalledTimes(1);
        expect(MockedModal).toHaveBeenCalledTimes(1);
        expect(MockedFormGroup).toHaveBeenCalledTimes(2);
        expect(MockedFormLabel).toHaveBeenCalledTimes(2);
        expect(MockedFormText).toHaveBeenCalledTimes(1);
        expect(MockedModal).toHaveBeenNthCalledWith(1, {
            show: false,
            handleClose: expect.any(Function),
            handleConfirm: expect.any(Function),
            title: "certification.company_invitation",
            children: expect.anything()
        }, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(1, {children: "certifier"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(2, {children: "user_email"}, {});
        expect(MockedFormText).toHaveBeenNthCalledWith(1, {className:"text-muted", children: "company_invitation_hint"}, {});
        expect(MockedFormControl).toHaveBeenCalledTimes(2);
        expect(MockedFormControl).toHaveBeenNthCalledWith(1, {
            type: "text",
            placeholder: "placeholders.certification.company_invitation",
            onChange: expect.any(Function)
        }, {});
        expect(MockedFormControl).toHaveBeenNthCalledWith(2, {
            type: "email",
            placeholder: "placeholders.certification.company_user_invitation",
            onChange: expect.any(Function)
        }, {});

        // interaction and invitation

        // field missing error
        act(() => {
            // @ts-ignore
            MockedFormControl.mock.calls[0][0].onChange({target: {value: "newCompanyName"}});
        });
        await act(async () => {
            await MockedModal.mock.calls[0][0].handleConfirm();
        });
        component.update();
        expect(addSuccessMessage).not.toHaveBeenCalled();
        expect(component.find(".ErrorText").at(0).text()).toEqual("errors.company_invitation");

        // email format error
        expect(MockedFormControl).toHaveBeenCalledTimes(6);
        act(() => {
            // @ts-ignore
            MockedFormControl.mock.calls[5][0].onChange({target: {value: "newUserEmail"}});
        });
        expect(MockedModal).toHaveBeenCalledTimes(4);
        await act(async () => {
            await MockedModal.mock.calls[3][0].handleConfirm();
        });
        component.update();
        expect(component.find(".ErrorText").at(0).text()).toEqual("errors.email_validation");

        // correct email address
        expect(MockedFormControl).toHaveBeenCalledTimes(10);
        act(() => {
            // @ts-ignore
            MockedFormControl.mock.calls[9][0].onChange({target: {value: "newUserEmail@mail.ch"}});
        });
        expect(MockedModal).toHaveBeenCalledTimes(6);
        await act(async () => {
            await MockedModal.mock.calls[5][0].handleConfirm();
        });
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.invitation_submit");


        // close modal
        act(() => {
            MockedModal.mock.calls[5][0].handleClose();
        });
        expect(MockedModal).toHaveBeenCalledTimes(8);
        expect(MockedModal.mock.calls[7][0].show).toBeFalsy();


    });

    it('selectCompany and getCompanyEmailAddress test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        const company = {value: {companyName: "company1"}, label: "company1"};

        const companyEmailAddresses = [
            "test1@mail.ch",
            "test2@mail.ch",
            "test3@mail.ch"
        ];
        let component;
        MockedCompanyControllerApi.getCompanyEmails.mockReturnValue(new Promise<string[]>(resolve => resolve(companyEmailAddresses)));
        await act(async () => {
            component = await mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act(async () => {
            GenericComponent.mock.calls[0][0].selectCompany(company);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(5);
        expect(GenericComponent.mock.calls[4][0].companySelected).toEqual(company);
        expect(GenericComponent.mock.calls[4][0].companyEmailAddresses).toEqual(companyEmailAddresses);

        //test company not selected
        await act(async () => {
            GenericComponent.mock.calls[4][0].selectCompany({value: undefined});
        });
        expect(GenericComponent).toHaveBeenCalledTimes(6);
        expect(GenericComponent.mock.calls[5][0].companyEmailAddresses).toEqual([]);
        expect(GenericComponent.mock.calls[5][0].companySelected).toEqual({value: undefined, label: "placeholders.select_company"});
        expect(GenericComponent.mock.calls[5][0].userSelected).toEqual({});

        // test error getCompanyEmailAddress
        MockedCompanyControllerApi.getCompanyEmails.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            component = await mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(7);
        await act(async () => {
            GenericComponent.mock.calls[6][0].selectCompany(company);
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.company_email: Generic error");

    });

    it('getProcessingStandards test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        let component;

        const processingStandards = [
            { name: "Processing standard 1" },
            { name: "Processing standard 2" },
            { name: "Processing standard 3" }
        ];
        MockedCertificationControllerApi.getCertificationProcessingStandards.mockReturnValue(Promise.resolve(processingStandards));

        await act(async () => {
            component = mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act (async () => {
            GenericComponent.mock.calls[0][0].getProcessingStandards();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].processingStandards).toEqual(processingStandards);

        // test error
        MockedCertificationControllerApi.getCertificationProcessingStandards.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act (async () => {
            GenericComponent.mock.calls[1][0].getProcessingStandards();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.certification_processing_standard: Generic error");

    });

    it('getApprovers test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        let component;

        const companies : CompanyPresentable[] = [
            { companyName: "Company 1" },
            { companyName: "Company 2" }
        ];
        MockedCompanyControllerApi.getCompanyApprovers.mockReturnValue(Promise.resolve(companies));

        await act(async () => {
            component = mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act (async () => {
            GenericComponent.mock.calls[0][0].getApprovers();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].approvers).toEqual(companies);

        // test error
        MockedCompanyControllerApi.getCompanyApprovers.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act (async () => {
            GenericComponent.mock.calls[1][0].getApprovers();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.approvers: Generic error");

    });

    it('getAssessmentTypes test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        let component;

        const assessmentTypes : AssessmentTypePresentable[] = [
            { name: "Assessment type 1" },
            { name: "Assessment type 2" }
        ];
        MockedCertificationControllerApi.getAssessmentTypes.mockReturnValue(Promise.resolve(assessmentTypes));

        await act(async () => {
            component = mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act (async () => {
            GenericComponent.mock.calls[0][0].getAssessmentTypes();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].assessmentTypes).toEqual(assessmentTypes);

        // test error
        MockedCertificationControllerApi.getAssessmentTypes.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act (async () => {
            GenericComponent.mock.calls[1][0].getAssessmentTypes();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.assessment_types: Generic error");
    });

    it('getAllProcessTypes test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        let component;

        const processTypes : ProcessType[] = [
            { name: "Process type 1" },
            { name: "Process type 2" }
        ];
        MockedProcessTypeControllerApi.getProcessTypes.mockReturnValue(Promise.resolve(processTypes));

        await act(async () => {
            component = mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act (async () => {
            GenericComponent.mock.calls[0][0].getProcessTypes();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].processTypes).toEqual(processTypes);

        // test error
        MockedProcessTypeControllerApi.getProcessTypes.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act (async () => {
            GenericComponent.mock.calls[1][0].getProcessTypes();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.process_types: Generic error");
    });

    it('getAllProductCategories test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        let component;

        const productCategories : ProductCategory[] = [
            { name: "Prod category 1" },
            { name: "Prod category 2" }
        ];
        MockedCertificationControllerApi.getAllProductCategories.mockReturnValue(Promise.resolve(productCategories));

        await act(async () => {
            component = mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act (async () => {
            GenericComponent.mock.calls[0][0].getAllProductCategories();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].productCategories).toEqual(productCategories);

        // test error
        MockedCertificationControllerApi.getAllProductCategories.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act (async () => {
            GenericComponent.mock.calls[1][0].getAllProductCategories();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.product_categories: Generic error");
    });

    it('handleDocumentUpload test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        const file = new File([new Blob(['a'.repeat(100)])],  "testfile.pdf", {type:'application/pdf'});

        let component;

        MockedGetBase64.mockReturnValue(Promise.resolve("test content"));
        await act(async () => {
            component = mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act (async () => {
            GenericComponent.mock.calls[0][0].handleDocumentUpload(file);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].documentUploaded).toEqual({name: file.name, contentType: file.type, content: "test content"});

    });

    it('getCertificationDocumentTypes test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        let component;

        const documentTypes : DocumentTypePresentable[] = [
            { name: "Document type 1", code: "1" },
            { name: "Document type 2", code: "2" }
        ];
        MockedDocumentControllerApi.getDocumentTypes.mockReturnValue(Promise.resolve(documentTypes));

        await act(async () => {
            component = mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act (async () => {
            GenericComponent.mock.calls[0][0].getCertificationDocumentTypes();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].documentTypes).toEqual(documentTypes);

        // test error
        MockedDocumentControllerApi.getDocumentTypes.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act (async () => {
            GenericComponent.mock.calls[1][0].getCertificationDocumentTypes();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.document_types: Generic error");
    });

    it('getProcessingStandards test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        let component;

        const processingStandards : ProcessingStandardPresentable[] = [
            { name: "Processing standard 1" },
            { name: "Processing standard 2" }
        ];
        MockedCertificationControllerApi.getCertificationProcessingStandards.mockReturnValue(Promise.resolve(processingStandards));

        await act(async () => {
            component = mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act (async () => {
            GenericComponent.mock.calls[0][0].getProcessingStandards();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].processingStandards).toEqual(processingStandards);

        // test error
        MockedCertificationControllerApi.getCertificationProcessingStandards.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act (async () => {
            GenericComponent.mock.calls[1][0].getProcessingStandards();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.certification_processing_standard: Generic error");
    });

    it('getUserFromEmailAddress test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        const user = {
            firstName: "Mario",
            lastName: "Rossi",
            city: "Lugano"
        };
        let component;
        MockedUserControllerApi.getUserFromEmailAddress.mockReturnValue(new Promise<UserPresentable>((resolve => resolve(user))));
        await act(async () => {
            component = await mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act(async () => {
            GenericComponent.mock.calls[0][0].getUserFromEmailAddress("test@mail.ch");
        });
        expect(GenericComponent).toHaveBeenCalledTimes(3);
        expect(GenericComponent.mock.calls[2][0].userSelected).toEqual(user);

        // test error getUserFromEmailAddress
        MockedUserControllerApi.getUserFromEmailAddress.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).toHaveBeenCalledTimes(0);
        await act(async () => {
            GenericComponent.mock.calls[1][0].getUserFromEmailAddress("test@mail.ch");
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.user_from_email: Generic error");

    });

    it('getMaterialsByCompany test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        const materials = [
            {id: 1, name: "red wire"},
            {id: 2, name: "blue wire"},
            {id: 3, name: "green wire"},
        ];
        let component;
        MockedMaterialControllerApi.getMaterialsByCompany.mockReturnValue(new Promise<MaterialPresentable[]>((resolve => resolve(materials))));
        await act(async () => {
            component = await mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(1);
        let respMaterials = undefined;
        await act(async () => {
            respMaterials = await GenericComponent.mock.calls[0][0].getMaterialsByCompany(false, false, userLoggedIn.company?.companyName);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(respMaterials).toEqual([...materials, ...materials]);

        // test error
        expect(addErrorMessage).toHaveBeenCalledTimes(0);
        MockedMaterialControllerApi.getMaterialsByCompany.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            GenericComponent.mock.calls[0][0].getMaterialsByCompany(true, false, "");
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.materials_from_company: Generic error");

    });

    it('checkValidUntilDate test ', async () => {
        let yesterday = new Date(), today = new Date(), isValidated = false;
        yesterday.setDate(yesterday.getDate() - 1);

        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);
        let component;
        await act(async () => {
            component = await mount(<CertificationInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                userLoggedIn={userLoggedIn}
                startLoading={startLoading}
                stopLoading={stopLoading}

            />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        act(() => {
            isValidated = GenericComponent.mock.calls[0][0].checkValidUntilDate(today.getTime(), yesterday);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(1);
        expect(isValidated).toBeTruthy();

        // case no valid from is inserted
        act(() => {
            isValidated = GenericComponent.mock.calls[0][0].checkValidUntilDate(today.getTime(), undefined);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(1);
        expect(isValidated).toBeFalsy();
    });

});