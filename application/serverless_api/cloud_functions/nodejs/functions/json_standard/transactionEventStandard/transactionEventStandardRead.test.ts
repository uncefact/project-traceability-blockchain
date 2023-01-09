import { Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../../utils/utils";
import { mocked } from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../../utils/mysqlUtils";
import { buildTransactionStandardService } from '../../../utils/blockchainUtils';
import { transactionEventStandardRead } from './transactionEventStandardRead';
import { TransactionEvent, TransactionEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';


jest.mock('../../../utils/utils', () => {
    return {
        getUsernameByRequest: jest.fn(),
        validateRequest: jest.fn()
    }
});

jest.mock('../../../utils/mysqlUtils', () => {
    return {
        getWalletPrivateKeyByUsername: jest.fn()
    }
});

jest.mock('../../../utils/blockchainUtils', () => {
    return {
        buildTransactionStandardService: jest.fn()
    }
});

describe('transactionEventStandardRead', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetJsonStandardService = mocked(buildTransactionStandardService, true);


    it('should read information inside the ipfs, taken by a transactionEvent', async () => {
        const mockedTrasactionEvent = {
            "eventTime": "eventTime"
        } as TransactionEvent

        const mockedSend = jest.fn();
        const read = jest.fn().mockResolvedValue(mockedTrasactionEvent);
        const privateKey = "privateKeyTest";
        const username = "usernameTest";

        const mockedRequest = createMock<Request>({
            query: {
                eventID: "event_uuid"
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });


        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetJsonStandardService.mockReturnValue(Promise.resolve({ read }));

        const mockedDeserialize = jest.spyOn(TransactionEventJsonStandardSerializer.prototype, 'deserialize');
        mockedDeserialize.mockReturnValue(mockedRequest.body);
        await transactionEventStandardRead(mockedRequest, mockedResponse);

        expect(validateRequest).toHaveBeenCalledTimes(1);
        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.query, ["eventID"]);
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetJsonStandardService).toHaveBeenCalledTimes(1);
        expect(MockedGetJsonStandardService).toHaveBeenNthCalledWith(1, privateKey);

        expect(read).toHaveBeenCalledTimes(1);
        expect(read).toHaveBeenNthCalledWith(1, mockedRequest.query.eventID);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, mockedTrasactionEvent);
    });
});
