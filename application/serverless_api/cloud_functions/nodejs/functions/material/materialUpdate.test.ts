import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildMaterialService } from "../../utils/blockchainUtils";
import { Material, MaterialJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { materialUpdate } from './materialUpdate';


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
        buildMaterialService: jest.fn()
    }
});


describe('materialUpdate', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetMaterialService = mocked(buildMaterialService, true);

    it('Update a material', async () => {
        const mockedSend = jest.fn();
        const update = jest.fn();
        const privateKey = "privateKeyTest";
        const username = "usernameTest";

        const mockedRequest = createMock<Request>({
            body: {
                id: "mat1",
                name: "material name",
                productTypes: []
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetMaterialService.mockReturnValue(Promise.resolve({update: update}));
        const mockedDeserialize = jest.spyOn(MaterialJsonSerializer.prototype, 'deserialize');
        mockedDeserialize.mockReturnValue(mockedRequest.body);

        await materialUpdate(mockedRequest, mockedResponse);
        
        expect(validateRequest).toHaveBeenCalledTimes(1);

        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.body, Object.keys(mockedRequest.body));
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetMaterialService).toHaveBeenCalledTimes(1);
        expect(MockedGetMaterialService).toHaveBeenNthCalledWith(1, privateKey);
        
        expect(update).toHaveBeenCalledTimes(1);
        expect(update).toHaveBeenNthCalledWith(1, mockedRequest.body);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, `Material ${mockedRequest.body.id} update completed!`);
    });
});
