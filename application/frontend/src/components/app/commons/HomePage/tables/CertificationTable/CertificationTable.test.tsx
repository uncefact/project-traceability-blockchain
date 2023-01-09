import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import React from "react";
import {mocked} from "ts-jest/utils";
import GenericDataTable from "../../../../../GenericComponents/GenericDataTable/GenericDataTable";
import CertificationControllerApi from "../../../../../../api/CertificationControllerApi";
import {act} from "react-dom/test-utils";
import CT, {CertificationTable} from "./CertificationTable";
import {Provider} from "react-redux";
import moment from "moment";
import {useHistory} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import {
    TableCertificationPresentable, TableCertificationPresentableSubjectEnum, TableCertificationPresentableStatusEnum
} from "@unece/cotton-fetch";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('../../../../../GenericComponents/GenericDataTable/GenericDataTable', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'GenericDataTable'}>{children}</div>)
});
jest.mock('../../../../../../api/CertificationControllerApi', () => {
    return {
        getMyCertifications: jest.fn(),
    }
});
jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(),
        useRouteMatch: jest.fn()
    }
});
jest.mock('react-responsive', () => {
    return {
        useMediaQuery: jest.fn()
    }
});
describe('CertificationTable test', () => {
    const MockedGenericDataTable = mocked(GenericDataTable, true);
    const MockedGetCertificationsByCompany = mocked(CertificationControllerApi.getMyCertifications, true);
    const MockedUseHistory = mocked(useHistory, true);
    const mockedUseMediaQuery = mocked(useMediaQuery);
    const companyIndustrialSector = "sectorTest"

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        await act(async () => {
            await mount(<CertificationTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={jest.fn()}
                startLoading={jest.fn()}
                stopLoading={jest.fn()}
                userLoggedIn={{}}
            />);
        });
        await act(async () => {
            await mount(
                <Provider store={mockStore()}>
                    <CT/>
                </Provider>
            );
        });
    });
    it('Content Test - mobile', async () => {
        mockedUseMediaQuery.mockReturnValue(true);
        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const certifications: TableCertificationPresentable[] = [{
            contractorName: 'certificatorNameTest',
            consigneeName: 'consigneeName1Test',
        }];

        let component: any = null;
        MockedGetCertificationsByCompany.mockReturnValue(Promise.resolve(certifications));
        await act(async () => {
            component = await mount(<CertificationTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.certifications');
        expect(stopLoading).toHaveBeenCalledTimes(1);

        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);

        expect(component.find('h4').length).toEqual(1);
        expect(component.find('h4').text()).toEqual("tables.certificate_title");

        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(3);

        expect(MockedGenericDataTable.mock.calls[1][0].columns[0].text).toEqual("reference_number");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[1].text).toEqual("reference_standard");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[2].text).toEqual("status");
    });
    it('Content Test - generic certification', async () => {
        mockedUseMediaQuery.mockReturnValue(false);

        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const certifications: TableCertificationPresentable[] = [{
            contractorName: 'certificatorNameTest',
            consigneeName: 'consigneeName1Test',
        }];

        let component: any = null;
        MockedGetCertificationsByCompany.mockReturnValue(Promise.resolve(certifications));
        await act(async () => {
            component = await mount(<CertificationTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.certifications');
        expect(stopLoading).toHaveBeenCalledTimes(1);

        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);

        expect(component.find('h4').length).toEqual(1);
        expect(component.find('h4').text()).toEqual("tables.certificate_title");

        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(7);

        expect(MockedGenericDataTable.mock.calls[1][0].columns[0].text).toEqual("reference_number");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[1].text).toEqual("document_type");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[2].text).toEqual("assessment_type");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[3].text).toEqual("reference_standard");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[4].text).toEqual("valid_from");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].text).toEqual("valid_until");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[6].text).toEqual("status");
    });

    it('Content Test - certification scope', async () => {
        mockedUseMediaQuery.mockReturnValue(false);

        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const certifications: TableCertificationPresentable[] = [{
            contractorName: 'certificatorNameTest',
            consigneeName: 'consigneeName1Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableCertificationPresentableStatusEnum.Pending,
            subject: TableCertificationPresentableSubjectEnum.Scope
        }];

        MockedGetCertificationsByCompany.mockReturnValue(Promise.resolve(certifications));
        await act(async () => {
            await mount(<CertificationTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.certifications');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
        expect(MockedGenericDataTable.mock.calls[1][0].data).toEqual([
            ...certifications.map(c => ({...c, type: 'Scope', certificationEntity: 'certificatorNameTest'}))
        ]);
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(7);
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[4].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].formatter(null)).toEqual('');
    });
    it('Content Test - certification transaction', async () => {
        mockedUseMediaQuery.mockReturnValue(false);

        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const certifications: TableCertificationPresentable[] = [{
            contractorName: 'certificatorNameTest',
            consigneeName: 'consigneeName1Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableCertificationPresentableStatusEnum.Pending,
            subject: TableCertificationPresentableSubjectEnum.Transaction
        }];

        MockedGetCertificationsByCompany.mockReturnValue(Promise.resolve(certifications));
        await act(async () => {
            await mount(<CertificationTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.certifications');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
        expect(MockedGenericDataTable.mock.calls[1][0].data).toEqual([
            ...certifications.map(c => ({...c, type: 'Transaction', certificationEntity: 'certificatorNameTest'}))
        ]);
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(7);
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[4].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].formatter(null)).toEqual('');
    });
    it('Content Test - certification material', async () => {
        mockedUseMediaQuery.mockReturnValue(false);

        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const certifications: TableCertificationPresentable[] = [{
            contractorName: 'certificatorNameTest',
            consigneeName: 'consigneeName1Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableCertificationPresentableStatusEnum.Pending,
            subject: TableCertificationPresentableSubjectEnum.Material
        }];

        MockedGetCertificationsByCompany.mockReturnValue(Promise.resolve(certifications));
        await act(async () => {
            await mount(<CertificationTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.certifications');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
        expect(MockedGenericDataTable.mock.calls[1][0].data).toEqual([
            ...certifications.map(c => ({...c, type: 'Material', certificationEntity: 'certificatorNameTest'}))
        ]);
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(7);
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[4].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].formatter(null)).toEqual('');
    });
    it('Content Test - certification self', async () => {
        mockedUseMediaQuery.mockReturnValue(false);

        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const certifications: TableCertificationPresentable[] = [{
            contractorName: 'certificatorNameTest',
            consigneeName: 'consigneeName1Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableCertificationPresentableStatusEnum.Pending,
            subject: TableCertificationPresentableSubjectEnum.Self
        }];

        MockedGetCertificationsByCompany.mockReturnValue(Promise.resolve(certifications));
        await act(async () => {
            await mount(<CertificationTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.certifications');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
        expect(MockedGenericDataTable.mock.calls[1][0].data).toEqual([
            ...certifications.map(c => ({...c, type: 'Self', certificationEntity: 'certificatorNameTest'}))
        ]);
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(7);
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[4].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].formatter(null)).toEqual('');
    });
    it('Content Test - error', async () => {
        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();

        MockedGetCertificationsByCompany.mockImplementation(() => Promise.reject());
        await act(async () => {
            await mount(<CertificationTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.certifications');
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, 'popups.errors.certifications');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
    });

    it('row click test', async () => {
        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const pushMock = jest.fn();

        const certifications: TableCertificationPresentable[] = [{
            contractorName: 'certificatorNameTest',
            consigneeName: 'consigneeName1Test',
            subject: TableCertificationPresentableSubjectEnum.Scope
        }];

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        let component: any = null;
        MockedGetCertificationsByCompany.mockReturnValue(Promise.resolve(certifications));
        await act(async () => {
            component = await mount(<CertificationTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });

        // @ts-ignore
        const row = {id: 1, subject: certifications[0].subject.toLowerCase()};
        // @ts-ignore
        MockedGenericDataTable.mock.calls[0][0].onRowClick({}, row, 0);
        expect(pushMock).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(pushMock).toHaveBeenNthCalledWith(1, '/' + companyIndustrialSector + '/certifications/' + row.subject + '/' + row.id + '/confirmation');
    });
});
