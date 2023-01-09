import {mocked} from "ts-jest/utils";
import React from "react";
import {InfoControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        InfoControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('InfoControllerApi test', () => {
    const MockedInfoControllerApi = mocked(InfoControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./InfoControllerApi');

        expect(MockedInfoControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedInfoControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
