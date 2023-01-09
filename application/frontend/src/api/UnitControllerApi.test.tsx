import {mocked} from "ts-jest/utils";
import React from "react";
import {UnitControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        UnitControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('UnitControllerApi test', () => {
    const MockedUnitControllerApi = mocked(UnitControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./UnitControllerApi');

        expect(MockedUnitControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedUnitControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
