import {mocked} from "ts-jest/utils";
import React from "react";
import {UserControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        UserControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('UserControllerApi test', () => {
    const MockedUserControllerApi = mocked(UserControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./UserControllerApi');

        expect(MockedUserControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedUserControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
