import React from "react";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Modal} from "../Modal/Modal";
import {SuccessModal} from "./SuccessModal";
import {FaCheckCircle} from "react-icons/fa";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("../Modal/Modal", () => {
    return {
        Modal: jest.fn().mockImplementation(({children}) => <div className="Modal">{children}</div> )
    }
});

jest.mock("react-icons/fa", () => {
    return {
        FaCheckCircle: jest.fn().mockImplementation(({children}) => <div className="FaCheckCircle">{children}</div> )
    }
});

describe('SuccessModal test', () => {
    const MockedModal = mocked(Modal, true);

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        mount(<SuccessModal
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
        mount(<SuccessModal
            show={false}
            handleClose={handleClose}
            handleConfirm={handleConfirm}
            title={'titleTest'}
            buttonText={'Proceed'}
        >
            {childrenComponent}
        </SuccessModal>);
        expect(MockedModal).toHaveBeenCalledTimes(1);
        expect(MockedModal).toHaveBeenNthCalledWith(1, {
            show: false,
            handleClose: handleClose,
            handleConfirm: handleConfirm,
            title: "titleTest",
            buttonText: "Proceed",
            children: expect.anything()
        }, {});

        expect(MockedModal.mock.calls[0][0].children[1].props.children).toEqual(childrenComponent);
        expect(FaCheckCircle).toHaveBeenCalledTimes(1);

    });
});