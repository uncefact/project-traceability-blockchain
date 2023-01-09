import {mocked} from "ts-jest/utils";
import {ProcessTypeControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        ProcessTypeControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});
describe('ProcessTypeControllerApi test', () => {
    const MockedProcessTypeControllerApi = mocked(ProcessTypeControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./ProcessTypeControllerApi');

        expect(MockedProcessTypeControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedProcessTypeControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});