import { Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../../utils/utils";
import { mocked } from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../../utils/mysqlUtils";
import { buildTransformationStandardService } from '../../../utils/blockchainUtils';
import { transformationEventStandardRead } from './transformationEventStandardRead';
import { TransformationEvent, TransformationEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';


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
        buildTransformationStandardService: jest.fn()
    }
});

describe('transformationEventStandardRead', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetJsonStandardService = mocked(buildTransformationStandardService, true);


    it('should read information inside the ipfs, taken by a transformationEvent', async () => {
        const mockedTrasformationEvent = {
            "eventTime": "eventTime"
        } as TransformationEvent

        const mockedSend = jest.fn();
        const read = jest.fn().mockResolvedValue(mockedTrasformationEvent);
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

        const mockedDeserialize = jest.spyOn(TransformationEventJsonStandardSerializer.prototype, 'deserialize');
        mockedDeserialize.mockReturnValue(mockedRequest.body);
        await transformationEventStandardRead(mockedRequest, mockedResponse);

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
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, mockedTrasformationEvent);
    });
});
