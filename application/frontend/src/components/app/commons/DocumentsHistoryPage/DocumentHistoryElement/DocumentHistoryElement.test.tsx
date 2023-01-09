import Enzyme, {mount} from "enzyme";
import React from "react";
import {DocumentsHistoryElement} from "./DocumentHistoryElement";
import moment from "moment";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Viewer} from "@react-pdf-viewer/core";
import {act} from "react-dom/test-utils";
import {downloadFile, getFileExtension} from "../../../../../utils/downloadFile";
import {Nav} from "react-bootstrap";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock("@react-pdf-viewer/core", () => {
    return {
        Viewer: jest.fn().mockImplementation(({children}) => <div className={'Viewer'}>{children}</div>)
    }
});
jest.mock('../../../../../utils/downloadFile', () => {
    return {
        downloadFile: jest.fn(),
        getFileExtension: jest.fn(),
    }
});
jest.mock('react-bootstrap', () => {
    let Nav = jest.fn().mockImplementation(({children}) => <div className={'Nav'}>{children}</div>);
    // @ts-ignore
    Nav.Item = jest.fn().mockImplementation(({children}) => <div className={'NavItem'}>{children}</div>);
    // @ts-ignore
    Nav.Link = jest.fn().mockImplementation(({children}) => <div className={'NavLink'}>{children}</div>);
    let Spinner = jest.fn().mockImplementation(({children}) => <div className={'Spinner'}>{children}</div>);

    return {
        Nav,
        Spinner
    };
});
jest.mock('../../../../../api/utilRequest', () => {
    return {
        request: jest.fn(),
    }
});
process.env.TZ = 'UTC';
describe('DocumentsHistoryElement test', () => {
    const issueDate = moment(1626769707000).utc().toDate()
    const validUntil = moment(1626769708500).utc().toDate()
    const documentMock = {
        type: 'TypeTest',
        referenceNumber: 'referenceNumberTest',
        issueDate: issueDate,
        validUntilDate: validUntil,
        documentType: 'document1TypeTest',
        documentId: 1,
        documentFileName: 'document1FileNameTest',
    }
    const certificateMock = {
        validFrom: issueDate,
        validUntil: validUntil,
        documentType: 'document2TypeTest',
        assessmentType: 'assessment2TypeTest',
        documentId: 2,
        documentFileName: 'document2FileNameTest',
        processingStandardName: 'procStandardName'
    }
    const MockedViewer = mocked(Viewer, true);
    const MockedGetFileExtension = mocked(getFileExtension, true);
    const MockedDownloadFile = mocked(downloadFile, true);
    const MockedNavLink = mocked(Nav.Link, true);
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        window.URL.createObjectURL = jest.fn().mockReturnValue('documentUrlTest')
        await act(async () => {
            mount(<DocumentsHistoryElement
                title={'titleTest'}
                document={documentMock}
                certificate={certificateMock}
                companyNameFrom={'companyNameFromTest'}
                companyNameTo={'companyNameToTest'}
                processingStandardNames={['proc standard 1']}
            />);
        });
    });
    it('should always be UTC', () => {
        expect(new Date().getTimezoneOffset()).toBe(0);
    });
    it('Content test - Document', async () => {
        window.URL.createObjectURL = jest.fn().mockReturnValue('documentUrlTest')
        // @ts-ignore
        let component;
        await act(async () => {
            component = mount(<DocumentsHistoryElement
                title={'titleTest'}
                document={documentMock}
                certificate={certificateMock}
                companyNameFrom={'companyNameFromTest'}
                companyNameTo={'companyNameToTest'}
                processingStandardNames={['proc standard 1']}
            />);
        });
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(component.find('.InfoContainer').text()).toEqual('issue_date: ' + moment(issueDate).format('MMMM Do YYYY') + 'valid_until: ' + moment(validUntil).format('MMMM Do YYYY') + 'document_history.ref_number: referenceNumberTestdocument_history.from_company: companyNameFromTestdocument_history.to_company: companyNameToTestdocument_type: document1TypeTestdocument_history.ref_standards: proc standard 1')
    });
    it('Content test - Certificate', async () => {
        window.URL.createObjectURL = jest.fn().mockReturnValue('documentUrlTest')
        // @ts-ignore
        let component;
        await act(async () => {
            component = mount(<DocumentsHistoryElement
                title={''}
                document={documentMock}
                certificate={certificateMock}
                companyNameFrom={'companyNameFromTest'}
                companyNameTo={'companyNameToTest'}
                processingStandardNames={['proc standard 1']}
            />);
        });
        // @ts-ignore
        component.update();
        expect(MockedNavLink).toHaveBeenCalledTimes(2);
        act(() => {
            // @ts-ignore
            MockedNavLink.mock.calls[1][0].onSelect('certificate');
        })
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(component.find('.InfoContainer').text()).toEqual('valid_from: ' + moment(issueDate).format('MMMM Do YYYY') + 'valid_until: ' + moment(validUntil).format('MMMM Do YYYY') + 'document_history.from_company: companyNameFromTestdocument_history.to_company: companyNameToTestdocument_type: document2TypeTestassessment_type: assessment2TypeTestdocument_history.ref_standards: proc standard 1 ')
    });
    it('Download test - Document', async () => {
        window.URL.createObjectURL = jest.fn().mockReturnValue('documentUrlTest')
        // @ts-ignore
        let component;
        await act(async () => {
            component = mount(<DocumentsHistoryElement
                title={''}
                document={documentMock}
                certificate={certificateMock}
                companyNameFrom={''}
                companyNameTo={''}
                processingStandardNames={['']}
            />);
        });
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(component.find('.DownloadButton').length).toEqual(2);
        await act(async () => {// @ts-ignore
            await component.find('.DownloadButton').at(0).simulate('click');
        });
        expect(MockedDownloadFile).toHaveBeenCalledTimes(1);
        expect(MockedDownloadFile).toHaveBeenNthCalledWith(1, '/documents/1', 'document1FileNameTest', expect.anything());
    });
    it('Download test - Certificate', async () => {
        window.URL.createObjectURL = jest.fn().mockReturnValue('documentUrlTest')
        // @ts-ignore
        let component;
        await act(async () => {
            component = mount(<DocumentsHistoryElement
                title={''}
                document={documentMock}
                certificate={certificateMock}
                companyNameFrom={''}
                companyNameTo={''}
                processingStandardNames={['']}
            />);
        });
        // @ts-ignore
        component.update();
        expect(MockedNavLink).toHaveBeenCalledTimes(2);
        act(() => {
            // @ts-ignore
            MockedNavLink.mock.calls[1][0].onSelect('certificate');
        })
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(component.find('.DownloadButton').length).toEqual(2);
        await act(async () => {// @ts-ignore
            await component.find('.DownloadButton').at(0).simulate('click');
        });
        expect(MockedDownloadFile).toHaveBeenCalledTimes(1);
        expect(MockedDownloadFile).toHaveBeenNthCalledWith(1, '/documents/2', 'document2FileNameTest', expect.anything());
    });
    it('Content test file type - PDF', async () => {
        MockedGetFileExtension.mockReturnValue('pdf');
        window.URL.createObjectURL = jest.fn().mockReturnValue('documentUrlTest')
        // @ts-ignore
        let component;
        await act(async () => {
            component = mount(<DocumentsHistoryElement
                title={''}
                document={documentMock}
                certificate={certificateMock}
                companyNameFrom={''}
                companyNameTo={''}
                processingStandardNames={['']}
            />);
        });
        // @ts-ignore
        component.update();
        await act(async () => {// @ts-ignore
            await component.find('.DownloadButton').at(1).simulate('click');
        });
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(component.find('.Viewer').length).toEqual(1);
        expect(MockedViewer).toHaveBeenCalledTimes(1);
    });
    it('Content test file type - Image', async () => {
        MockedGetFileExtension.mockReturnValue('png');
        window.URL.createObjectURL = jest.fn().mockReturnValue('documentUrlTest')
        // @ts-ignore
        let component;
        await act(async () => {
            component = mount(<DocumentsHistoryElement
                title={''}
                document={documentMock}
                certificate={certificateMock}
                companyNameFrom={''}
                companyNameTo={''}
                processingStandardNames={['']}
            />);
        });
        // @ts-ignore
        component.update();
        await act(async () => {// @ts-ignore
            await component.find('.DownloadButton').at(1).simulate('click');
        });
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(component.find('img').length).toEqual(1);
    });

    it('Content test - no download and preview buttons due to visibility level', async () => {
        let component : any = null;
        const documentMock = {
            type: 'test',
            referenceNumber: 'referenceNumberTest',
            issueDate: issueDate,
            validUntilDate: validUntil,
            documentType: 'document1TypeTest',
            documentId: undefined,
            documentFileName: 'document1FileNameTest',
        }
        await act(async () => {
            component = mount(<DocumentsHistoryElement
                title={''}
                document={documentMock}
                certificate={certificateMock}
                companyNameFrom={''}
                companyNameTo={''}
                processingStandardNames={['']}
            />);
        });

        expect(component.find('.DownloadButton').length).toEqual(0);
        expect(component.find('.DocumentContainer').text()).toEqual("errors.doc_not_available");
    });
});