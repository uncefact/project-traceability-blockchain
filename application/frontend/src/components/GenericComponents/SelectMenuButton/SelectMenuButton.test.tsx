import React from "react";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {SelectMenuButton} from "./SelectMenuButton";
// @ts-ignore
import {components} from "react-select";
import {Button} from "react-bootstrap";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-select", () => {
    let components = jest.fn().mockImplementation(({children}) => <div className={"components"}>{children}</div> );

    // @ts-ignore
    components.MenuList = jest.fn().mockImplementation(({children}) => <div className={"componentsMenuList"}>{children}</div> );
    return {
        components
    }
});

jest.mock("react-bootstrap", () => {
    return {
        Button: jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>)
    }
});

describe('SelectMenuButton test', () => {
    const MockedComponentsMenuList = mocked(components.MenuList, true);
    const MockedButton = mocked(Button, true);

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('Render without crashing', () => {
        mount(<SelectMenuButton
            buttonText={''}
            onClick={() => null}
            children={"children"}
        />)
    });
    it('Content test', () => {
        const childrenComponent = jest.fn().mockImplementation(() => <div className="children">Children</div> );
        mount(<SelectMenuButton
            buttonText={''}
            onClick={() => null}
        >
            {childrenComponent}
        </SelectMenuButton>);

        expect(MockedComponentsMenuList).toHaveBeenCalledTimes(1);

    });
});