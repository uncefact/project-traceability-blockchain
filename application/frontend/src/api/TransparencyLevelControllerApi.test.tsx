import {mocked} from "ts-jest/utils";
import {TransparencyLevelControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        TransparencyLevelControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});
describe('TransparencyLevelControllerApi test', () => {
    const MockedTransparencyLevelControllerApi = mocked(TransparencyLevelControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./TransparencyLevelControllerApi');

        expect(MockedTransparencyLevelControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedTransparencyLevelControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});