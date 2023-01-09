import { Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getUsernameByRequest, validateRequest } from "../../../utils/utils";
import { mocked } from "ts-jest/utils";
import { getWalletPrivateKeyByUsername } from "../../../utils/mysqlUtils";
import { buildTransformationStandardService } from '../../../utils/blockchainUtils';
import { transformationEventStandardStore } from './transformationEventStandardStore';
import { TransformationEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';


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

describe('transformationEventStandardStore', () => {
    const MockedGetUsernameByRequest = mocked(getUsernameByRequest, true);
    const MockedGetWalletPrivateKeyByUsername = mocked(getWalletPrivateKeyByUsername, true);
    const MockedGetJsonStandardService = mocked(buildTransformationStandardService, true);


    it('should store information taken by a transformationEvent', async () => {
        const returnedEventID = "eventID";
        const mockedSend = jest.fn();
        const store = jest.fn().mockResolvedValue(returnedEventID);
        const privateKey = "privateKeyTest";
        const username = "usernameTest";

        const mockedRequest = createMock<Request>({
            body: {
                inputQuantityList: [{ "productClass": "inputProdClass" }],
                outputQuantityList: [{ "productClass": "outputProdClass" }],
                eventTime: "time",
                businessStepCode: "code",
                certifications: [{
                    "referenceStandard": "refstandardTest"
                }]
            }
        });
        const mockedResponse = createMock<Response>({
            send: mockedSend
        });


        MockedGetUsernameByRequest.mockReturnValue(username);
        MockedGetWalletPrivateKeyByUsername.mockReturnValue(Promise.resolve(privateKey));
        // @ts-ignore
        MockedGetJsonStandardService.mockReturnValue(Promise.resolve({ store: store }));

        const mockedDeserialize = jest.spyOn(TransformationEventJsonStandardSerializer.prototype, 'deserialize');
        mockedDeserialize.mockReturnValue(mockedRequest.body);
        await transformationEventStandardStore(mockedRequest, mockedResponse);

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
        expect(mockedResponse.send).toHaveBeenNthCalledWith(1, returnedEventID);
    });
});
