import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildTradeService } from "../../utils/blockchainUtils";
import { tradeRetrieve } from './tradeRetrieve';
import { Trade, TradeJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';


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
        buildTradeService: jest.fn()
    }
});

describe('tradeRetrieve', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedgetTradeService = mocked(buildTradeService, true);


    it('should retrieve a trade from its id', async () => {
        const mockedSend = jest.fn();
        const retrieve = jest.fn();
        const privateKey = "privateKeyTest";
        const trade = new Trade([['mat1', 'mat1'], ['mat2', 'mat2']], "trade1", [], [], 'consigneeCompanyId', 'trade1', "0xtrade1");
        const username = "usernameTest"

        const mockedRequest = createMock<Request>({
            query: {
                id: "trade1"
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedgetTradeService.mockReturnValue(Promise.resolve({retrieve: retrieve}));
        retrieve.mockReturnValue(Promise.resolve(trade));
        const mockedSerialize = jest.spyOn(TradeJsonSerializer.prototype, 'serialize');
        mockedSerialize.mockReturnValue(JSON.stringify(trade));

        await tradeRetrieve(mockedRequest, mockedResponse);
        
        expect(validateRequest).toHaveBeenCalledTimes(1);
        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.query, Object.keys(mockedRequest.query));
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedgetTradeService).toHaveBeenCalledTimes(1);
        expect(MockedgetTradeService).toHaveBeenNthCalledWith(1, privateKey);
        expect(retrieve).toHaveBeenCalledTimes(1);
        expect(retrieve).toHaveBeenNthCalledWith(1, mockedRequest.query.id);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, JSON.stringify(trade));
    });
});
