import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Link, useLocation} from "react-router-dom";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import SB, {Sidebar} from "./Sidebar";
import {useMediaQuery} from "react-responsive";

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-router-dom', () => {
    return {
        Link: jest.fn().mockImplementation(({children}) => <div className={'Link'}>{children}</div>),
        useLocation: jest.fn()
    }
});
jest.mock('react-bootstrap', () => {
    return {
        Button: jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>),
    }
});
jest.mock('react-responsive', () => {
    return {
        useMediaQuery: jest.fn()
    }
});
jest.mock('../../../routes/Routes', () => {
   return {
       pathChangeListener: jest.fn().mockReturnValue(false)
   }
});

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

describe('Sidebar test', () => {
    const MockedLink = mocked(Link, true);
    const MockedUseLocation = mocked(useLocation, true);

    const companyIndustrialSector = "sectorTest";

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        // @ts-ignore
        MockedUseLocation.mockReturnValue({
            pathname: ''
        });
        mount(
            <Provider store={store}>
                <SB/>
            </Provider>
        );
        mount(
            <Sidebar userLoggedIn={null} companyIndustrialSector={companyIndustrialSector}/>
        )
    });
    it('Content test - pc, NOT certifier', async () => {
        // @ts-ignore
        useMediaQuery.mockReturnValue(false);
        // @ts-ignore
        MockedUseLocation.mockReturnValue({
            pathname: ''
        });
        const userLoggedIn = {
            firstname: 'firstnameTest',
            lastname: 'lastnameTest',
            company: {
                companyName: 'companyNameTest',
                address1: 'address1Test',
                city: 'cityTest',
            }
        }
        const component = mount(
            <Sidebar userLoggedIn={userLoggedIn} companyIndustrialSector={companyIndustrialSector}/>
        );
        expect(MockedLink).toHaveBeenCalledTimes(10);
        expect(component.find('.MainLinkContainer').length).toEqual(12);
        expect(component.find('.MainLinkContainer').at(0).text()).toEqual('firstnameTest\u00a0lastnameTest');
        expect(component.find('.MainLinkContainer').at(1).text()).toEqual('companyNameTest');
        expect(component.find('.MainLinkContainer').at(2).text()).toEqual('sidebar.traceability_section');
        expect(component.find('.MainLinkContainer').at(3).text()).toEqual('contract');
        expect(component.find('.MainLinkContainer').at(4).text()).toEqual('order');
        expect(component.find('.MainLinkContainer').at(5).text()).toEqual('shipment');
        expect(component.find('.MainLinkContainer').at(6).text()).toEqual('sidebar.certifications_section');
        expect(component.find('.MainLinkContainer').at(7).text()).toEqual('self_assessment_certification');
        expect(component.find('.MainLinkContainer').at(8).text()).toEqual('scope_certification');
        expect(component.find('.MainLinkContainer').at(9).text()).toEqual('material_certification');
        expect(component.find('.MainLinkContainer').at(10).text()).toEqual('sidebar.transformations_section');
        expect(component.find('.MainLinkContainer').at(11).text()).toEqual('transformation');
    });

    it('content test - pc, certifier', async () => {
        // @ts-ignore
        useMediaQuery.mockReturnValue(false);
        // @ts-ignore
        MockedUseLocation.mockReturnValue({
            pathname: ''
        });
        const userLoggedIn = {
            firstname: 'firstnameTest',
            lastname: 'lastnameTest',
            company: {
                companyName: 'companyNameTest',
                address1: 'address1Test',
                city: 'cityTest',
                partnerType: {
                    name: 'certifier'
                }
            }
        }
        const component = mount(
            <Sidebar userLoggedIn={userLoggedIn} companyIndustrialSector={companyIndustrialSector}/>
        );
        expect(MockedLink).toHaveBeenCalledTimes(6);
        expect(component.find('.MainLinkContainer').length).toEqual(6);
        expect(component.find('.MainLinkContainer').at(0).text()).toEqual('firstnameTest\u00a0lastnameTest');
        expect(component.find('.MainLinkContainer').at(1).text()).toEqual('companyNameTest');
        expect(component.find('.MainLinkContainer').at(2).text()).toEqual('sidebar.certifications_section');
        expect(component.find('.MainLinkContainer').at(3).text()).toEqual('scope_certification');
        expect(component.find('.MainLinkContainer').at(4).text()).toEqual('transaction_certification');
        expect(component.find('.MainLinkContainer').at(5).text()).toEqual('material_certification');
    });

    it('Content test - graph page, NOT certifier', async () => {
        // @ts-ignore
        useMediaQuery.mockReturnValue(false);
        // @ts-ignore
        MockedUseLocation.mockReturnValue({
            pathname: '/cotton/graph/2'
        });
        const userLoggedIn = {
            firstname: 'firstnameTest',
            lastname: 'lastnameTest',
            company: {
                companyName: 'companyNameTest',
                address1: 'address1Test',
                city: 'cityTest',
            }
        }
        const component = mount(
            <Sidebar userLoggedIn={userLoggedIn} companyIndustrialSector={companyIndustrialSector}/>
        );
        expect(MockedLink).toHaveBeenCalledTimes(10);
        expect(component.find('.MainLinkContainer').length).toEqual(12);
        expect(component.find('.MainLinkContainer').at(0).text()).toEqual('firstnameTest\u00a0lastnameTest');
        expect(component.find('.MainLinkContainer').at(1).text()).toEqual('companyNameTest');
        expect(component.find('.MainLinkContainer').at(2).text()).toEqual('sidebar.traceability_section');
        expect(component.find('.MainLinkContainer').at(3).text()).toEqual('contract');
        expect(component.find('.MainLinkContainer').at(4).text()).toEqual('order');
        expect(component.find('.MainLinkContainer').at(5).text()).toEqual('shipment');
        expect(component.find('.MainLinkContainer').at(6).text()).toEqual('sidebar.certifications_section');
        expect(component.find('.MainLinkContainer').at(7).text()).toEqual('self_assessment_certification');
        expect(component.find('.MainLinkContainer').at(8).text()).toEqual('scope_certification');
        expect(component.find('.MainLinkContainer').at(9).text()).toEqual('material_certification');
        expect(component.find('.MainLinkContainer').at(10).text()).toEqual('sidebar.transformations_section');
    });

    it('Content test - mobile, NOT certifier', async () => {
        // @ts-ignore
        useMediaQuery.mockReturnValue(true);
        // @ts-ignore
        MockedUseLocation.mockReturnValue({
            pathname: ''
        });
        const userLoggedIn = {
            firstname: 'firstnameTest',
            lastname: 'lastnameTest',
            company: {
                companyName: 'companyNameTest',
                address1: 'address1Test',
                city: 'cityTest',
            }
        }
        const component = mount(
            <Sidebar userLoggedIn={userLoggedIn} companyIndustrialSector={companyIndustrialSector}/>
        );
        expect(MockedLink).toHaveBeenCalledTimes(11);
        expect(component.find('.BurgerContainer').length).toEqual(1);
        expect(component.find('.MainLinkContainer').length).toEqual(12);
        expect(component.find('.MainLinkContainer').at(0).text()).toEqual('firstnameTest\u00a0lastnameTest');
        expect(component.find('.MainLinkContainer').at(1).text()).toEqual('companyNameTest');
        expect(component.find('.MainLinkContainer').at(2).text()).toEqual('sidebar.traceability_section');
        expect(component.find('.MainLinkContainer').at(3).text()).toEqual('contract');
        expect(component.find('.MainLinkContainer').at(4).text()).toEqual('order');
        expect(component.find('.MainLinkContainer').at(5).text()).toEqual('shipment');
        expect(component.find('.MainLinkContainer').at(6).text()).toEqual('sidebar.certifications_section');
        expect(component.find('.MainLinkContainer').at(7).text()).toEqual('self_assessment_certification');
        expect(component.find('.MainLinkContainer').at(8).text()).toEqual('scope_certification');
        expect(component.find('.MainLinkContainer').at(9).text()).toEqual('material_certification');
        expect(component.find('.MainLinkContainer').at(10).text()).toEqual('sidebar.transformations_section');
        expect(component.find('.MainLinkContainer').at(11).text()).toEqual('transformation');
    });

});