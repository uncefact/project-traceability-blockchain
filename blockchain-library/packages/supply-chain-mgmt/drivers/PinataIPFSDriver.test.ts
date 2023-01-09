import { createMock } from 'ts-auto-mock';
import pinataSDK, { PinataClient } from '@pinata/sdk';
import fetch, { Response } from 'node-fetch';
import PinataIPFSDriver from './PinataIPFSDriver';
import TransformationEvent from '../entities/standard/TransformationEvent';

jest.mock('@pinata/sdk');
jest.mock('node-fetch');
jest.mock('nanoid', () => ({
    nanoid: jest.fn().mockReturnValue('uuid-test'),
}));

describe('PinataIPFSDriver', () => {
    let pinataIPFSDriver: PinataIPFSDriver<TransformationEvent>;
    const mockedTansformationEvent = new TransformationEvent(
        [],
        [],
        [],
        [],
        '',
        '10-10-2022',
        '',
        '',
        '',
        '',
        '',
        [],
    );

    const mockedTransformationJsonStringObject = JSON.stringify({
        eventTime: mockedTansformationEvent.eventTime,
    });

    const mockedPinataClient: PinataClient = createMock<PinataClient>({
        pinJSONToIPFS: jest.fn().mockResolvedValue({ IpfsHash: 'ipfsHash' }),
        unpin: jest.fn().mockReturnValue(Promise.resolve()),
    });

    const mockedPinataSDK = jest.mocked(pinataSDK, true);
    mockedPinataSDK.mockReturnValue(mockedPinataClient);

    const mockedFetch = jest.mocked(fetch, true);
    const ipfsHash = 'cid_ipfsHash';

    beforeAll(() => {
        pinataIPFSDriver = new PinataIPFSDriver<TransformationEvent>(
            'apiKeyTest',
            'secretApiKey',
        );
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should correctly store of ipfs', async () => {
        const response = await pinataIPFSDriver.store(JSON.stringify(mockedTansformationEvent));
        expect(mockedPinataClient.pinJSONToIPFS).toHaveBeenCalledTimes(1);
        expect(response).toEqual('ipfsHash');
    });

    it('should retrieve the content from ipfs', async () => {
        mockedFetch.mockResolvedValue({ json: () => Promise.resolve(mockedTransformationJsonStringObject), ok: true } as Response);
        const response = await pinataIPFSDriver.retrieve(ipfsHash);

        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(mockedFetch).toHaveBeenNthCalledWith(1, `https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        expect(response).toEqual(mockedTransformationJsonStringObject);
    });

    it('should delete the ipfs file stored', async () => {
        await pinataIPFSDriver.delete(ipfsHash);

        expect(mockedPinataClient.unpin).toHaveBeenCalledTimes(1);
        expect(mockedPinataClient.unpin).toHaveBeenNthCalledWith(1, ipfsHash);
    });
});
