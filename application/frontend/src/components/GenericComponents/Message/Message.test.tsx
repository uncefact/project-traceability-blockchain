import Enzyme, {mount} from "enzyme";
import {Message} from "./Message";
import {MESSAGE_TYPE_ERROR, MESSAGE_TYPE_SUCCESS, MsgType} from "../../../redux/store/types/MessageType";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Toast} from "react-bootstrap";
import {act} from "react-dom/test-utils";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-bootstrap', () => {
    let Toast = jest.fn().mockImplementation(({children}) => <div className={'Toast'}>{children}</div>);
    // @ts-ignore
    Toast.Header = jest.fn().mockImplementation(({children}) => <div className={'ToastHeader'}>{children}</div>);
    // @ts-ignore
    Toast.Body = jest.fn().mockImplementation(({children}) => <div className={'ToastBody'}>{children}</div>);

    return {
        Toast
    };
});

describe('Message test', () => {
    const MockedToast = mocked(Toast, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Render without crashing', async () => {
        mount(
            <Message message={{text: "Message test", type: MESSAGE_TYPE_SUCCESS}}/>
        )
    });

    it('Content test success', async () => {
        const successMessage: MsgType = {text: "Message success", type: MESSAGE_TYPE_SUCCESS};

        let component = mount(
            <Message message={successMessage}/>
        );
        expect(component.find(".mr-auto").length).toEqual(1);
        expect(component.find(".mr-auto").text()).toEqual("popups.info");
        expect(component.find(".ToastBody").text()).toEqual("Message success");
    });

    it('Content test error', async () => {
        const errorMessage: MsgType = {text: "Message error", type: MESSAGE_TYPE_ERROR};

        let component = mount(
            <Message message={errorMessage}/>
        );
        expect(component.find(".mr-auto").length).toEqual(1);
        expect(component.find(".mr-auto").text()).toEqual("popups.error");
        expect(component.find(".ToastBody").text()).toEqual("Message error");

    });

    it('Close message',  async () => {
        const successMessage: MsgType = {text: "Message success", type: MESSAGE_TYPE_SUCCESS};
        let component = mount(
            <Message message={successMessage} />
        );

        expect(MockedToast).toHaveBeenCalledTimes(1);
        act(() => {
            // @ts-ignore
            MockedToast.mock.calls[0][0].onClose();
        });
        expect(MockedToast).toHaveBeenCalledTimes(2);
        expect(MockedToast.mock.calls[1][0].show).toBeFalsy();

    });
});