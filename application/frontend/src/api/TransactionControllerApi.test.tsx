import {mocked} from "ts-jest/utils";
import React from "react";
import {TransactionControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        TransactionControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('TransactionControllerApi test', () => {
    const MockedTransactionControllerApi = mocked(TransactionControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./TransactionControllerApi');

        expect(MockedTransactionControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedTransactionControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
