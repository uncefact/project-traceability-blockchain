import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildTransformationService } from "../../utils/blockchainUtils";
import { TransformationJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { transformationUpdate } from './transformationUpdate';


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


describe('transformationUpdate', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetTransformationService = mocked(buildTransformationService, true);

    it('Update a transformation', async () => {
        const mockedSend = jest.fn();
        const update = jest.fn();
        const privateKey = "privateKeyTest";
        const username = "usernameTest";

        const mockedRequest = createMock<Request>({
            body: {
                id: "1",
                materialsInIds: ["1"],
                materialOutId: "2",
                name: "transformation name"
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetTransformationService.mockReturnValue(Promise.resolve({update: update}));
        const mockedDeserialize = jest.spyOn(TransformationJsonSerializer.prototype, 'deserialize');
        mockedDeserialize.mockReturnValue(mockedRequest.body);

        await transformationUpdate(mockedRequest, mockedResponse);
        
        expect(validateRequest).toHaveBeenCalledTimes(1);
        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.body, Object.keys(mockedRequest.body));
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetTransformationService).toHaveBeenCalledTimes(1);
        expect(MockedGetTransformationService).toHaveBeenNthCalledWith(1, privateKey);
        
        expect(update).toHaveBeenCalledTimes(1);
        expect(update).toHaveBeenNthCalledWith(1, mockedRequest.body);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, `Transformation ${mockedRequest.body.id} update completed!`);
    });
});
