import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import LP, {LoginPage} from "./LoginPage";
import React from "react";
import {mocked} from "ts-jest/utils";
import {useForm} from "react-hook-form";
import {Button, Form, InputGroup} from "react-bootstrap";
import {act} from "react-dom/test-utils";
import {User} from "@unece/cotton-fetch";

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
jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn().mockReturnValue({push: jest.fn()})
    }
});
jest.mock('react-bootstrap', () => {
    let Button = jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>);
    let Form = jest.fn().mockImplementation(({children}) => <div className={'Form'}>{children}</div>);
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
    InputGroup.Text = jest.fn().mockImplementation(({children}) => <div className={'InputGroupText'}>{children}</div>);
    return {
        Button,
        Form,
        InputGroup
    };
});

describe('LoginPage test', () => {
    const MockedUseForm = mocked(useForm, true);
    const MockedButton = mocked(Button, true);
    const MockedForm = mocked(Form, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedInputGroupText = mocked(InputGroup.Text, true);

    const userLoggedIn: User = {};

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: jest.fn(),
            handleSubmit: jest.fn(),
            errors: jest.fn(),
        });
        const handleLogin = jest.fn();
        mount(
            <Provider store={store}>
                <LP handleLogin={handleLogin}/>
            </Provider>
        );
        mount(
            <LoginPage handleLogin={handleLogin} userLoggedIn={userLoggedIn} />
        );
    });
    it('Form content test', async () => {
        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: jest.fn(),
            handleSubmit: jest.fn(),
            errors: {
                username: {
                    type: 'required'
                },
                password: {
                    type: 'required'
                }
            }
        });
        const handleLogin = jest.fn();
        const component = mount(
            <LoginPage handleLogin={handleLogin} userLoggedIn={userLoggedIn} />
        );

        expect(component.find('h1').text()).toEqual("login.title")
        expect(MockedFormControl).toHaveBeenCalledTimes(2);
        expect(MockedFormLabel).toHaveBeenCalledTimes(2);
        expect(component.find('.ErrorText').length).toEqual(2);
        expect(MockedButton).toHaveBeenCalledTimes(1);
    });
    it('handleLogin test', async () => {
        const handleSubmit = jest.fn().mockImplementation(a => a);
        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: jest.fn(),
            handleSubmit: handleSubmit,
            errors: []
        });
        const handleLogin = jest.fn();
        mount(
            <LoginPage handleLogin={handleLogin} userLoggedIn={userLoggedIn} />
        );
        expect(MockedForm).toHaveBeenCalledTimes(1);
        // @ts-ignore
        MockedForm.mock.calls[0][0].onSubmit();
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenNthCalledWith(1, handleLogin);
    });
    it('togglePasswordVisibility test', async () => {
        const handleSubmit = jest.fn().mockImplementation(a => a);
        // @ts-ignore
        MockedUseForm.mockReturnValue({
            register: jest.fn(),
            handleSubmit: handleSubmit,
            errors: []
        });
        const handleLogin = jest.fn();
        mount(
            <LoginPage handleLogin={handleLogin} userLoggedIn={userLoggedIn} />
        );
        expect(MockedInputGroupText).toHaveBeenCalledTimes(1);
        expect(MockedInputGroupText).toHaveBeenNthCalledWith(1, {
            className: "ShowPassword",
            onClick: expect.any(Function),
            children: expect.anything()
        }, {});
        // @ts-ignore
        expect(MockedInputGroupText.mock.calls[0][0].children.type.name).toEqual("AiFillEyeInvisible");
        expect(MockedFormControl).toHaveBeenCalledTimes(2);
        expect(MockedFormControl.mock.calls[1][0].type).toEqual('password');
        act(() => {// @ts-ignore
            MockedInputGroupText.mock.calls[0][0].onClick();
        });
        expect(MockedFormControl).toHaveBeenCalledTimes(4);
        expect(MockedFormControl.mock.calls[3][0].type).toEqual('text');
    });
});
