import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Button, Form, Jumbotron} from "react-bootstrap";
import {act} from "react-dom/test-utils";
import UserControllerApi from "../../../../api/UserControllerApi";
import {useHistory} from "react-router-dom";
// @ts-ignore
import UP, {UserPage} from "./UserPage";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {useForm} from "react-hook-form";
import {UserRequest} from "@unece/cotton-fetch";
import {Modal} from "../../../GenericComponents/Modal/Modal";

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
        useHistory: jest.fn()
    }
});

jest.mock("../../../GenericComponents/Modal/Modal", () => {
   return {
       Modal: jest.fn().mockImplementation(({children}) => <div className={'Modal'}>{children}</div>)
   }
});

jest.mock("../../../../api/UserControllerApi", () => {
    return {
        checkPassword: jest.fn(),
        updateUser: jest.fn(),
        userInvitation: jest.fn()
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



describe('UserPage test', () => {
    const MockedButton = mocked(Button, true);
    const MockedUserControllerApi = mocked(UserControllerApi, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedUseForm = mocked(useForm, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedModal = mocked(Modal, true);
    const MockedFormText = mocked(Form.Text, true);

    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();
    const setUserLoggedIn = jest.fn();
    const userLoggedIn = {};
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
                <UP handleLogout={handleLogout}/>
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
                <UserPage
                    userLoggedIn={userLoggedIn}
                    addSuccessMessage={addSuccessMessage}
                    addErrorMessage={addErrorMessage}
                    setUserLoggedIn={setUserLoggedIn}
                    handleLogout={handleLogout}
                />
            );
        });
    });

    it('Content test - generic', async () => {
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
            <UserPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}
                handleLogout={handleLogout}
            />
        );
        expect(Jumbotron).toHaveBeenCalledTimes(1);
        expect(Form).toHaveBeenCalledTimes(2);
        expect(Form.Group).toHaveBeenCalledTimes(13);
        expect(Form.Control).toHaveBeenCalledTimes(12);
        expect(component.find('h2').length).toEqual(1);
        expect(component.find('h2').text()).toEqual("user.title");
        expect(component.find('.Button').length).toEqual(3);
        expect(component.find('.Button').at(0).text()).toEqual("logout");
        expect(component.find('.Button').at(1).text()).toEqual("user.change_password");
        expect(component.find('.Button').at(2).text()).toEqual("confirm");

        expect(MockedFormLabel).toHaveBeenCalledTimes(12);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(1,{children: 'user.firstname'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(2,{children: 'user.lastname'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(3,{children: 'user_email'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(4,{children: 'user.firstname'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(5,{children: 'user.lastname'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(6,{children: 'email'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(7,{children: 'state'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(8,{children: 'city'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(9,{children: 'zip_code'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(10,{children: 'user.phone_number'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(11,{children: 'address 1'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(12,{children: 'address 2'}, {});

        expect(component.find(".FormText").length).toEqual(2);
        expect(component.find(".FormText").at(1).text()).toEqual("user.colleague_invitation_hint");

    });

    it('Content test - changing password', async () => {
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
            <UserPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}
                handleLogout={handleLogout}
            />
        );

        expect(Jumbotron).toHaveBeenCalledTimes(1);
        expect(Form).toHaveBeenCalledTimes(2);
        expect(component.find('.Button').length).toEqual(3);
        expect(component.find('.Button').at(1).text()).toEqual("user.change_password");

        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[1][0].onClick();
        });
        component.update();
        expect(component.find('.Button').length).toEqual(2);
        expect(component.find('.Button').at(1).text()).toEqual("confirm");

        // 12 + 10 precedenti
        expect(Form.Group).toHaveBeenCalledTimes(28);
        expect(Form.Control).toHaveBeenCalledTimes(27);
        expect(component.find('h2').length).toEqual(1);
        expect(component.find('h2').text()).toEqual("user.title");

        expect(MockedFormLabel).toHaveBeenCalledTimes(27);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(16,{children: 'user.firstname'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(17,{children: 'user.lastname'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(18,{children: 'email'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(19,{children: 'password'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(20,{children: 'user.new_password'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(21,{children: 'user.confirm_password'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(22,{children: 'state'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(23,{children: 'city'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(24,{children: 'zip_code'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(25,{children: 'user.phone_number'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(26,{children: 'address 1'}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(27,{children: 'address 2'}, {});

    });

    it("handleChange test", async () => {
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

        const userRequest : UserRequest = {
            firstname: "Name",
            lastname: "Lastname",
            password: undefined
        };

        MockedUserControllerApi.checkPassword.mockReturnValue(Promise.resolve("true"));
        MockedUserControllerApi.updateUser.mockReturnValue(Promise.resolve("Success"));
        mount(
            <UserPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}
                handleLogout={handleLogout}
            />
        );
        expect(MockedButton).toHaveBeenCalledTimes(3);
        expect(MockedFormControl).toHaveBeenCalledTimes(12);

        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[1][0].onClick();
        });
        expect(MockedFormControl).toHaveBeenCalledTimes(27);

        // insertion of the passwords
        act(() => {
            // @ts-ignore
            MockedFormControl.mock.calls[18][0].onChange({target: {value: "psw1234"}});
            // @ts-ignore
            MockedFormControl.mock.calls[19][0].onChange({target: {value: "new_psw1234"}});
            // @ts-ignore
            MockedFormControl.mock.calls[20][0].onChange({target: {value: "new_psw1234"}});
        });

        // confirm changes
        expect(MockedUserControllerApi.checkPassword).not.toHaveBeenCalled();
        expect(MockedUserControllerApi.updateUser).not.toHaveBeenCalled();
        expect(setUserLoggedIn).not.toHaveBeenCalled();

        expect(handleSubmit).toHaveBeenCalledTimes(6);
        await act(async () => {
            await handleSubmit.mock.calls[5][0](userRequest);
        });

        expect(MockedUserControllerApi.checkPassword).toHaveBeenCalledTimes(1);
        expect(MockedUserControllerApi.updateUser).toHaveBeenCalledTimes(1);
        expect(setUserLoggedIn).toHaveBeenCalledTimes(1);

        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.user_update");
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenNthCalledWith(1, '/');

        // test error
        MockedUserControllerApi.updateUser.mockReturnValue(Promise.reject("Error"));
        mount(
            <UserPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}
                handleLogout={handleLogout}
            />
        );

        expect(handleSubmit).toHaveBeenCalledTimes(10);
        await act(async () => {
            await handleSubmit.mock.calls[9][0](userRequest);
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.user_update: Error");

    });

    it("handleChange test - passwords wrong", async () => {
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

        const userRequest : UserRequest = {
            firstname: "Name",
            lastname: "Lastname",
            password: undefined
        };

        MockedUserControllerApi.checkPassword.mockReturnValue(Promise.resolve("false"));
        MockedUserControllerApi.updateUser.mockReturnValue(Promise.resolve("Success"));
        mount(
            <UserPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}
                handleLogout={handleLogout}
            />
        );
        expect(MockedButton).toHaveBeenCalledTimes(3);
        expect(MockedFormControl).toHaveBeenCalledTimes(12);

        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[1][0].onClick();
        });
        expect(MockedFormControl).toHaveBeenCalledTimes(27);

        // insertion of the passwords
        act(() => {
            // @ts-ignore
            MockedFormControl.mock.calls[18][0].onChange({target: {value: "psw1234"}});
            // @ts-ignore
            MockedFormControl.mock.calls[19][0].onChange({target: {value: "new_psw1234"}});
            // @ts-ignore
            MockedFormControl.mock.calls[20][0].onChange({target: {value: "new_psw1234"}});
        });

        // confirm changes
        expect(MockedUserControllerApi.checkPassword).not.toHaveBeenCalled();

        expect(handleSubmit).toHaveBeenCalledTimes(6);
        await act(async () => {
            await handleSubmit.mock.calls[5][0](userRequest);
        });

        expect(MockedUserControllerApi.checkPassword).toHaveBeenCalledTimes(1);
        expect(MockedUserControllerApi.updateUser).not.toHaveBeenCalled();
        expect(setUserLoggedIn).not.toHaveBeenCalled();
        expect(addSuccessMessage).not.toHaveBeenCalled();

        // test passwords don't match
        MockedUserControllerApi.checkPassword.mockReturnValue(Promise.resolve("true"));
        MockedUserControllerApi.checkPassword.mockClear();
        mount(
            <UserPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}
                handleLogout={handleLogout}
            />
        );

        expect(MockedButton).toHaveBeenCalledTimes(12);
        expect(MockedFormControl).toHaveBeenCalledTimes(69);

        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[10][0].onClick();
        });

        expect(MockedFormControl).toHaveBeenCalledTimes(84);

        // insertion of the passwords
        act(() => {
            // @ts-ignore
            MockedFormControl.mock.calls[76][0].onChange({target: {value: "new_psw1234"}});
            // @ts-ignore
            MockedFormControl.mock.calls[77][0].onChange({target: {value: "new_psw123456"}});
        });

        expect(handleSubmit).toHaveBeenCalledTimes(14);
        await act(async () => {
            await handleSubmit.mock.calls[13][0](userRequest);
        });


        expect(MockedUserControllerApi.checkPassword).toHaveBeenCalledTimes(1);
        expect(MockedUserControllerApi.updateUser).not.toHaveBeenCalled();
        expect(setUserLoggedIn).not.toHaveBeenCalled();
        expect(addSuccessMessage).not.toHaveBeenCalled();

    });

    it('Logout pressed test', async () => {
        mount(
            <UserPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}
                handleLogout={handleLogout}
            />
        );

        expect(MockedButton).toHaveBeenCalledTimes(3);
        expect(MockedButton).toHaveBeenNthCalledWith(1, {
            variant: "outline-danger",
            onClick: handleLogout,
            children: "logout"
        }, {});
        expect(handleLogout).not.toHaveBeenCalled();
        // @ts-ignore
        MockedButton.mock.calls[0][0].onClick();
        expect(handleLogout).toHaveBeenCalledTimes(1);
    });

    it('User colleague invitation', async () => {
        const pushMock = jest.fn();
        const handleSubmit = jest.fn();
        const invitationRequest = {
            userFirstName: "firstnameTest",
            userLastName: "lastnameTest",
            userEmailAddress: "testmail@mail.ch"
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

        let component : any = null;
        await act(async () => {
            component = mount(<UserPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}
                handleLogout={handleLogout}
            />
        )});

        expect(MockedModal).toHaveBeenCalledTimes(1);
        expect(MockedModal).toHaveBeenNthCalledWith(1, {
            show: false,
            handleClose: expect.any(Function),
            handleConfirm: undefined,
            title: "user.colleague_invitation",
            children: expect.anything()
        }, {});

        expect(MockedFormText).toHaveBeenCalledTimes(2);
        expect(MockedFormText).toHaveBeenNthCalledWith(2, {
            className: "InviteColleague",
            onClick: expect.any(Function),
            children: "user.colleague_invitation_hint"
        }, {});
        // invitation hint pressed
        act(() => {
            MockedFormText.mock.calls[1][0].onClick();
        });
        expect(MockedModal).toHaveBeenCalledTimes(2);
        expect(MockedModal.mock.calls[1][0].show).toBeTruthy();

        expect(handleSubmit).toHaveBeenCalledTimes(4);
        expect(MockedUserControllerApi.userInvitation).not.toHaveBeenCalled();
        await act(async () => {
            await handleSubmit.mock.calls[2][0](invitationRequest);
        });
        expect(MockedUserControllerApi.userInvitation).toHaveBeenCalledTimes(1);
        expect(MockedUserControllerApi.userInvitation).toHaveBeenNthCalledWith(1, {
            userOnboardingRequest: invitationRequest
        });
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.colleague_invitation");

        expect(pushMock).toHaveBeenNthCalledWith(1, "/");

        // test invitation error
        MockedUserControllerApi.userInvitation.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            component = mount(<UserPage
                userLoggedIn={userLoggedIn}
                addSuccessMessage={addSuccessMessage}
                addErrorMessage={addErrorMessage}
                setUserLoggedIn={setUserLoggedIn}
                handleLogout={handleLogout}
            />
        )});

        expect(handleSubmit).toHaveBeenCalledTimes(6);
        await act(async () => {
            await handleSubmit.mock.calls[4][0](invitationRequest);
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.colleague_invitation: Generic error");

    });

});
