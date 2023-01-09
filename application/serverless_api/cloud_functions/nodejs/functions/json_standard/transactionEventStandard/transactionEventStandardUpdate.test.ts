import { Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../../utils/utils";
import { mocked } from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../../utils/mysqlUtils";
import { buildTransactionStandardService } from '../../../utils/blockchainUtils';
import { TransactionEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { transactionEventStandardUpdate } from './transactionEventStandardUpdate';


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

describe('transactionEventStandardUpdate', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetJsonStandardService = mocked(buildTransactionStandardService, true);


    it('should update information taken by a transactionEvent', async () => {
        const mockedSend = jest.fn();
        const update = jest.fn();
        const privateKey = "privateKeyTest";
        const username = "usernameTest";

        const mockedRequest = createMock<Request>({
            body: {
                quantityList: [{ "productClass": "inputProdClass" }],
                destinationParty: {partyID: "companyID", name: "dest name"},
                eventTime: "time",
                businessStepCode: "code",
                certifications: [{
                    "referenceStandard": "refstandardTest"
                }]
            },
            query: {
                eventID: 'eventID_test'
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });


        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetJsonStandardService.mockReturnValue(Promise.resolve({ update: update }));

        const mockedDeserialize = jest.spyOn(TransactionEventJsonStandardSerializer.prototype, 'deserialize');
        mockedDeserialize.mockReturnValue(mockedRequest.body);
        await transactionEventStandardUpdate(mockedRequest, mockedResponse);

        expect(validateRequest).toHaveBeenCalledTimes(2);
        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.body, Object.keys(mockedRequest.body));
        expect(validateRequest).toHaveBeenNthCalledWith(2, mockedRequest.query, Object.keys(mockedRequest.query));
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetJsonStandardService).toHaveBeenCalledTimes(1);
        expect(MockedGetJsonStandardService).toHaveBeenNthCalledWith(1, privateKey);

        expect(update).toHaveBeenCalledTimes(1);
        expect(update).toHaveBeenNthCalledWith(1, mockedRequest.body, mockedRequest.query.eventID);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, `Information inside transactionEvent are successfully updated!`);
    });
});
