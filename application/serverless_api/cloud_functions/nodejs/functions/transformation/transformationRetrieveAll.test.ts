import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildTransformationService } from "../../utils/blockchainUtils";
import { transformationRetrieveAll } from './transformationRetrieveAll';
import { TransformationJsonSerializer, Transformation } from '@blockchain-lib/supply-chain-mgmt';


jest.mock('../../utils/utils', () => {
    return {
        getUsernameByRequest: jest.fn()
    }
});

jest.mock('../../utils/mysqlUtils', () => {
    return {
        getWalletPrivateKeyByUsername: jest.fn()
    }
});

jest.mock('../../utils/blockchainUtils', () => {
    return {
        buildTransformationService: jest.fn()
    }
});

describe('transformationRetrieveAll', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetTransformationService = mocked(buildTransformationService, true);


    it('should retrieve all transformations', async () => {
        const mockedSend = jest.fn();
        const retrieveAll = jest.fn();
        const privateKey = "privateKeyTest";
        const startDate = new Date(), endDate = new Date();
        const transformations = [
            new Transformation(['matIn1'], 'matOut4', 'transformation1', startDate, endDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1'), 
            new Transformation(['matIn2', 'matIn3'], 'matOut5', 'transformation2', startDate, endDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans2')];
        const username = "usernameTest";

        const mockedRequest = createMock<Request>();
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetTransformationService.mockReturnValue(Promise.resolve({retrieveAll: retrieveAll}));
        retrieveAll.mockReturnValue(Promise.resolve(transformations));
        const mockedSerialize = jest.spyOn(TransformationJsonSerializer.prototype, 'serialize');
        mockedSerialize.mockImplementation((m => JSON.stringify(m)));
        
        await transformationRetrieveAll(mockedRequest, mockedResponse);
        
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetTransformationService).toHaveBeenCalledTimes(1);
        expect(MockedGetTransformationService).toHaveBeenNthCalledWith(1, privateKey);
        expect(retrieveAll).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, transformations.map(t => JSON.stringify(t)));
    });
});
