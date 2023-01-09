import {mocked} from "ts-jest/utils";
import React from "react";
import {TradeControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        TradeControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('TradeControllerApi test', () => {
    const MockedTradeControllerApi = mocked(TradeControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./TradeControllerApi');

        expect(MockedTradeControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedTradeControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
