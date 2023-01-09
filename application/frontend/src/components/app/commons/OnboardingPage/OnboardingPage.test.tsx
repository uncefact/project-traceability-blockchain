import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {useForm} from "react-hook-form";
import {Button, Form, Jumbotron} from "react-bootstrap";
import {act} from "react-dom/test-utils";
// @ts-ignore
import Select from 'react-select';
import OP, {OnboardingPage} from "./OnboardingPage";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import {useHistory} from "react-router-dom";
import CompanyControllerApi from "../../../../api/CompanyControllerApi";
import InfoControllerApi from "../../../../api/InfoControllerApi";
import {ErrorCard} from "../../../GenericComponents/ErrorCard/ErrorCard";
import {SuccessModal} from "../../../GenericComponents/SuccessModal/SuccessModal";
import {OnboardingRequest} from "@unece/cotton-fetch";

Enzyme.configure({adapter: new Adapter()});
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock("react-router-dom", () => {
    return {
        useHistory: jest.fn(),
        useRouteMatch: jest.fn()
    }
})

jest.mock('react-hook-form', () => {
    return {
        useForm: jest.fn(),
    }
});

jest.mock("react-select", () => {
    return jest.fn().mockImplementation(({children}) => <div className={'Select'}>{children}</div>)
});

jest.mock("../../../GenericComponents/ErrorCard/ErrorCard", () => {
    return {
        ErrorCard: jest.fn().mockImplementation(({children}) => <div className={'ErrorCard'}>{children}</div>)
    }
});

jest.mock("../../../GenericComponents/SuccessModal/SuccessModal", () => {
    return {
        SuccessModal: jest.fn().mockImplementation(({children}) => <div className={'SuccessModal'}>{children}</div>)
    }
});

jest.mock("../../../../api/CompanyControllerApi", () => {
    return {
        getCompanyFromToken: jest.fn(),
        postCompanyOnboarding: jest.fn()
    }
});

jest.mock("../../../../api/InfoControllerApi", () => {
    return {
        getAllCountries: jest.fn(),
        getCompanyRoles: jest.fn()
    }
});

jest.mock('react-bootstrap', () => {
    let Button = jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>);
    let Form = jest.fn().mockImplementation(({children}) => <div className={'Form'}>{children}</div>);
    let Jumbotron = jest.fn().mockImplementation(({children}) => <div className={'Jumbotron'}>{children}</div>);
    let InputGroup = jest.fn().mockImplementation(({children}) => <div className={'InputGroup'}>{children}</div>);

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
    InputGroup.Text = jest.fn().mockImplementation(({children}) => <div className={'InputGroupText'}>{children}</div>)

    return {
        Button,
        Form,
        Jumbotron,
        InputGroup
    };
});


describe('Onboarding page test', () => {
    const MockedUseForm = mocked(useForm, true);
    const MockedButton = mocked(Button, true);
    const MockedFormGroup = mocked(Form.Group, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedSelect = mocked(Select, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedCompanyControllerApi = mocked(CompanyControllerApi, true);
    const MockedInfoControllerApi = mocked(InfoControllerApi, true);
    const MockedErrorCard = mocked(ErrorCard, true);
    const MockedSuccessModal = mocked(SuccessModal, true);

    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('Render without crashing', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors
        });

        await act(async () => {
            mount(
                <Provider store={store}>
                    <OP />
                </Provider>
            )
        });

        await act(async () => {
            mount(
                <OnboardingPage
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage} />
            );
        });
    });
    it('Render without crashing async', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors
        });

        await act(async () => {
            await mount(
                <OnboardingPage
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage} />
            );
        });
    });

    it('Content test', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors
        });

        MockedInfoControllerApi.getCompanyRoles.mockReturnValue(Promise.resolve([]));
        MockedInfoControllerApi.getAllCountries.mockReturnValue(Promise.resolve([]));
        MockedCompanyControllerApi.getCompanyFromToken.mockReturnValue(Promise.resolve({companyName: "companyTest"}));

        let component : any = null;
        await act(async () => {
            component = await mount(<OnboardingPage
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage} />
            );
        });

        expect(component.find("h1").at(0).text()).toEqual("login.title");
        expect(component.find("h1").at(1).text()).toEqual("onboarding.company_registration");
        expect(component.find("h1").at(2).text()).toEqual("onboarding.user_registration");
        expect(component.find("h1").at(3).text()).toEqual("onboarding.login_registration");
        expect(component.find("aside").length).toEqual(1);
        expect(Jumbotron).toHaveBeenCalledTimes(4);
        expect(Form).toHaveBeenCalledTimes(4);
        expect(MockedFormGroup).toHaveBeenCalledTimes(80);
        expect(MockedFormLabel).toHaveBeenCalledTimes(80);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(1, {children: "name"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(2, {children: "code"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(3, {children: "role"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(4, {children: "website"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(5, {children: "country"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(6, {children: "state"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(7, {children: "city"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(8, {children: "address"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(9, {children: "latitude"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(10, {children: "longitude"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(11, {children: "user.firstname"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(12, {children: "user.lastname"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(13, {children: "email"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(14, {children: "user.phone_number"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(15, {children: "state"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(16, {children: "city"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(17, {children: "zip_code"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(18, {children: "address"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(19, {children: "username"},{});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(20, {children: "password"},{});

        expect(MockedSelect).toHaveBeenCalledTimes(8);
        expect(MockedSelect).toHaveBeenNthCalledWith(7, {
            value: {value: undefined, label: "placeholders.onboarding.role"},
            onChange: expect.any(Function),
            options: []
        }, {});
        expect(MockedSelect).toHaveBeenNthCalledWith(8, {
            value: {value: undefined, label: "placeholders.country"},
            onChange: expect.any(Function),
            options: []
        }, {});
    });

    it('Content test - token to redeem wrong', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const pushMock = jest.fn();

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors
        });

        MockedInfoControllerApi.getCompanyRoles.mockReturnValue(Promise.resolve([]));
        MockedInfoControllerApi.getAllCountries.mockReturnValue(Promise.resolve([]));
        MockedCompanyControllerApi.getCompanyFromToken.mockImplementation(() => Promise.reject("Generic error"));

        let component = undefined;
        await act(async () => {
            mount(
                component = <OnboardingPage
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage} />
            );
        });

        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.invited_company: Generic error");
        expect(MockedErrorCard).toHaveBeenCalledTimes(2);
        expect(MockedErrorCard).toHaveBeenNthCalledWith(2, {
            title: "cannot_access",
            children: expect.anything()
        }, {});
        expect(MockedErrorCard.mock.calls[1][0].children.props.children).toEqual("errors.onboarding.wrong_token");
    });

    it('Content test - onboarding success', async () => {
        const mockedRegister = jest.fn();
        const mockedHandleSubmit = jest.fn();
        // @ts-ignore
        const mockedErrors = [];
        const pushMock = jest.fn();

        const roles = [{name: "role1"}, {name: "role2"}];
        const countries = [{name: "country1", code: "c1"}, {name: "country2", code: "c2"}];

        const onboardingRequest : OnboardingRequest = {
            companyName: "companyAdded",
            companyCode: "com1",
            userFirstName: "user fistname",
            userLastName: "user lastname",
            userCity: "city of user",
            username: "username new"
        };

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: mockedRegister,
            handleSubmit: mockedHandleSubmit,
            // @ts-ignore
            errors: mockedErrors
        });

        MockedInfoControllerApi.getCompanyRoles.mockReturnValue(Promise.resolve(roles));
        MockedInfoControllerApi.getAllCountries.mockReturnValue(Promise.resolve(countries));
        MockedCompanyControllerApi.getCompanyFromToken.mockReturnValue(Promise.resolve({companyName: "companyTest"}));
        MockedCompanyControllerApi.postCompanyOnboarding.mockReturnValue(Promise.resolve());

        let component = undefined;
        await act(async () => {
            mount(
                component = <OnboardingPage
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage} />
            );
        });

        expect(MockedSelect).toHaveBeenCalledTimes(8);
        expect(MockedSelect).toHaveBeenNthCalledWith(7, {
            value: {value: undefined, label: "placeholders.onboarding.role"},
            onChange: expect.any(Function),
            options: roles.map(r => ({value: r, label: r.name}))
        }, {});
        expect(MockedSelect).toHaveBeenNthCalledWith(8, {
            value: {value: undefined, label: "placeholders.country"},
            onChange: expect.any(Function),
            options: countries.map(c => ({value: c, label: c.code + " - " + c.name}))
        }, {});

        //select the role and country from menu
        act(() => {
            MockedSelect.mock.calls[6][0].onChange({value: roles[0], label: roles[0].name});
        });
        act(() => {
           MockedSelect.mock.calls[7][0].onChange({value: countries[0], label: countries[0].code + " - " + countries[0].name});
        });

        expect(MockedSuccessModal).not.toHaveBeenCalled();

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(6);
        await mockedHandleSubmit.mock.calls[5][0](onboardingRequest);
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.company_onboarding");

        // now success modal appears
        expect(MockedSuccessModal).toHaveBeenCalledTimes(2);
        expect(MockedSuccessModal).toHaveBeenNthCalledWith(2, {
            show: true,
            handleClose: expect.any(Function),
            handleConfirm: expect.any(Function),
            title: "onboarding.success_title",
            buttonText: "onboarding.modal_proceed",
            children: expect.anything()
        }, {});

        // get the paragraph children of the message
        expect(MockedSuccessModal.mock.calls[1][0].children.props.children[0].props.children).toEqual("onboarding.success_company");
        expect(MockedSuccessModal.mock.calls[1][0].children.props.children[1].props.children).toEqual("onboarding.success_user");
        expect(MockedSuccessModal.mock.calls[1][0].children.props.children[2].props.children).toEqual("onboarding.success_proceed");

        act(() => {
            MockedSuccessModal.mock.calls[1][0].handleConfirm();
        });
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenNthCalledWith(1, '/login');

    });

});
