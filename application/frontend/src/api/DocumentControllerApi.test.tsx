import {mocked} from "ts-jest/utils";
import React from "react";
import {DocumentControllerApi} from "@unece/cotton-fetch";
import configuration from "./utils";

jest.mock('@unece/cotton-fetch', () => {
    return {
        DocumentControllerApi: jest.fn(),
    }
});
jest.mock('./utils', () => {
    return {
        prop: 'propTest'
    }
});

describe('DocumentControllerApi test', () => {
    const MockedDocumentControllerApi = mocked(DocumentControllerApi, true);
    const MockedConfiguration = mocked(configuration, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('basic test', async () => {
        await import ('./DocumentControllerApi');

        expect(MockedDocumentControllerApi).toHaveBeenCalledTimes(1);
        expect(MockedDocumentControllerApi).toHaveBeenNthCalledWith(1, MockedConfiguration);
    });
});
