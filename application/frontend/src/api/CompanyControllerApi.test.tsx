import {mocked} from "ts-jest/utils";
import React from "react";
import {CompanyControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        CompanyControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('CompanyControllerApi test', () => {
    const MockedCompanyControllerApi = mocked(CompanyControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./CompanyControllerApi');

        expect(MockedCompanyControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedCompanyControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
