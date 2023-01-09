import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildTradeService } from "../../utils/blockchainUtils";
import { tradeRetrieveAll } from './tradeRetrieveAll';
import { Trade, TradeJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';


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
        buildTradeService: jest.fn()
    }
});

describe('tradeRetrieveAll', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetTradeService = mocked(buildTradeService, true);


    it('should retrieve all trades', async () => {
        const mockedSend = jest.fn();
        const retrieveAll = jest.fn();
        const privateKey = "privateKeyTest";
        const trades = [
            new Trade([['mat1']], "trade1", [], [], 'trade1', "0xtrade1"), 
            new Trade([['mat2', 'mat3']], "trade2", [], [], 'trade2', "0xtrade2")];
        const username = "usernameTest";

        const mockedRequest = createMock<Request>();
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetTradeService.mockReturnValue(Promise.resolve({retrieveAll: retrieveAll}));
        retrieveAll.mockReturnValue(Promise.resolve(trades));
        const mockedSerialize = jest.spyOn(TradeJsonSerializer.prototype, 'serialize');
        mockedSerialize.mockImplementation((m => JSON.stringify(m)));
        
        await tradeRetrieveAll(mockedRequest, mockedResponse);
        
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetTradeService).toHaveBeenCalledTimes(1);
        expect(MockedGetTradeService).toHaveBeenNthCalledWith(1, privateKey);
        expect(retrieveAll).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, trades.map(t => JSON.stringify(t)));
    });
});
