import {mocked} from "ts-jest/utils";
import React from "react";
import configuration from "./utils";
import {MaterialControllerApi} from "@unece/cotton-fetch";

jest.mock('@unece/cotton-fetch', () => {
    return {
        MaterialControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('MaterialControllerApi test', () => {
    const MockedDocumentControllerApi = mocked(MaterialControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./MaterialControllerApi');

        expect(MockedDocumentControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedDocumentControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
