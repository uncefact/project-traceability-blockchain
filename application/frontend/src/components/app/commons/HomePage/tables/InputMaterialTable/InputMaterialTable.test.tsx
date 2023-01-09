import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import React from "react";
import {mocked} from "ts-jest/utils";
import GenericDataTable from "../../../../../GenericComponents/GenericDataTable/GenericDataTable";
import MaterialControllerApi from "../../../../../../api/MaterialControllerApi";
import {act} from "react-dom/test-utils";
import IMT, {InputMaterialTable} from "./InputMaterialTable";
import {Provider} from "react-redux";
import {
    MaterialPresentable
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
jest.mock('../../../../../../api/MaterialControllerApi', () => {
    return {
        getMaterialsByCompany: jest.fn(),
    }
});

describe('InputMaterialTable test', () => {
    const MockedGenericDataTable = mocked(GenericDataTable, true);
    const MockedGetMaterialsFromCompany = mocked(MaterialControllerApi.getMaterialsByCompany, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        await act(async () => {
            await mount(<InputMaterialTable
                addErrorMessage={jest.fn()}
                startLoading={jest.fn()}
                stopLoading={jest.fn()}
                userLoggedIn={{}}
            />);
        });
        await act(async () => {
            await mount(
                <Provider store={mockStore()}>
                    <IMT/>
                </Provider>
            );
        });
    });
    it('Content Test', async () => {
        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        const materials: MaterialPresentable[] = [{
            name: 'material 1 test',
        }];
        MockedGetMaterialsFromCompany.mockReturnValue(Promise.resolve(materials));
        await act(async () => {
            await mount(<InputMaterialTable
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.input_materials');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(2);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
        expect(MockedGenericDataTable.mock.calls[1][0].data).toEqual([
            ...materials
        ]);
        // @ts-ignore
        expect(MockedGenericDataTable.mock.calls[1][0].columns.length).toEqual(1);
    });
    it('Content Test - error', async () => {
        const addErrorMessage = jest.fn();
        const startLoading = jest.fn();
        const stopLoading = jest.fn();
        MockedGetMaterialsFromCompany.mockImplementation(() => Promise.reject());
        await act(async () => {
            await mount(<InputMaterialTable
                addErrorMessage={addErrorMessage}
                startLoading={startLoading}
                stopLoading={stopLoading}
                userLoggedIn={{}}
            />);
        });
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(startLoading).toHaveBeenNthCalledWith(1, 'popups.loading.input_materials');
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, 'popups.errors.input_material');
        expect(stopLoading).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable).toHaveBeenCalledTimes(1);
        expect(MockedGenericDataTable.mock.calls[0][0].data).toEqual([]);
    });
});
