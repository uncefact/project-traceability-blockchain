import {mocked} from "ts-jest/utils";
import {SustainabilityCriteriaControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        SustainabilityCriteriaControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});
describe('SustainabilityCriteriaControllerApi test', () => {
    const MockedSustainabilityCriteriaControllerApi = mocked(SustainabilityCriteriaControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./SustainabilityCriteriaControllerApi');

        expect(MockedSustainabilityCriteriaControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedSustainabilityCriteriaControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});