import { Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../../utils/utils";
import { mocked } from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../../utils/mysqlUtils";
import { buildObjectEventStandardService } from '../../../utils/blockchainUtils';
import { objectEventStandardStore } from './objectEventStandardStore';
import { ObjectEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';


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
        buildObjectEventStandardService: jest.fn()
    }
});

describe('transformationEventStandardStore', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetJsonStandardService = mocked(buildObjectEventStandardService, true);


    it('should store information taken by a transformationEvent', async () => {
        const mockedSend = jest.fn();
        const store = jest.fn().mockResolvedValue("eventID");
        const privateKey = "privateKeyTest";
        const username = "usernameTest";

        const mockedRequest = createMock<Request>({
            body: {
                itemList: [
                    {
                    itemID: "http://example.com",
                    name: "item"
                    }
                ],
                quantityList: [
                    {
                    productClass: "string",
                    quantity: "string",
                    uom: "string"
                    }
                ],
                eventTime: "string",
                businessStepCode: "commissioning",
                certifications: [
                    {
                    certificateID: "certificateID",
                    referenceStandard: "referenceStd",
                    evidenceURL: "http://example.com",
                    criteriaList: [
                        "criteria1"
                    ],
                    assessmentLevel: "self-assessed",
                    responsibleAgency: {
                        partyID: "http://example.com",
                        name: "string"
                    }
                    }
                ]
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });


        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetJsonStandardService.mockReturnValue(Promise.resolve({ store: store }));

        const mockedDeserialize = jest.spyOn(ObjectEventJsonStandardSerializer.prototype, 'deserialize');
        mockedDeserialize.mockReturnValue(mockedRequest.body);
        await objectEventStandardStore(mockedRequest, mockedResponse);

        expect(validateRequest).toHaveBeenCalledTimes(1);
        expect(validateRequest).toHaveBeenNthCalledWith(1, mockedRequest.body, Object.keys(mockedRequest.body));
        expect(MockedGetUsernameByRequest).toHaveBeenCalledTimes(1);
        expect(MockedGetUsernameByRequest).toHaveBeenNthCalledWith(1, mockedRequest, mockedResponse);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenCalledTimes(1);
        expect(MockedGetWalletPrivateKeyByUsername).toHaveBeenNthCalledWith(1, username)
        expect(MockedGetJsonStandardService).toHaveBeenCalledTimes(1);
        expect(MockedGetJsonStandardService).toHaveBeenNthCalledWith(1, privateKey);

        expect(store).toHaveBeenCalledTimes(1);
        expect(store).toHaveBeenNthCalledWith(1, mockedRequest.body);
        expect(mockedResponse.send).toHaveBeenCalledTimes(1);
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, 'eventID');
    });
});
