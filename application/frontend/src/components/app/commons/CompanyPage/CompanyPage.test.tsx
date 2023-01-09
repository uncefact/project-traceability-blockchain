import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Button, Form, Jumbotron} from "react-bootstrap";
import {act} from "react-dom/test-utils";
import CompanyControllerApi from "../../../../api/CompanyControllerApi";
import InfoControllerApi from "../../../../api/InfoControllerApi";
import {useHistory} from "react-router-dom";
// @ts-ignore
import CP, {CompanyPage} from "./CompanyPage";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {useForm} from "react-hook-form";
import {Company, CompanyRequest, Country} from "@unece/cotton-fetch";
import {Modal} from "../../../GenericComponents/Modal/Modal";
// @ts-ignore
import Select from 'react-select';
import {SelfCertificationView} from "../transactions/certifications/view/SelfCertificationView/SelfCertificationView";

Enzyme.configure({ adapter: new Adapter() });
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

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn()
    }
});

jest.mock("../../../../api/CompanyControllerApi", () => {
    return {
        updateCompany: jest.fn()
    }
});

jest.mock("../../../../api/InfoControllerApi", () => {
    return {
        getAllCountries: jest.fn()
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

    return {
        Button,
        Form,
        Jumbotron
    };
});



describe('CompanyPage test', () => {
    const MockedCompanyControllerApi = mocked(CompanyControllerApi, true);
    const MockedInfoControllerApi = mocked(InfoControllerApi, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedUseForm = mocked(useForm, true);
    const MockedSelect = mocked(Select, true);

    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();
    const setUserLoggedIn = jest.fn();
    const userLoggedIn = {
        company: {
            country: {code: "TS", name: "Test"}
        }
    };
    const handleLogout = jest.fn();

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

        mount(
            <Provider store={store}>
                <CP />
            </Provider>
        );
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
                <CompanyPage
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}
                    setUserLoggedIn={setUserLoggedIn}
                    
                />
            );
        });
    });

    it('Content test - generic', async () => {
        const countries : Country[] = [{code: "CH", name: "Switzerland"}];

        MockedInfoControllerApi.getAllCountries.mockReturnValue(Promise.resolve(countries));

        let component: any = null;
        await act(async () => {
            component = await mount(<CompanyPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}

            />);
        });

        expect(Jumbotron).toHaveBeenCalledTimes(3);
        expect(Form).toHaveBeenCalledTimes(3);
        expect(Form.Group).toHaveBeenCalledTimes(36);
        expect(Form.Control).toHaveBeenCalledTimes(33);
        expect(component.find('h2').length).toEqual(1);
        expect(component.find('h2').text()).toEqual("company");
        expect(component.find('.Button').length).toEqual(1);
        expect(component.find('.Button').at(0).text()).toEqual("confirm");

        expect(MockedFormLabel).toHaveBeenCalledTimes(36);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(1,{children: 'name'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(2,{children: 'code'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(3,{children: 'state'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(4,{children: 'country'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(5,{children: 'city'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(6,{children: 'zip_code'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(7,{children: 'address 1'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(8,{children: 'address 2'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(9,{children: 'latitude'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(10,{children: 'longitude'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(11,{children: 'sector'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(12,{children: 'website'}, {});

        expect(MockedSelect).toHaveBeenCalledTimes(3);
        expect(MockedSelect).toHaveBeenNthCalledWith(3, {
            value: {value: {code: userLoggedIn?.company?.country?.code, name: userLoggedIn?.company?.country?.name},
            label: userLoggedIn?.company?.country?.code + " - " + userLoggedIn?.company?.country?.name
            },
            onChange: expect.any(Function),
            options: countries.map(c => ({value: c, label: c.code + " - " + c.name}))
        }, {});

    });

    it("handleUpdate test", async () => {
        const pushMock = jest.fn();
        const handleSubmit = jest.fn();
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

        const companyRequest : CompanyRequest = {
            name: "Company name",
            code: "Code 1",
            state: "LU",
            country: "CH"
        };
        const updatedCompany : Company = {
            companyName: companyRequest.name,
            companyCode: companyRequest.code
        };

        MockedCompanyControllerApi.updateCompany.mockReturnValue(Promise.resolve(updatedCompany));
        let component: any = null;
        await act(async () => {
            component = await mount(<CompanyPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}

            />);
        });

        expect(MockedSelect).toHaveBeenCalledTimes(3);
        act(() => {
           MockedSelect.mock.calls[2][0].onChange({code: "CH", name: "Switzerland"});
        });

        // confirm changes
        expect(MockedCompanyControllerApi.updateCompany).not.toHaveBeenCalled();
        expect(setUserLoggedIn).not.toHaveBeenCalled();

        expect(handleSubmit).toHaveBeenCalledTimes(4);
        await act(async () => {
            await handleSubmit.mock.calls[3][0](companyRequest);
        });

        expect(MockedCompanyControllerApi.updateCompany).toHaveBeenCalledTimes(1);
        expect(setUserLoggedIn).toHaveBeenCalledTimes(1);
        expect(setUserLoggedIn).toHaveBeenNthCalledWith(1, {
            ...userLoggedIn,
            company: updatedCompany
        });

        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.company_update");
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenNthCalledWith(1, '/');

        // test error
        MockedCompanyControllerApi.updateCompany.mockImplementation(() => Promise.reject("Error"));
        await act(async () => {
            component = await mount(<CompanyPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}

            />);
        });

        expect(handleSubmit).toHaveBeenCalledTimes(7);
        await act(async () => {
            await handleSubmit.mock.calls[6][0](companyRequest);
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.company_update: Error");

    });

});
