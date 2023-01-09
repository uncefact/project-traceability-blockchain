import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import React from "react";
import {mocked} from "ts-jest/utils";
import GenericDataTable from "../../../../../GenericComponents/GenericDataTable/GenericDataTable";
import TradeControllerApi from "../../../../../../api/TradeControllerApi";
import {act} from "react-dom/test-utils";
import TT, {TradeTable} from "./TradeTable";
import {Provider} from "react-redux";
import moment from "moment";
import {useHistory} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import {TableTradePresentable, TableTradePresentableStatusEnum} from "@unece/cotton-fetch";

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
jest.mock('../../../../../../api/TradeControllerApi', () => {
    return {
        getContracts: jest.fn(),
        getOrders: jest.fn(),
        getShippings: jest.fn(),
    }
});
jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn()
    }
});
jest.mock('react-responsive', () => {
    return {
        useMediaQuery: jest.fn()
    }
});
describe('TradeTable test', () => {
    const MockedGenericDataTable = mocked(GenericDataTable, true);
    const MockedGetContracts = mocked(TradeControllerApi.getContracts, true);
    const MockedGetOrders = mocked(TradeControllerApi.getOrders, true);
    const MockedGetShipping = mocked(TradeControllerApi.getShippings, true);
    const MockedUseHistory = mocked(useHistory, true);
    const mockedUseMediaQuery = mocked(useMediaQuery);
    const companyIndustrialSector = "sectorTest"

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        await act(async () => {
            await mount(<TradeTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={jest.fn()}
                startLoading={jest.fn()}
                stopLoading={jest.fn()}
            />);
        });
        await act(async () => {
            await mount(
                <Provider store={mockStore()}>
                    <TT/>
                </Provider>
            );
        });
    });
    it('Content Test - mobile', async () => {
        mockedUseMediaQuery.mockReturnValue(true);

        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const contracts: TableTradePresentable[] = [{
            contractorName: 'contractorName1Test',
            consigneeName: 'consigneeName1Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableTradePresentableStatusEnum.Pending,
            positions: [{contractorMaterialName: "material name"}]
        }];
        const orders: TableTradePresentable[] = [{
            contractorName: 'contractorName2Test',
            consigneeName: 'consigneeName2Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableTradePresentableStatusEnum.Accepted,
            positions: [{contractorMaterialName: "material name"}]
        }];
        const shipping: TableTradePresentable[] = [{
            contractorName: 'contractorName3Test',
            consigneeName: 'consigneeName3Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableTradePresentableStatusEnum.Refused,
            positions: [{contractorMaterialName: "material name1"}, {contractorMaterialName: "material name2"}]
        }];
        MockedGetContracts.mockReturnValue(Promise.resolve(contracts));
        MockedGetOrders.mockReturnValue(Promise.resolve(orders));
        MockedGetShipping.mockReturnValue(Promise.resolve(shipping));

        let component: any = null;

        await act(async () => {
            component = await mount(<TradeTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.trades');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
        expect(MockedGenericDataTable.mock.calls[1][0].data).toEqual([
            ...contracts.map(c => ({...c, materials: "material name", type: 'Contract'})),
            ...orders.map(o => ({...o, materials: "material name", type: 'Order'})),
            ...shipping.map(s => ({...s, materials: "material name1, material name2", type: 'Shipping'})),
        ]);

        expect(component.find('h4').length).toEqual(1);
        expect(component.find('h4').text()).toEqual("tables.trade_title");

        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(4);

        expect(MockedGenericDataTable.mock.calls[1][0].columns[0].text).toEqual("reference_number");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[1].text).toEqual("contractor_name");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[2].text).toEqual("consignee_name");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[3].text).toEqual("status");
    });
    it('Content Test', async () => {
        mockedUseMediaQuery.mockReturnValue(false);

        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const contracts: TableTradePresentable[] = [{
            contractorName: 'contractorName1Test',
            consigneeName: 'consigneeName1Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableTradePresentableStatusEnum.Pending,
            positions: [{contractorMaterialName: "material name"}]
        }];
        const orders: TableTradePresentable[] = [{
            contractorName: 'contractorName2Test',
            consigneeName: 'consigneeName2Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableTradePresentableStatusEnum.Accepted,
            positions: [{contractorMaterialName: "material name"}]
        }];
        const shipping: TableTradePresentable[] = [{
            contractorName: 'contractorName3Test',
            consigneeName: 'consigneeName3Test',
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
            status: TableTradePresentableStatusEnum.Refused,
            positions: [{contractorMaterialName: "material name1"}, {contractorMaterialName: "material name2"}]
        }];
        MockedGetContracts.mockReturnValue(Promise.resolve(contracts));
        MockedGetOrders.mockReturnValue(Promise.resolve(orders));
        MockedGetShipping.mockReturnValue(Promise.resolve(shipping));

        let component: any = null;

        await act(async () => {
            component = await mount(<TradeTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.trades');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
        expect(MockedGenericDataTable.mock.calls[1][0].data).toEqual([
            ...contracts.map(c => ({...c, materials: "material name", type: 'Contract'})),
            ...orders.map(o => ({...o, materials: "material name", type: 'Order'})),
            ...shipping.map(s => ({...s, materials: "material name1, material name2", type: 'Shipping'})),
        ]);

        expect(component.find('h4').length).toEqual(1);
        expect(component.find('h4').text()).toEqual("tables.trade_title");

        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(7);

        expect(MockedGenericDataTable.mock.calls[1][0].columns[0].text).toEqual("reference_number");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[1].text).toEqual("document_type");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[2].text).toEqual("contractor_name");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[3].text).toEqual("consignee_name");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[4].text).toEqual("valid_from");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[5].text).toEqual("materials");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[6].text).toEqual("status");

        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[4].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
    });
    it('Content Test - error', async () => {
        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        MockedGetContracts.mockImplementation(() => Promise.reject());
        await act(async () => {
            await mount(<TradeTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.trades');
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, 'popups.errors.trades');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
    });

    it('row click test', async () => {
        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const pushMock = jest.fn();
        MockedGetContracts.mockImplementation(() => Promise.resolve([]));
        await act(async () => {
            await mount(<TradeTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        let component: any = null;
        await act(async () => {
            component = await mount(<TradeTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
            />);
        });

        expect(MockedGenericDataTable).toHaveBeenCalledTimes(4);
        // @ts-ignore
        MockedGenericDataTable.mock.calls[3][0].onRowClick({}, {id: 1, type: "contract"}, 0);
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenNthCalledWith(1, '/' + companyIndustrialSector + '/trades/1/confirmation?type=contract');
    });
});
