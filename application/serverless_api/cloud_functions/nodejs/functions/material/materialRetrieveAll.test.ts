import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildMaterialService } from "../../utils/blockchainUtils";
import { materialRetrieveAll } from './materialRetrieveAll';
import { Material, MaterialJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';


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
        buildMaterialService: jest.fn()
    }
});

describe('materialRetrieveAll', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetMaterialService = mocked(buildMaterialService, true);


    it('should retrieve all materials', async () => {
        const mockedSend = jest.fn();
        const retrieveAll = jest.fn();
        const privateKey = "privateKeyTest";
        const materials = [
            new Material('testName', ['productType1'], 'sourceUrlTest', 'mat1'), 
            new Material('testName', ['productType1'], 'sourceUrlTest', 'mat2')];
        const username = "usernameTest";

        const mockedRequest = createMock<Request>();
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetMaterialService.mockReturnValue(Promise.resolve({retrieveAll: retrieveAll}));
        retrieveAll.mockReturnValue(Promise.resolve(materials));
        const mockedSerialize = jest.spyOn(MaterialJsonSerializer.prototype, 'serialize');
        mockedSerialize.mockImplementation((m => JSON.stringify(m)));
        
        await materialRetrieveAll(mockedRequest, mockedResponse);
        
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetMaterialService).toHaveBeenCalledTimes(1);
        expect(MockedGetMaterialService).toHaveBeenNthCalledWith(1, privateKey);
        expect(retrieveAll).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, 
            materials.map(m => JSON.stringify(m)));
    });
});
