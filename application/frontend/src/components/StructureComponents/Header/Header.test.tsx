import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import H, {Header} from "./Header";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {User} from "@unece/cotton-fetch";
import {Link} from "react-router-dom";
import {NavDropdown} from "react-bootstrap";
import {mocked} from "ts-jest/utils";
import {GenericCard} from "../../GenericComponents/GenericCard/GenericCard";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-router-dom', () => {
    return {
        Link: jest.fn().mockImplementation(({children}) => <div className={'LinkComponent'}>{children}</div>)
    };
});

jest.mock('../../GenericComponents/GenericCard/GenericCard', () => {
    return {
        GenericCard: jest.fn().mockImplementation(({children}) => <div className={'GenericCard'}>{children}</div>)
    }
});

jest.mock('react-bootstrap', () => {
    let Nav = jest.fn().mockImplementation(({children}) => <div className={'Nav'}>{children}</div>);
    let NavDropdown = jest.fn().mockImplementation(({children}) => <div className={'NavDropdown'}>{children}</div>);
    let Navbar = jest.fn().mockImplementation(({children}) => <div className={'Navbar'}>{children}</div>);

    // @ts-ignore
    Nav.Link = jest.fn().mockImplementation(({children}) => <div className={'NavLink'}>{children}</div>);
    // @ts-ignore
    NavDropdown.Item = jest.fn().mockImplementation(({children}) => <div className={'Item'}>{children}</div>);
    // @ts-ignore
    Navbar.Brand = jest.fn().mockImplementation(({children}) => <div className={'Brand'}>{children}</div>);
    // @ts-ignore
    Navbar.Toggle = jest.fn().mockImplementation(({children}) => <div className={'Toggle'}>{children}</div>);
    // @ts-ignore
    Navbar.Collapse = jest.fn().mockImplementation(({children}) => <div className={'Collapse'}>{children}</div>);

    return {
        NavDropdown,
        Navbar,
        Nav
    };
});
describe('Header test', () => {
    const MockedNavDropdownItem = mocked(NavDropdown.Item, true);
    const MockedGenericCard = mocked(GenericCard, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        const handleLogout = jest.fn();
        mount(
            <Provider store={store}>
                <H handleLogout={handleLogout}/>
            </Provider>
        );
        const userLoggedIn: User = {
            firstname: 'test'
        };
        mount(
            <Header handleLogout={handleLogout} userLoggedIn={userLoggedIn}/>
        );
    });
    it('Content test - user not logged in', async () => {
        const handleLogout = jest.fn();
        const userLoggedIn = null;
        mount(
            <Header handleLogout={handleLogout} userLoggedIn={userLoggedIn}/>
        );
        expect(Link).toHaveBeenCalledTimes(2);
        expect(Link).toHaveBeenNthCalledWith(1, {
            to: '/',
            className: 'Link',
            children: 'unece_title'
        }, {});
        expect(Link).toHaveBeenNthCalledWith(2, {
            to:'/login',
            className:'Link',
            children: 'signin'
        }, {});

        expect(MockedGenericCard).not.toHaveBeenCalled();
    });
    it('Content test - user logged in', async () => {
        const handleLogout = jest.fn();
        const userLoggedIn = {
            firstname: 'firstnameTest',
            lastname: 'lastnameTest',
            company: {
                companyName: 'Company test SRL',
                address1: 'Company address test'
            }
        };
        mount(
            <Header handleLogout={handleLogout} userLoggedIn={userLoggedIn} />
        );

        expect(NavDropdown).toHaveBeenCalledTimes(1);
        expect(NavDropdown.Item).toHaveBeenCalledTimes(2);
        expect(NavDropdown.Item).toHaveBeenNthCalledWith(1, {
            children: 'profile'
        }, {});
        expect(NavDropdown.Item).toHaveBeenNthCalledWith(2, {
            children: 'logout',
            onClick: expect.any(Function)
        }, {});

        // @ts-ignore
        MockedNavDropdownItem.mock.calls[1][0].onClick();
        expect(handleLogout).toHaveBeenCalledTimes(1);

        expect(MockedGenericCard).toHaveBeenCalledTimes(2);

        expect(MockedGenericCard).toHaveBeenNthCalledWith(1, {
            title:"user_information:",
            elements:[{name: 'user.firstname', value: 'firstnameTest'}, {name: 'user.lastname', value: 'lastnameTest'}]
        }, {});
        expect(MockedGenericCard).toHaveBeenNthCalledWith(2, {
            title:"company_information:",
            elements:[{name: 'name', value: 'Company test SRL'}, {name: 'address', value: 'Company address test'}]
        }, {});

    });
});
