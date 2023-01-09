import React from "react";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {act} from "react-dom/test-utils";
import {SelectedNodeCard} from "./SelectedNodeCard";
import {mocked} from "ts-jest/utils";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {downloadFile} from "../../../../../utils/downloadFile";

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-bootstrap', () => {
    return {
        OverlayTrigger: jest.fn().mockImplementation(({children}) => <div className={'OverlayTrigger'}>{children}</div>),
        Tooltip: jest.fn().mockImplementation(({children}) => <div className={'Tooltip'}>{children}</div>),
    };
});
jest.mock('../../../../../utils/downloadFile', () => {
    return {
        downloadFile: jest.fn()
    };
});

Enzyme.configure({ adapter: new Adapter() });

describe('SelectedNodeCard test', () => {
    const MockedOverlayTrigger = mocked(OverlayTrigger, true);
    const MockedTooltip = mocked(Tooltip, true);

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('Render without crashing', async () => {
        mount(
            <SelectedNodeCard
                selectedNode={null}
                selectedEdge={null}
                selectedSustainabilityCriterion={undefined}
                onClose={()=>{}}
                transformations={[]}
            />
        );
    });
    it('No element selected', async () => {
        mount(
            <SelectedNodeCard
                selectedNode={null}
                selectedEdge={null}
                selectedSustainabilityCriterion={undefined}
                onClose={()=>{}}
                transformations={[]}
            />
        );
        expect(MockedOverlayTrigger).toHaveBeenCalledTimes(1);
        // @ts-ignore
        mount(MockedOverlayTrigger.mock.calls[0][0].overlay);
        expect(MockedTooltip).toHaveBeenCalledTimes(1);
        expect(MockedTooltip.mock.calls[0][0].children).toEqual('node_card.tip');
    });
    it('Node selected - expanded', async () => {
        const selectedNode = {
            materialName: "test material",
            materialCategory: null,
            facilityInfo: {
                name: "company",
                location: null,
                country: null,
                region: null,
                certificates: [],
                partnerTyp: null
            },
            processName: "process",
            assessmentLevelName: "assessment level",
            processTypes: ["process type"],
            processingStandards: [],
            processCertificates: [],
            certificates: [],
            transformationId: 1
        }
        const component = mount(
            <SelectedNodeCard
                selectedNode={selectedNode}
                selectedEdge={null}
                selectedSustainabilityCriterion={undefined}
                onClose={()=>{}}
                transformations={[]}
            />
        );
        expect(component.find('h1').length).toEqual(3);
        expect(component.find('h1').at(0).text()).toEqual('company');
        expect(component.find('h1').at(1).text()).toEqual('process');

        expect(component.find('.InfoRow').length).toEqual(8);
        expect(component.find('.InfoRow').at(0).find('.InfoLeftContainer').text()).toEqual('name:');
        expect(component.find('.InfoRow').at(0).find('.InfoRightContainer').text()).toEqual('company');

        expect(component.find('.InfoRow').at(1).find('.InfoLeftContainer').text()).toEqual('address:');
        expect(component.find('.InfoRow').at(1).find('.InfoRightContainer').text()).toEqual('-');

        expect(component.find('.InfoRow').at(2).find('.InfoLeftContainer').text()).toEqual('region:');
        expect(component.find('.InfoRow').at(2).find('.InfoRightContainer').text()).toEqual('-');

        expect(component.find('.InfoRow').at(3).find('.InfoLeftContainer').text()).toEqual('state:');
        expect(component.find('.InfoRow').at(3).find('.InfoRightContainer').text()).toEqual('-');

        expect(component.find('.InfoRow').at(4).find('.InfoLeftContainer').text()).toEqual('role:');
        expect(component.find('.InfoRow').at(4).find('.InfoRightContainer').text()).toEqual('-');

        expect(component.find('.InfoRow').at(5).find('.InfoLeftContainer').text()).toEqual('name:');
        expect(component.find('.InfoRow').at(5).find('.InfoRightContainer').text()).toEqual('process');

        expect(component.find('.InfoRow').at(6).find('.InfoLeftContainer').text()).toEqual('type:');
        expect(component.find('.InfoRow').at(6).find('.InfoRightContainer').text()).toEqual('process type');

        expect(component.find('.InfoRow').at(7).find('.InfoLeftContainer').text()).toEqual('material_name: ');
        expect(component.find('.InfoRow').at(7).find('.InfoRightContainer').text()).toEqual('test material');

    });
    it('Node selected - compressed', async () => {
        const selectedNode = {
            materialName: "test material",
            materialCategory: null,
            facilityInfo: {
                name: "company",
                location: null,
                country: null,
                region: null,
                certificates: [],
                partnerTyp: null
            },
            processName: "process",
            assessmentLevelName: "assessment level",
            processTypes: ["process type"],
            processingStandards: [],
            processCertificates: [],
            certificates: [],
            transformationId: 1
        }
        const component = mount(
            <SelectedNodeCard
                selectedNode={selectedNode}
                selectedEdge={null}
                selectedSustainabilityCriterion={undefined}
                onClose={()=>{}}
                transformations={[]}
            />
        );
        MockedOverlayTrigger.mockClear();
        expect(component.find('span').length).toEqual(1);
        act(() => {
            component.find('span').simulate('click');
        });
        expect(MockedOverlayTrigger).toHaveBeenCalledTimes(2);
        // @ts-ignore
        mount(MockedOverlayTrigger.mock.calls[0][0].overlay);
        expect(MockedTooltip).toHaveBeenCalledTimes(1);
        expect(MockedTooltip.mock.calls[0][0].children).toEqual('node_card.material_info');
    });
    it('Edge selected - expanded', async () => {
        const selectedEdge = {
            fromFacilityInfo: {
                name: "company from",
                location: null,
                country: null,
                region: null,
                certificates: [],
                partnerTyp: null
            },
            toFacilityInfo: {
                name: "company to",
                location: null,
                country: null,
                region: null,
                certificates: [],
                partnerTyp: null
            },
            trades: []
        }
        const component = mount(
            <SelectedNodeCard
                selectedNode={null}
                selectedEdge={selectedEdge}
                selectedSustainabilityCriterion={undefined}
                onClose={()=>{}}
                transformations={[]}
            />
        );
        expect(component.find('h1').length).toEqual(2);
        expect(component.find('h1').at(0).text()).toEqual('company');

        expect(component.find('.InfoRow').length).toEqual(5);
        expect(component.find('.InfoRow').at(0).find('.InfoLeftContainer').text()).toEqual('name:');
        expect(component.find('.InfoRow').at(0).find('.InfoRightContainer').text()).toEqual('company from');

        expect(component.find('.InfoRow').at(1).find('.InfoLeftContainer').text()).toEqual('address:');
        expect(component.find('.InfoRow').at(1).find('.InfoRightContainer').text()).toEqual('-');

        expect(component.find('.InfoRow').at(2).find('.InfoLeftContainer').text()).toEqual('region:');
        expect(component.find('.InfoRow').at(2).find('.InfoRightContainer').text()).toEqual('-');

        expect(component.find('.InfoRow').at(3).find('.InfoLeftContainer').text()).toEqual('state:');
        expect(component.find('.InfoRow').at(3).find('.InfoRightContainer').text()).toEqual('-');

        expect(component.find('.InfoRow').at(4).find('.InfoLeftContainer').text()).toEqual('role:');
        expect(component.find('.InfoRow').at(4).find('.InfoRightContainer').text()).toEqual('-');
    });

    it('Edge selected - compressed', async () => {
        const selectedEdge = {
            fromFacilityInfo: {
                name: "company from",
                location: null,
                country: null,
                region: null,
                certificates: [],
                partnerTyp: null

            },
            toFacilityInfo: {
                name: "company to",
                location: null,
                country: null,
                region: null,
                certificates: [],
                partnerTyp: null
            },
            trades: []
        }
        const component = mount(
            <SelectedNodeCard
                selectedNode={null}
                selectedEdge={selectedEdge}
                selectedSustainabilityCriterion={undefined}
                onClose={()=>{}}
                transformations={[]}
            />
        );
        MockedOverlayTrigger.mockClear();
        expect(component.find('span').length).toEqual(1);
        act(() => {
            component.find('span').simulate('click');
        });
        expect(MockedOverlayTrigger).toHaveBeenCalledTimes(2);
        // @ts-ignore
        mount(MockedOverlayTrigger.mock.calls[0][0].overlay);
        expect(MockedTooltip).toHaveBeenCalledTimes(1);
        expect(MockedTooltip.mock.calls[0][0].children).toEqual('node_card.trade_info');
    });
    it('Node selected - certificate list', async () => {
        const selectedNode = {
            materialName: "test material",
            materialCategory: null,
            facilityInfo: {
                name: "company",
                location: null,
                country: null,
                region: null,
                certificates: [],
                partnerTyp: null
            },
            processName: "process",
            processTypes: ["process type"],
            processingStandards: ['PS1'],
            processCertificates: [],
            certificates: [{
                processStandardName: 'PS1',
                certificatePageURL: null,
                documentId: 1,
                documentFileName: 'documentFileNameTest',
                id: 'idTest',
                validFrom: 'validFromTest',
                validUntil: 'validUntilTest',
                certificateTypeName: 'certificateTypeNameTest',
                processingStandardSiteUrl: 'processingStandardSiteUrlTest',
                processingStandardLogoPath: 'processingStandardLogoPathTest',
                status: 'ACCEPTED',
                subject: ''
            }],
            transformationId: 1
        }
        const selectedSustainabilityCriterion = {
            processingStandardNames: ['PS1', 'PS2']
        }
        const component = mount(
            <SelectedNodeCard
                selectedNode={selectedNode}
                selectedEdge={null}
                selectedSustainabilityCriterion={selectedSustainabilityCriterion}
                onClose={()=>{}}
                transformations={[]}
            />
        );
        expect(component.find('.CertificateRow').length).toEqual(1);
        await act(async () => {
            await component.find('.CertificateRow').simulate('click');
        });
        expect(downloadFile).toHaveBeenCalledTimes(1);
        expect(downloadFile).toHaveBeenNthCalledWith(1, '/documents/1', 'documentFileNameTest', expect.any(Function));
    });
    it('Edge selected - certificate list', async () => {
        const selectedEdge = {
            fromFacilityInfo: {
                name: "company from",
                location: null,
                country: null,
                region: null,
                certificates: [],
                partnerTyp: null
            },
            toFacilityInfo: {
                name: "company to",
                location: null,
                country: null,
                region: null,
                certificates: [],
                partnerTyp: null
            },
            trades: [{
                tradeName: 'tradeNameTest',
                tradeRefNumber: 'tradeRefNumberTest',
                date: 'dateTest',
                processingStandards: ['PS1'],
                tradeCertificates: [{
                    processStandardName: 'PS1',
                    certificatePageURL: "https://www.test.ch",
                    documentId: null,
                    documentFileName: null,
                    id: 'idTest',
                    validFrom: 'validFromTest',
                    validUntil: 'validUntilTest',
                    certificateTypeName: 'certificateTypeNameTest',
                    processingStandardSiteUrl: 'processingStandardSiteUrlTest',
                    processingStandardLogoPath: 'processingStandardLogoPathTest',
                    status: 'ACCEPTED',
                    subject: ''
                }]
            }]
        }
        const selectedSustainabilityCriterion = {
            processingStandardNames: ['PS1', 'PS2']
        }

        window.open = jest.fn().mockReturnValue({ close: jest.fn() });
        const component = mount(
            <SelectedNodeCard
                selectedNode={null}
                selectedEdge={selectedEdge}
                selectedSustainabilityCriterion={selectedSustainabilityCriterion}
                onClose={()=>{}}
                transformations={[]}
            />
        );
        expect(component.find('.CertificateRow').length).toEqual(1);
        await act(async () => {
            await component.find('.CertificateRow').simulate('click');
        });
        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenNthCalledWith(1, selectedEdge.trades[0].tradeCertificates[0].certificatePageURL, "_blank");
        // expect(downloadFile).toHaveBeenCalledTimes(1);
        // expect(downloadFile).toHaveBeenNthCalledWith(1, '/documents/1', 'documentFileNameTest', expect.any(Function));
    });

});