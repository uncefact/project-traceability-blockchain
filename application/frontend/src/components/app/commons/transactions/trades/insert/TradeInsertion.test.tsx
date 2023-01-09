import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {mocked} from "ts-jest/utils";
import {act} from "react-dom/test-utils";
import TradeControllerApi from "../../../../../../api/TradeControllerApi";
import CompanyControllerApi from "../../../../../../api/CompanyControllerApi";
import MaterialControllerApi from "../../../../../../api/MaterialControllerApi";
import UnitControllerApi from "../../../../../../api/UnitControllerApi";
import UserControllerApi from "../../../../../../api/UserControllerApi";
import {
    CompanyPresentable, MaterialPresentable,
    Unit,
    User, UserPresentable
} from "@unece/cotton-fetch";
import T, {Position, TradeInsertion} from "./TradeInsertion";
import {getBase64} from "../../../../../../utils/basicUtils";
import {Modal} from "../../../../../GenericComponents/Modal/Modal";
import {Form} from "react-bootstrap";


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

jest.mock("../../../../../../api/CompanyControllerApi", () => {
    return {
        getCompanyTraders: jest.fn(),
        getCompanyEmails: jest.fn()
    }
});

jest.mock("../../../../../../api/UserControllerApi", () => {
    return {
        getUserFromEmailAddress: jest.fn()
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

jest.mock("../../../../../../api/UnitControllerApi", () => {
    return {
        getAllUnits: jest.fn()
    }
});

jest.mock("../../../../../../utils/basicUtils", () => {
    return {
        // @ts-ignore
        ...jest.requireActual("../../../../../../utils/basicUtils"),
        getBase64: jest.fn()
    }
});

describe('Shipping insertion test', () => {
    const MockedCompanyControllerApi = mocked(CompanyControllerApi, true);
    const MockedMaterialControllerApi = mocked(MaterialControllerApi, true);
    const MockedUnitControllerApi = mocked(UnitControllerApi, true);
    const MockedUserControllerApi = mocked(UserControllerApi, true);
    const MockedTradeControllerApi = mocked(TradeControllerApi, true);
    const MockedGetBase64 = mocked(getBase64, true);
    const MockedModal = mocked(Modal, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedFormGroup = mocked(Form.Group, true);
    const MockedFormText = mocked(Form.Text, true);
    const MockedFormControl = mocked(Form.Control, true);

    const startLoading = jest.fn();
    const stopLoading = jest.fn();
    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();

    const userLoggedIn: User = {
        firstname: 'test',
        company: {
            companyName: "companyTest"
        }
    };
    // @ts-ignore
    const uneceCottonTracking : UneceCottonTracking = {};

    jest.useFakeTimers();


    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);
        mount(
            <Provider store={store}>
                <T component={GenericComponent}/>
            </Provider>
        );
        mount(
            <TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />
        );
    });
    it('Render without crashing async', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);
        await act(async () => {
            await mount(
                <TradeInsertion
                    component={GenericComponent}
                    addErrorMessage={addErrorMessage}
                    addSuccessMessage={addSuccessMessage}
                    startLoading={startLoading}
                    stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn}
                    />
            );
        });
    });

    it('Modal invitation render and interaction', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);
        let component: any = null;
        await act(async () => {
            component = await mount(
                <TradeInsertion
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
            title: "trade.company_invitation",
            children: expect.anything()
        }, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(1, {children: "trade.consignee"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(2, {children: "user_email"}, {});
        expect(MockedFormText).toHaveBeenNthCalledWith(1, {className:"text-muted", children: "company_invitation_hint"}, {});
        expect(MockedFormControl).toHaveBeenCalledTimes(2);
        expect(MockedFormControl).toHaveBeenNthCalledWith(1, {
            type: "text",
            placeholder: "placeholders.trade.company_invitation",
            onChange: expect.any(Function)
        }, {});
        expect(MockedFormControl).toHaveBeenNthCalledWith(2, {
            type: "email",
            placeholder: "placeholders.trade.company_user_invitation",
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

    it('getCompanies test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        const companies = [
            {id: 1, companyName: "company1"},
            {id: 2, companyName: "company2"},
            {id: 3, companyName: "company3"},
        ];
        const companyEmailAddresses = [
            "test1@mail.ch",
            "test2@mail.ch",
            "test3@mail.ch"
        ];
        let component;
        MockedCompanyControllerApi.getCompanyTraders.mockReturnValue(new Promise<CompanyPresentable[]>((resolve => resolve(companies))));
        MockedCompanyControllerApi.getCompanyEmails.mockReturnValue(new Promise<string[]>(resolve => resolve(companyEmailAddresses)));
        await act(async () => {
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act(async () => {
            GenericComponent.mock.calls[0][0].getCompanyTraders();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].companies).toEqual(companies);

        // test company logged removed
        await act(async () => {
            GenericComponent.mock.calls[1][0].getCompanyTraders("company2");
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);

        // test error getCompanies
        MockedCompanyControllerApi.getCompanyTraders.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act(async () => {
            GenericComponent.mock.calls[1][0].getCompanyTraders();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.company_traders: Generic error");

    });

    it('getTradeProcessingStandards', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        let component;

        const processingStandards = [
            { name: "Processing standard 1" },
            { name: "Processing standard 2" },
            { name: "Processing standard 3" }
        ];
        MockedTradeControllerApi.getTradeProcessingStandards.mockReturnValue(Promise.resolve(processingStandards));

        await act(async () => {
            component = mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act (async () => {
            GenericComponent.mock.calls[0][0].getTradeProcessingStandards();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].tradeProcessingStandards).toEqual(processingStandards);

        // test error
        MockedTradeControllerApi.getTradeProcessingStandards.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).not.toHaveBeenCalled();
        await act (async () => {
            GenericComponent.mock.calls[1][0].getTradeProcessingStandards();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.processing_standards: Generic error");

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
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act(async () => {
            GenericComponent.mock.calls[0][0].getUserFromEmailAddress("test@mail.ch");
        });
        expect(GenericComponent).toHaveBeenCalledTimes(3);
        expect(GenericComponent.mock.calls[2][0].consigneeEmailSelected).toEqual({value: "test@mail.ch", label: "test@mail.ch"});
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

    it('selectCompany and getCompanyEmailAddresses test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        const companies = [
            {id: 1, companyName: "company1"},
            {id: 2, companyName: "company2"},
            {id: 3, companyName: "company3"},
        ];
        const companyEmailAddresses = [
            "test1@mail.ch",
            "test2@mail.ch",
            "test3@mail.ch"
        ];
        let component;
        MockedCompanyControllerApi.getCompanyTraders.mockReturnValue(new Promise<CompanyPresentable[]>((resolve => resolve(companies))));
        MockedCompanyControllerApi.getCompanyEmails.mockReturnValue(new Promise<string[]>(resolve => resolve(companyEmailAddresses)));
        await act(async () => {
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);

        await act(async () => {
            GenericComponent.mock.calls[0][0].selectCompany({value: companies[1], label: companies[1].companyName});
        });
        expect(GenericComponent).toHaveBeenCalledTimes(4);
        expect(GenericComponent.mock.calls[3][0].consigneeEmailSelected).toEqual({value: companyEmailAddresses[0], label: companyEmailAddresses[0]});
        expect(GenericComponent.mock.calls[3][0].companySelected).toEqual({value: companies[1], label: companies[1].companyName});
        expect(GenericComponent.mock.calls[3][0].companyEmailAddresses).toEqual(companyEmailAddresses);

        // test company deselected
        await act(async () => {
            GenericComponent.mock.calls[3][0].selectCompany({value: undefined, label: ""});
        });
        expect(GenericComponent.mock.calls[4][0].companyEmailAddresses).toEqual([]);
        expect(GenericComponent.mock.calls[4][0].userSelected).toEqual({});
        expect(GenericComponent.mock.calls[4][0].companySelected).toEqual({value: undefined, label: "placeholders.select_company"});

        // test error getUserFromEmailAddress
        MockedCompanyControllerApi.getCompanyEmails.mockImplementation(() => Promise.reject("Generic error"));
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        await act(async () => {
            GenericComponent.mock.calls[4][0].selectCompany({value: companies[1], label: companies[1].companyName});
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(2);
        expect(addErrorMessage).toHaveBeenNthCalledWith(2, "popups.errors.company_email: Generic error");

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
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(1);
        let respMaterials = undefined;
        await act(async () => {
            respMaterials = await GenericComponent.mock.calls[0][0].getMaterialsByCompany(false, true, "");
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(respMaterials).toEqual(materials);

        // test error
        expect(addErrorMessage).toHaveBeenCalledTimes(0);
        MockedMaterialControllerApi.getMaterialsByCompany.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            GenericComponent.mock.calls[0][0].getMaterialsByCompany();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.materials_from_company: Generic error");

    });

    it('getAllUnits test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        const units : Unit[] = [
            {code: "123", name: "kg"},
            {code: "132", name: "ml"},
            {code: "321", name: "mm"},
        ];
        let component;
        MockedUnitControllerApi.getAllUnits.mockReturnValue(new Promise<MaterialPresentable[]>((resolve => resolve(units))));
        await act(async () => {
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act(async () => {
            GenericComponent.mock.calls[0][0].getAllUnits();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].allUnits).toEqual(units);

        // test error
        expect(addErrorMessage).toHaveBeenCalledTimes(0);
        MockedUnitControllerApi.getAllUnits.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            GenericComponent.mock.calls[1][0].getAllUnits();
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.units: Generic error");

    });

        it('addPosition test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);
        const positions : Position[] = [
            {
                id: 0,
                material: undefined,
                unit: undefined
            },
            {
                id: 1,
                material: undefined,
                unit: undefined
            }
        ];
        let component;
        await act(async () => {
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        act(() => {
            GenericComponent.mock.calls[0][0].addPosition();
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].positions).toEqual(positions);

    });

    it('setMaterial test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);
        const material : MaterialPresentable = {
            name: 'Red wire test',
            id: 1
        };
        let component;
        await act(async () => {
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        act(() => {
            GenericComponent.mock.calls[0][0].setMaterial(0, material);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].positions[0].material).toEqual(material);

    });

    it('addMaterial test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);
        const material : MaterialPresentable = {
            name: 'Red wire test',
            id: 1
        };
        let component;
        MockedMaterialControllerApi.addMaterialFromCompany.mockReturnValue(new Promise<MaterialPresentable>((resolve => resolve(material))));
        await act(async () => {
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        await act(async () => {
            // @ts-ignore
            GenericComponent.mock.calls[0][0].addMaterial(material, 0);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(3);
        expect(GenericComponent.mock.calls[2][0].materialsError).toEqual([false]);
        expect(GenericComponent.mock.calls[2][0].positions[0].material).toEqual(material);
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.material_add");

        // test error
        expect(addErrorMessage).toHaveBeenCalledTimes(0);
        MockedMaterialControllerApi.addMaterialFromCompany.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            expect(GenericComponent.mock.calls[2][0].addMaterial(material, 0)).rejects.toThrow("Material already exists!");
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.material_add: Generic error");
    });

    it('setDocument test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);

        const file = new File([new Blob(['a'.repeat(100)])],  "testfile.pdf", {type:'application/pdf'});

        MockedGetBase64.mockReturnValue(Promise.resolve("test content"));

        let component;
        await act(async () => {
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });

        await act(async () => {
           GenericComponent.mock.calls[0][0].setDocument(file);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(GenericComponent.mock.calls[1][0].documentUploaded).toEqual({name: file.name, contentType: file.type, content: "test content"});
    });

    it('isMaterialMissing test', async () => {
        const GenericComponent = jest.fn().mockImplementation(() => <div>Component</div>);
        let positions : Position[] = [
            {
                id: 0,
                material: {
                    id: 2
                },
                unit: undefined
            },
            {
                id: 1,
                material: undefined,
                unit: undefined
            }
        ];
        let returnValue = false;

        let component;
        await act(async () => {
            component = await mount(<TradeInsertion
                component={GenericComponent}
                addErrorMessage={addErrorMessage}
                addSuccessMessage={addSuccessMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={userLoggedIn}
                />);
        });

        expect(GenericComponent).toHaveBeenCalledTimes(1);
        act(() => {
            returnValue = GenericComponent.mock.calls[0][0].isMaterialMissing(positions);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(2);
        expect(returnValue).toBeTruthy();
        expect(GenericComponent.mock.calls[1][0].materialsError[1]).toBeTruthy();

        positions = [
            {
                id: 0,
                material: {
                    id: 2
                },
                unit: undefined
            },
            {
                id: 1,
                material: {
                    id: 3
                },
                unit: undefined
            }
        ];

        act(() => {
            returnValue = GenericComponent.mock.calls[1][0].isMaterialMissing(positions);
        });
        expect(GenericComponent).toHaveBeenCalledTimes(3);
        expect(returnValue).toBeFalsy();
        expect(GenericComponent.mock.calls[2][0].materialsError[1]).toBeFalsy();

    });

});