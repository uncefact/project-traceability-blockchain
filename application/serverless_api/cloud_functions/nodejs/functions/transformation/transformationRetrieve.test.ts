import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildTransformationService } from "../../utils/blockchainUtils";
import { transformationRetrieve } from './transformationRetrieve';
import { TransformationJsonSerializer, Transformation } from '@blockchain-lib/supply-chain-mgmt';


jest.mock('../../utils/utils', () => {
    return {
        getUsernameByRequest: jest.fn(),
        validateRequest: jest.fn()
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

describe('transformationRetrieve', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedgetTransformationService = mocked(buildTransformationService, true);


    it('should retrieve a transformation from its id', async () => {
        const mockedSend = jest.fn();
        const retrieve = jest.fn();
        const privateKey = "privateKeyTest";
        const startDate = new Date(), endDate = new Date();
        const transformation = new Transformation(['matIn1', 'matIn2'], 'matOut3', 'transformation1', startDate, endDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1');
        const username = "usernameTest"

        const mockedRequest = createMock<Request>({
            query: {
                id: "trans1"
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedgetTransformationService.mockReturnValue(Promise.resolve({retrieve: retrieve}));
        retrieve.mockReturnValue(Promise.resolve(transformation));
        const mockedSerialize = jest.spyOn(TransformationJsonSerializer.prototype, 'serialize');
        mockedSerialize.mockReturnValue(JSON.stringify(transformation));

        await transformationRetrieve(mockedRequest, mockedResponse);
        
        expect(validateRequest).toHaveBeenCalledTimes(1);
        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.query, Object.keys(mockedRequest.query));
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedgetTransformationService).toHaveBeenCalledTimes(1);
        expect(MockedgetTransformationService).toHaveBeenNthCalledWith(1, privateKey);
        expect(retrieve).toHaveBeenCalledTimes(1);
        expect(retrieve).toHaveBeenNthCalledWith(1, mockedRequest.query.id);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, JSON.stringify(transformation));
    });
});
