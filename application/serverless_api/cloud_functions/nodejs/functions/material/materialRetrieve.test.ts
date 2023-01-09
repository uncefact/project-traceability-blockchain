import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildMaterialService } from "../../utils/blockchainUtils";
import { materialRetrieve } from './materialRetrieve';
import { Material, MaterialJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';


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

describe('materialRetrieve', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetMaterialService = mocked(buildMaterialService, true);


    it('should retrieve a material from its id', async () => {
        const mockedSend = jest.fn();
        const retrieve = jest.fn();
        const privateKey = "privateKeyTest";
        const material = new Material('testName', ['productType1'], 'sourceUrlTest', 'mat1');
        const username = "usernameTest"

        const mockedRequest = createMock<Request>({
            query: {
                id: 'mat1'
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetMaterialService.mockReturnValue(Promise.resolve({retrieve: retrieve}));
        retrieve.mockReturnValue(Promise.resolve(material));
        const mockedSerialize = jest.spyOn(MaterialJsonSerializer.prototype, 'serialize');
        mockedSerialize.mockReturnValue(JSON.stringify(material));

        await materialRetrieve(mockedRequest, mockedResponse);
        
        expect(validateRequest).toHaveBeenCalledTimes(1);
        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.query, Object.keys(mockedRequest.query));
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetMaterialService).toHaveBeenCalledTimes(1);
        expect(MockedGetMaterialService).toHaveBeenNthCalledWith(1, privateKey);
        expect(retrieve).toHaveBeenCalledTimes(1);
        expect(retrieve).toHaveBeenNthCalledWith(1, mockedRequest.query.id);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, JSON.stringify(material));
    });
});
