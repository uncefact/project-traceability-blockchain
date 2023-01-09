import {transformationAllowRead} from "./transformationAllowRead";
import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildTransformationService } from "../../utils/blockchainUtils";


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


describe('transformationAllowRead', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetTransformationService = mocked(buildTransformationService, true);


    it('should allow read on transformation', async () => {
        const mockedSend = jest.fn();
        const allowRead = jest.fn();
        const privateKey = "privateKeyTest";
        const username = "usernameTest";

        const mockedRequest = createMock<Request>({
            query: {
                id: "trans1",
                publicKey: "pubtest",
                ethAddress: "addressTest"
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetTransformationService.mockReturnValue(Promise.resolve({allowRead: allowRead}));

        await transformationAllowRead(mockedRequest, mockedResponse);
        
        expect(validateRequest).toHaveBeenCalledTimes(1);
        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.query, Object.keys(mockedRequest.query));
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetTransformationService).toHaveBeenCalledTimes(1);
        expect(MockedGetTransformationService).toHaveBeenNthCalledWith(1, privateKey);
        expect(allowRead).toHaveBeenCalledTimes(1);
        expect(allowRead).toHaveBeenNthCalledWith(1, 
            mockedRequest.query.id, mockedRequest.query.publicKey, mockedRequest.query.ethAddress);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, `Resource index for ${mockedRequest.query.ethAddress} saved on chain!`);
    });

});
