import { createMock } from 'ts-auto-mock';
import IPFSDriver from '../../drivers/IPFSDriver.interface';
import JsonStandardService from './JsonStandardService';
import TransformationEvent from '../../entities/standard/TransformationEvent';
import { StandardEventStrategy } from '../../strategies/standard/StandardEventStrategy.interface';

describe('JsonStandardService', () => {
    let mockedIPFSDriver;
    let mockedStandardEventStrategy;
    let jsonStandardService: JsonStandardService<TransformationEvent>;

    const ipfsHash = 'ipfsHash';
    const oldIpfsHash = 'old_ipfsHash';

    const transformationEvent = new TransformationEvent(
        [],
        [],
        [{ productClass: 'materialIn1', quantity: '', uom: '' }],
        [{ productClass: 'materialOut1', quantity: '', uom: '' }],
        '',
        '2020-07-10 15:00:00.000',
        '',
        '',
        'processType1',
        '',
        '',
        [{
            referenceStandard: 'processingStandard1',
            certificateID: '',
            evidenceURL: '',
            assessmentLevel: '',
            criteriaList: [],
            responsibleAgency: { partyID: '', name: '' },
        }],
    );

    const mockedStoreIPFSDriver = jest.fn().mockResolvedValue(ipfsHash);
    const mockedDeleteIPFSDriver = jest.fn();
    const mockedStoreStrategy = jest.fn();
    const mockedUpdateStrategy = jest.fn().mockResolvedValue(oldIpfsHash);

    beforeAll(() => {
        mockedIPFSDriver = createMock<IPFSDriver>({
            store: mockedStoreIPFSDriver,
            delete: mockedDeleteIPFSDriver,
        });
        mockedStandardEventStrategy = createMock<StandardEventStrategy<TransformationEvent>>({
            store: mockedStoreStrategy,
            update: mockedUpdateStrategy,
        });

        jsonStandardService = new JsonStandardService<TransformationEvent>(
            mockedIPFSDriver,
            mockedStandardEventStrategy,
        );
    });

    it('store without ipfsHash passed from outside', async () => {
        await jsonStandardService.store(transformationEvent);

        expect(mockedStoreIPFSDriver).toHaveBeenCalledTimes(1);
        expect(mockedStoreIPFSDriver).toHaveBeenNthCalledWith(1, JSON.stringify(transformationEvent));

        expect(mockedStoreStrategy).toHaveBeenCalledTimes(1);
        expect(mockedStoreStrategy).toHaveBeenNthCalledWith(1, transformationEvent, ipfsHash, undefined, undefined);
    });

    it('store with also ipfsHash as parameter (same behaviour also with externalId and extDataIpfsHash parameters)', async () => {
        await jsonStandardService.store(transformationEvent, `${ipfsHash}_external`, 'externalId');

        expect(mockedStoreStrategy).toHaveBeenCalledTimes(1);
        expect(mockedStoreStrategy).toHaveBeenNthCalledWith(1, transformationEvent, `${ipfsHash}_external`, 'externalId', undefined);
    });

    it('update', async () => {
        await jsonStandardService.update(transformationEvent, 'eventID');

        expect(mockedStoreIPFSDriver).toHaveBeenCalledTimes(1);
        expect(mockedStoreIPFSDriver).toHaveBeenNthCalledWith(1, JSON.stringify(transformationEvent));

        expect(mockedUpdateStrategy).toHaveBeenCalledTimes(1);
        expect(mockedUpdateStrategy).toHaveBeenNthCalledWith(1, transformationEvent, 'eventID', ipfsHash);

        expect(mockedDeleteIPFSDriver).toHaveBeenCalledTimes(1);
        expect(mockedDeleteIPFSDriver).toHaveBeenNthCalledWith(1, oldIpfsHash);
    });
});
