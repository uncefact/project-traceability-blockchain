import {Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../utils/utils";
import {mocked} from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../utils/mysqlUtils";
import { buildTradeService } from "../../utils/blockchainUtils";
import { Trade, TradeJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { tradeStore } from "./tradeStore";


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


describe('tradeStore', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetTradeService = mocked(buildTradeService, true);
    
    it('should store a trade', async () => {
        const mockedSend = jest.fn();
        const store = jest.fn();
        const privateKey = "privateKeyTest";
        const username = "usernameTest";
        
        const mockedRequest = createMock<Request>({
            body: {
                materialsIds: [["1"]],
                name: "trade name",
                processTypes: [],
                processingStds: []
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });
        

        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetTradeService.mockReturnValue(Promise.resolve({store: store}));

        const mockedDeserialize = jest.spyOn(TradeJsonSerializer.prototype, 'deserialize');
        mockedDeserialize.mockReturnValue(mockedRequest.body);
        await tradeStore(mockedRequest, mockedResponse);
        
        expect(validateRequest).toHaveBeenCalledTimes(1);
        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.body, Object.keys(mockedRequest.body));
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetTradeService).toHaveBeenCalledTimes(1);
        expect(MockedGetTradeService).toHaveBeenNthCalledWith(1, privateKey);
        
        expect(store).toHaveBeenCalledTimes(1);
        expect(store).toHaveBeenNthCalledWith(1, mockedRequest.body);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, `Trade ${mockedRequest.body.id} store completed!`);
    });
});
