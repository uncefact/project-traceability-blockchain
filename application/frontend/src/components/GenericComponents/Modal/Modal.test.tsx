import React from "react";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Button, Modal as BModal} from "react-bootstrap";
import {Modal} from "./Modal";

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-i18next', () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-bootstrap', () => {
    let Button = jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>);
    let Modal = jest.fn().mockImplementation(({children}) => <div className={'Modal'}>{children}</div>);
    // @ts-ignore
    Modal.Header = jest.fn().mockImplementation(({children}) => <div className={'Header'}>{children}</div>);
    // @ts-ignore
    Modal.Title = jest.fn().mockImplementation(({children}) => <div className={'Title'}>{children}</div>);
    // @ts-ignore
    Modal.Body = jest.fn().mockImplementation(({children}) => <div className={'Body'}>{children}</div>);
    // @ts-ignore
    Modal.Footer = jest.fn().mockImplementation(({children}) => <div className={'Footer'}>{children}</div>);
    return {
        Button,
        Modal
    };
});

describe('Modal test', () => {
    const MockedModal = mocked(BModal, true);
    const MockedButton = mocked(Button, true);
    const MockedTitle = mocked(BModal.Title, true);
    const MockedBody = mocked(BModal.Body, true);

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        mount(<Modal
            show={false}
            handleClose={()=>{}}
            handleConfirm={()=>{}}
            title={''}
            buttonText={''}
        />)
    });
    it('Content test', async () => {
        const handleClose = jest.fn();
        const handleConfirm = jest.fn();
        const childrenComponent = jest.fn().mockImplementation(() => <div className="children">Children</div> );
        mount(<Modal
            show={false}
            handleClose={handleClose}
            handleConfirm={handleConfirm}
            title={'titleTest'}
            buttonText={'textTest'}
        >
            {childrenComponent}
        </Modal>);
        expect(MockedTitle).toHaveBeenCalledTimes(1);
        expect(MockedTitle).toHaveBeenNthCalledWith(1, {
            children: 'titleTest'
        }, {});
        expect(MockedBody).toHaveBeenCalledTimes(1);
        expect(MockedBody).toHaveBeenNthCalledWith(1, {
            children: childrenComponent
        }, {});
        expect(MockedButton).toHaveBeenCalledTimes(1);
        expect(MockedButton).toHaveBeenNthCalledWith(1, {
            variant: 'primary',
            onClick: handleConfirm,
            children: 'textTest'
        }, {});
        // @ts-ignore
        MockedButton.mock.calls[0][0].onClick();
        expect(handleConfirm).toHaveBeenCalledTimes(1);
        // @ts-ignore
        MockedModal.mock.calls[0][0].onHide();
        expect(handleClose).toHaveBeenCalledTimes(1);

        // without specify the button text
        mount(<Modal
            show={false}
            handleClose={handleClose}
            handleConfirm={handleConfirm}
            title={'titleTest'}
        >
            {childrenComponent}
        </Modal>);
        expect(MockedButton).toHaveBeenCalledTimes(2);
        expect(MockedButton).toHaveBeenNthCalledWith(2, {
            variant: 'primary',
            onClick: handleConfirm,
            children: 'confirm'
        }, {});

    });
});