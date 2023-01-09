import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {Provider} from "react-redux";
import React from "react";
import DHP, {DocumentsHistoryPage} from './DocumentsHistoryPage';
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {mocked} from "ts-jest/utils";
import SupplyChainInfoControllerApi from "../../../../api/SupplyChainInfoControllerApi";
import {act} from "react-dom/test-utils";
import {useHistory, useRouteMatch} from "react-router-dom";
import {DocumentsHistoryElement} from "./DocumentHistoryElement/DocumentHistoryElement";
import {SupplyChainInfoPresentable} from "@unece/cotton-fetch";
import moment from "moment";

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
        useHistory: jest.fn(),
        useRouteMatch: jest.fn(),
    }
});
jest.mock('../../../../api/SupplyChainInfoControllerApi', () => {
    return {
        getSupplyChain: jest.fn(),
    }
});
jest.mock('./DocumentHistoryElement/DocumentHistoryElement', () => {
    return {
        DocumentsHistoryElement: jest.fn().mockImplementation(({children}) => <div className={'DocumentsHistoryElement'}>{children}</div>)
    }
});
jest.mock('../../../../utils/basicUtils', () => {
   return {
       useQuery: jest.fn().mockReturnValue({get: (value: string) => value})
   }
});

describe('DocumentsHistoryPage test', () => {
    const MockedGetSupplyChain = mocked(SupplyChainInfoControllerApi.getSupplyChain, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedUseRouteMatch = mocked(useRouteMatch, true);
    const MockedDocumentsHistoryElement = mocked(DocumentsHistoryElement, true);
    const supplyChain : SupplyChainInfoPresentable = {
        materials: [],
        transformations: [{
            executorCompanyId: 'company1',
            inputMaterialIds: [5],
            outputMaterialIds: [],
            certificates: [{
                certificateId: 'transformationCert1',
                documentId: 1,
                documentFileName: 'transformationCert1',
                validFrom: moment.unix(1626084448999).toDate(),
                validUntil: moment.unix(1626084449532).toDate()
            }]
        }, {
            executorCompanyId: 'company2',
            inputMaterialIds: [],
            outputMaterialIds: [6],
            certificates: [{
                certificateId: 'transformationCert2',
                validFrom: moment.unix(1626084448999).toDate(),
                validUntil: moment.unix(1626084449532).toDate(),
                documentId: 2,
                documentFileName: 'transformationCert2'
            }]
        }],
        companiesInfo: [{
            name: 'company1',
            visibleName: 'company1'
        }, {
            name: 'company2',
            visibleName: 'company2'
        }],
        trades: [
            {
                referenceNumber: 'referenceNumber1Test',
                issueDate: moment.unix(1626084449000).toDate(),
                validUntilDate: moment.unix(1626084449862).toDate(),
                type: 'TypeTest',
                documentType: 'documentType1Test',
                documentId: 1,
                documentFileName: 'documentFileName1Test',
                consigneeToContractorMaterialMap: {
                    5: 6
                },
                processingStandards: ['procStandardName1'],
                certificates: [{
                    certificateId: 'tradeCert1',
                    validFrom: moment.unix(1626084448999).toDate(),
                    validUntil: moment.unix(1626084449532).toDate(),
                    documentId: 1,
                    documentFileName: 'tradeCert1',
                    certificateTypeName: 'certificateTypeNameTest',
                    assessmentTypeName: 'assessmentTypeNameTest',
                    processingStandardName: 'procStandardName'
                }]
            }
        ]
    };
    
    const companyIndustrialSector = "sectorTest";
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        mount(
            <Provider store={store}>
                <DHP />
            </Provider>
        );
        mount(<DocumentsHistoryPage startLoading={jest.fn()} stopLoading={jest.fn()} companyIndustrialSector={companyIndustrialSector}/>);
    });
    it('Content test - OK', async () => {
        // @ts-ignore
        MockedGetSupplyChain.mockReturnValue(supplyChain);
        let component;
        await act(async () => {
            component = await mount(<DocumentsHistoryPage startLoading={jest.fn()} stopLoading={jest.fn()} companyIndustrialSector={companyIndustrialSector}/>)
        });
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(MockedDocumentsHistoryElement).toHaveBeenCalledTimes(3);
        expect(MockedDocumentsHistoryElement).toHaveBeenNthCalledWith(1, {
            title: "transaction",
            document: {
                assessmentType: null,
                issueDate: moment.unix(1626084449000).toDate(),
                validUntilDate: moment.unix(1626084449862).toDate(),
                type: 'TypeTest',
                documentFileName: "documentFileName1Test",
                documentId: 1,
                documentType: "documentType1Test",
                referenceNumber: "referenceNumber1Test"
            },
            certificate: {
                assessmentType: "assessmentTypeNameTest",
                documentFileName: "tradeCert1",
                documentId: 1,
                documentType: "certificateTypeNameTest",
                processingStandardName: 'procStandardName',
                validFrom: moment.unix(1626084448999).toDate(),
                validUntil: moment.unix(1626084449532).toDate()
            },
            companyNameFrom: "company2",
            companyNameTo: "company1",
            processingStandardNames: ['procStandardName1']
        }, {});
        expect(MockedDocumentsHistoryElement).toHaveBeenNthCalledWith(2, {
            title: "scope_certification",
            document: null,
            certificate: {
                assessmentType: undefined,
                validFrom: moment.unix(1626084448999).toDate(),
                validUntil: moment.unix(1626084449532).toDate(),
                documentFileName: "transformationCert1",
                documentId: 1,
                documentType: undefined,
            },
            companyNameFrom: "company1",
            companyNameTo: undefined,
        }, {});
        expect(MockedDocumentsHistoryElement).toHaveBeenNthCalledWith(3, {
            title: "scope_certification",
            document: null,
            certificate: {
                assessmentType: undefined,
                validFrom: moment.unix(1626084448999).toDate(),
                validUntil: moment.unix(1626084449532).toDate(),
                documentFileName: "transformationCert2",
                documentId: 2,
                documentType: undefined,
            },
            companyNameFrom: "company2",
            companyNameTo: undefined,
        }, {});
    });
    it('Content test - Failed to load data', async () => {
        MockedGetSupplyChain.mockImplementation(() => Promise.reject('Error'));
        window.URL.createObjectURL = jest.fn().mockReturnValue('documentUrlTest')
        let component;
        await act(async () => {
            component = await mount(<DocumentsHistoryPage startLoading={jest.fn()} stopLoading={jest.fn()} companyIndustrialSector={companyIndustrialSector}/>)
        });
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(MockedDocumentsHistoryElement).not.toHaveBeenCalled();
    });
    it('Show Supply Chain', async () => {
        const mockedPush = jest.fn();
        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: mockedPush
        });
        // @ts-ignore
        MockedUseRouteMatch.mockReturnValue({
            params: {id: '1'}
        })
        // @ts-ignore
        MockedGetSupplyChain.mockReturnValue(supplyChain);
        // @ts-ignore
        let component;
        await act(async () => {
            component = await mount(<DocumentsHistoryPage startLoading={jest.fn()} stopLoading={jest.fn()} companyIndustrialSector={companyIndustrialSector}/>)
        });
        // @ts-ignore
        component.update();
        await act(async () => {// @ts-ignore
            await component.find('.ControlButton').at(0).simulate('click');
        });
        expect(mockedPush).toHaveBeenCalledTimes(1);
        expect(mockedPush).toHaveBeenNthCalledWith(1, '/' + companyIndustrialSector + '/graph/1');
    });
    it('Set sort test', async () => {
        // @ts-ignore
        MockedGetSupplyChain.mockReturnValue(supplyChain);
        // @ts-ignore
        let component;
        await act(async () => {
            component = await mount(<DocumentsHistoryPage startLoading={jest.fn()} stopLoading={jest.fn()} companyIndustrialSector={companyIndustrialSector}/>)
        });
        // @ts-ignore
        component.update();
        expect(MockedDocumentsHistoryElement).toHaveBeenCalledTimes(3);
        expect(MockedDocumentsHistoryElement).toHaveBeenNthCalledWith(1, {
            title: "transaction",
            document: {
                assessmentType: null,
                documentFileName: "documentFileName1Test",
                documentId: 1,
                documentType: "documentType1Test",
                referenceNumber: "referenceNumber1Test",
                issueDate: moment.unix(1626084449000).toDate(),
                validUntilDate: moment.unix(1626084449862).toDate(),
                type: 'TypeTest'
            },
            certificate: {
                assessmentType: "assessmentTypeNameTest",
                documentFileName: "tradeCert1",
                documentId: 1,
                documentType: "certificateTypeNameTest",
                processingStandardName: 'procStandardName',
                validFrom: moment.unix(1626084448999).toDate(),
                validUntil: moment.unix(1626084449532).toDate(),
            },
            companyNameFrom: "company2",
            companyNameTo: "company1",
            processingStandardNames: ['procStandardName1']
        }, {});
        MockedDocumentsHistoryElement.mockClear();
        await act(async () => {// @ts-ignore
            await component.find('.ControlButton').at(1).simulate('click');
        });
        // @ts-ignore
        component.update();
        expect(MockedDocumentsHistoryElement).toHaveBeenCalledTimes(3);
        expect(MockedDocumentsHistoryElement).toHaveBeenNthCalledWith(1, {
            title: "scope_certification",
            document: null,
            certificate: {
                assessmentType: undefined,
                documentFileName: "transformationCert2",
                documentId: 2,
                documentType: undefined,
                processingStandardName: undefined,
                validFrom: moment.unix(1626084448999).toDate(),
                validUntil: moment.unix(1626084449532).toDate(),
            },
            companyNameFrom: "company2",
            companyNameTo: undefined,
        }, {});
    });
});