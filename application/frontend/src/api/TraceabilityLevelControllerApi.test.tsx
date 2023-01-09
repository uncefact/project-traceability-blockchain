import {mocked} from "ts-jest/utils";
import {TraceabilityLevelControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        TraceabilityLevelControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});
describe('TraceabilityLevelControllerApi test', () => {
    const MockedTraceabilityLevelControllerApi = mocked(TraceabilityLevelControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./TraceabilityLevelControllerApi');

        expect(MockedTraceabilityLevelControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedTraceabilityLevelControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});