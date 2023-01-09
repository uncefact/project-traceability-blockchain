import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import React from "react";
import {mocked} from "ts-jest/utils";
import GenericDataTable from "../../../../../GenericComponents/GenericDataTable/GenericDataTable";
import TransformationPlanControllerApi from "../../../../../../api/TransformationPlanControllerApi";
import {act} from "react-dom/test-utils";
import TPT, {TransformationPlanTable} from "./TransformationPlanTable";
import {Provider} from "react-redux";
import {
    TransformationPlanPresentable
} from "@unece/cotton-fetch";
import moment from "moment";
import {useHistory, useRouteMatch} from "react-router-dom";
import {useMediaQuery} from "react-responsive";

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
jest.mock('../../../../../../api/TransformationPlanControllerApi', () => {
    return {
        getAllMyTransformationPlans: jest.fn(),
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
describe('TransformationPlanTable test', () => {
    const MockedGenericDataTable = mocked(GenericDataTable, true);
    const MockedGetAllMyTransformationPlans = mocked(TransformationPlanControllerApi.getAllMyTransformationPlans, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedUseRouteMatch = mocked(useRouteMatch, true);
    const mockedUseMediaQuery = mocked(useMediaQuery);
    const companyIndustrialSector = "sectorTest"

    // @ts-ignore
    MockedUseRouteMatch.mockReturnValue({
        params: {companyIndustry: 'sectorTest'}
    })

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        await act(async () => {
            await mount(<TransformationPlanTable
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
                    <TPT/>
                </Provider>
            );
        });
    });
    it('Content Test - mobile', async () => {
        mockedUseMediaQuery.mockReturnValue(true);

        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const transformationPlans: TransformationPlanPresentable[] = [{
            name: 'transformation test',
            outputMaterial: {name: "material name"},
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
        }];
        let component: any = null;
        MockedGetAllMyTransformationPlans.mockReturnValue(Promise.resolve(transformationPlans));
        await act(async () => {
            component = await mount(<TransformationPlanTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.transformations');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
        expect(MockedGenericDataTable.mock.calls[1][0].data).toEqual([
            ...transformationPlans
        ]);

        expect(component.find('h4').length).toEqual(1);
        expect(component.find('h4').text()).toEqual("tables.transformation_title");
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(2);
        expect(MockedGenericDataTable.mock.calls[1][0].columns[0].text).toEqual("name");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[1].text).toEqual("material_name");
    });
    it('Content Test', async () => {
        mockedUseMediaQuery.mockReturnValue(false);

        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const transformationPlans: TransformationPlanPresentable[] = [{
            name: 'transformation test',
            outputMaterial: {name: "material name"},
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
        }];
        let component: any = null;
        MockedGetAllMyTransformationPlans.mockReturnValue(Promise.resolve(transformationPlans));
        await act(async () => {
            component = await mount(<TransformationPlanTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.transformations');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
        expect(MockedGenericDataTable.mock.calls[1][0].data).toEqual([
            ...transformationPlans
        ]);

        expect(component.find('h4').length).toEqual(1);
        expect(component.find('h4').text()).toEqual("tables.transformation_title");
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(4);
        expect(MockedGenericDataTable.mock.calls[1][0].columns[0].text).toEqual("name");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[1].text).toEqual("material_name");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[2].text).toEqual("valid_from");
        expect(MockedGenericDataTable.mock.calls[1][0].columns[3].text).toEqual("valid_until");
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[2].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[3].formatter('2021-01-01 10:10')).toEqual('2021-01-01');
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns[3].formatter(null)).toEqual('');
    });
    it('Content Test - error', async () => {
        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        MockedGetAllMyTransformationPlans.mockImplementation(() => Promise.reject());
        await act(async () => {
            await mount(<TransformationPlanTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.transformations');
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, 'popups.errors.transformations');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
    });

    it('row click test', async () => {
        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const pushMock = jest.fn();

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        const transformationPlans: TransformationPlanPresentable[] = [{
            name: 'transformation test',
            outputMaterial: {name: "material name"},
            validFrom: moment('2021-01-01').toDate(),
            validUntil: moment('2021-12-01').toDate(),
        }];
        let component: any = null;
        MockedGetAllMyTransformationPlans.mockReturnValue(Promise.resolve(transformationPlans));
        await act(async () => {
            component = await mount(<TransformationPlanTable
                companyIndustrialSector={companyIndustrialSector}
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });

        // @ts-ignore
        MockedGenericDataTable.mock.calls[0][0].onRowClick({}, {id: 1}, 0);
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenNthCalledWith(1, '/' + companyIndustrialSector + '/transformationPlans/1');
    });
});
