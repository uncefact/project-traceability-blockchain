import React from "react";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {act} from "react-dom/test-utils";
import {MaterialCard} from "./MaterialCard";
import {useMediaQuery} from "react-responsive";

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(),
        useRouteMatch: jest.fn(),
    }
});
jest.mock('react-responsive', () => {
    return {
        useMediaQuery: jest.fn()
    }
});

Enzyme.configure({ adapter: new Adapter() });

describe('MaterialCard test', () => {
    const companyIndustrialSector = "sectorTest";

    it('Render without crashing', async () => {
        mount(
            <MaterialCard
                companyIndustrialSector={companyIndustrialSector}
                materialName={''}
                processes={[]}
                productCategory={''}
                sustainabilityCriteria={[]}
                company={{
                    name: "",
                    visibleName: "company name",
                    location: "",
                    country: "",
                    region: "",
                    partnerTyp: ""
                }}
                supplyChain={null}
                edges={[]}
            />
        );
    });
    it('Content if expanded test', async () => {
        const sustainabilityCriteria = [{
            value: {
                name: 'SC1'
            },
            selected: true,
            onClick: jest.fn()
        }, {
            value: {
                name: 'SC2'
            },
            valid: true,
            selected: false,
            onClick: jest.fn()
        }]
        const component = mount(
            <MaterialCard
                companyIndustrialSector={companyIndustrialSector}
                materialName={'materialNameTest'}
                processes={['PR1', 'PR2']}
                productCategory={'productCategoryTest'}
                sustainabilityCriteria={sustainabilityCriteria}
                company={{
                    name: "",
                    visibleName: "company name",
                    location: "",
                    country: "",
                    region: "",
                    partnerTyp: ""
                }}
                supplyChain={null}
                edges={[]}
            />
        );
        expect(component.find('.CardExpanded').length).toEqual(1);
        expect(component.find('.InfoRow').length).toEqual(4);
        expect(component.find('.InfoRightContainer').length).toEqual(4);
        expect(component.find('.InfoRightContainer').at(0).text()).toEqual('company name');
        expect(component.find('.InfoRightContainer').at(1).text()).toEqual('-');
        expect(component.find('.InfoRightContainer').at(2).text()).toEqual('-');

        expect(component.find('.SCRow').length).toEqual(2);
        expect(component.find('.IconLinkContainer').length).toEqual(3);
        expect(component.find('.SelectedRow').length).toEqual(1);
        expect(component.find('.MainLinkContainer').length).toEqual(3);
        expect(component.find('.MainLinkContainer').at(0).text()).toEqual('SC1');
        expect(component.find('.MainLinkContainer').at(1).text()).toEqual('SC2');
        expect(component.find('.MainLinkContainer').at(2).text()).toEqual('material_card.doc_history');


        expect(component.find('.ResizeContainer').length).toEqual(1);
    });
    it('Content if compressed test', async () => {
        const sustainabilityCriteria = [{
            value: {
                name: 'SC1'
            },
            valid: false,
            selected: true,
            onClick: jest.fn()
        }, {
            value: {
                name: 'SC2'
            },
            valid: true,
            selected: false,
            onClick: jest.fn()
        }]
        const component = mount(
            <MaterialCard
                companyIndustrialSector={companyIndustrialSector}
                materialName={'materialNameTest'}
                processes={['PR1', 'PR2']}
                productCategory={'productCategoryTest'}
                sustainabilityCriteria={sustainabilityCriteria}
                company={{
                    name: "",
                    visibleName: "company name",
                    location: "",
                    country: "",
                    region: "",
                    partnerTyp: ""
                }}
                supplyChain={null}
                edges={[]}
            />
        );
        expect(component.find('.ResizeContainer').length).toEqual(1);
        act(() => {
            component.find('.ResizeContainer').simulate('click');
        });
        component.update();
        expect(component.find('.CardCompressed').length).toEqual(1);
    });
    it('Content on mobile screen if compressed test', async () => {
        // @ts-ignore
        useMediaQuery.mockReturnValue(true);
        const sustainabilityCriteria = [{
            value: {
                name: 'SC1'
            },
            valid: false,
            selected: true,
            onClick: jest.fn()
        }, {
            value: {
                name: 'SC2'
            },
            valid: true,
            selected: false,
            onClick: jest.fn()
        }]
        const component = mount(
            <MaterialCard
                companyIndustrialSector={companyIndustrialSector}
                materialName={'materialNameTest'}
                processes={['PR1', 'PR2']}
                productCategory={'productCategoryTest'}
                sustainabilityCriteria={sustainabilityCriteria}
                company={{
                    name: "",
                    visibleName: "company name",
                    location: "",
                    country: "",
                    region: "",
                    partnerTyp: ""
                }}
                supplyChain={null}
                edges={[]}
            />
        );
        expect(component.find('.InfoButton').length).toEqual(1);
        expect(component.find('.MaterialInfo').length).toEqual(1);
        expect(component.find('.InfoText').length).toEqual(1);
        expect(component.find('.InfoText').children().length).toEqual(3);
        expect(component.find('.InfoText').childAt(0).text()).toEqual("company name");
        expect(component.find('.InfoText').childAt(1).text()).toEqual("materialNameTest");
        expect(component.find('.InfoText').childAt(2).text()).toEqual("material_card.selected_criteria = SC1");
        act(() => {
            component.find('.InfoButton').simulate('click');
        });
        component.update();
        expect(component.find('.MaterialInfo').length).toEqual(0);
    });
})