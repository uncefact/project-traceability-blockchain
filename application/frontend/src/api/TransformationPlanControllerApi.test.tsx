import {mocked} from "ts-jest/utils";
import React from "react";
import {TransformationPlanControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        TransformationPlanControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('TransformationPlanControllerApi test', () => {
    const MockedTransformationPlanControllerApi = mocked(TransformationPlanControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./TransformationPlanControllerApi');

        expect(MockedTransformationPlanControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedTransformationPlanControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
