import {mocked} from "ts-jest/utils";
import React from "react";
import configuration from "./utils";
import {CertificationControllerApi} from "@unece/cotton-fetch";

jest.mock('@unece/cotton-fetch', () => {
    return {
        CertificationControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('CertificationControllerApi test', () => {
    const MockedCompanyControllerApi = mocked(CertificationControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./CertificationControllerApi');

        expect(MockedCompanyControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedCompanyControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
