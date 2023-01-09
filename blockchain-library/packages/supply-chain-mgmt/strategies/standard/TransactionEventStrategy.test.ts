import { createMock } from 'ts-auto-mock';
import IdentityEthersDriver from '../../drivers/IdentityEthersDriver';
import TradeEthersDriver from '../../drivers/TradeEthersDriver';
import TransactionEvent from '../../entities/standard/TransactionEvent';
import Material from '../../entities/Material';
import Trade from '../../entities/Trade';
import { TransactionEventStrategy } from './TransactionEventStrategy';
import MaterialEthersDriver from '../../drivers/MaterialEthersDriver';

describe('TransactionEventStandardStrategy', () => {
    let mockedIdentityDriver;
    let mockedMaterialEthersDriver;
    let mockedTradeEthersDriver;
    let transactionEventStandardStrategy: TransactionEventStrategy;

    const ipfsHash = 'ipfsHash';
    const simmetrickey = 'simmetrickey';
    const identityDriverPublicKey = 'publicKey';
    const identityDriverAddress = 'address';

    const oldMaterials = [
        new Material('mat name1', [], ipfsHash, 'mat10', 'owner'),
        new Material('mat name 2', [], ipfsHash, 'mat2', 'owner'),
    ];

    const transactionEvent = new TransactionEvent(
        { partyID: 'sourceID', name: 'agency name 1' },
        { partyID: 'destinationID', name: 'agency name 2' },
        [],
        [{ productClass: 'material1', quantity: '', uom: '' }, { productClass: 'material2', quantity: '', uom: '' }],
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
        { type: 'tr', identifier: 'idTrans', documentURL: 'url' },
    );

    const mockedStoreTradeDriver = jest.fn().mockResolvedValue(simmetrickey);
    const mockedStoreMaterialDriver = jest.fn().mockResolvedValue(simmetrickey);
    const mockedAllowReadTradeDriver = jest.fn();
    const mockedAllowReadMaterialDriver = jest.fn();
    const mockedRetrieveAllMaterialDriver = jest.fn().mockResolvedValue(oldMaterials);
    const mockedRetrieveByExternalEventId = jest.fn();
    const mockedUpdateMaterialDriver = jest.fn();
    const mockedUpdateTradeDriver = jest.fn();

    beforeAll(() => {
        mockedIdentityDriver = createMock<IdentityEthersDriver>({
            publicKey: identityDriverPublicKey,
            address: identityDriverAddress,
        });
        mockedMaterialEthersDriver = createMock<MaterialEthersDriver>({
            store: mockedStoreMaterialDriver,
            allowRead: mockedAllowReadMaterialDriver,
            retrieveAll: mockedRetrieveAllMaterialDriver,
            update: mockedUpdateMaterialDriver,
        });
        mockedTradeEthersDriver = createMock<TradeEthersDriver>({
            store: mockedStoreTradeDriver,
            allowRead: mockedAllowReadTradeDriver,
            retrieveByExternalEventId: mockedRetrieveByExternalEventId,
            update: mockedUpdateTradeDriver,
        });
        transactionEventStandardStrategy = new TransactionEventStrategy(
            mockedIdentityDriver,
            mockedMaterialEthersDriver,
            mockedTradeEthersDriver,
        );
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should store trades from TransactionEvent object', async () => {
        await transactionEventStandardStrategy.store(transactionEvent, ipfsHash);

        const expectedFirstMaterial = new Material(transactionEvent.quantityList[0].productClass, [], ipfsHash);
        const expectedSecondMaterial = new Material(transactionEvent.quantityList[1].productClass, [], ipfsHash);

        expect(mockedStoreMaterialDriver).toHaveBeenCalledTimes(2);
        expect(mockedStoreMaterialDriver).toHaveBeenNthCalledWith(1, expectedFirstMaterial);
        expect(mockedStoreMaterialDriver).toHaveBeenNthCalledWith(2, expectedSecondMaterial);
        expect(mockedAllowReadMaterialDriver).toHaveBeenCalledTimes(2);
        expect(mockedAllowReadMaterialDriver).toHaveBeenNthCalledWith(
            1,
            expectedFirstMaterial.id,
            identityDriverPublicKey,
            identityDriverAddress,
            simmetrickey,
        );
        expect(mockedAllowReadMaterialDriver).toHaveBeenNthCalledWith(
            2,
            expectedSecondMaterial.id,
            identityDriverPublicKey,
            identityDriverAddress,
            simmetrickey,
        );
        const expectNewTrade = new Trade(
            [[expectedFirstMaterial.id || '', expectedSecondMaterial.id || '']],
            '',
            [transactionEvent.businessStepCode],
            transactionEvent.certifications.map((c) => c.referenceStandard),
            transactionEvent.destinationParty.partyID,
            ipfsHash,
        );

        expect(mockedStoreTradeDriver).toHaveBeenCalledTimes(1);
        expect(mockedStoreTradeDriver).toHaveBeenNthCalledWith(1, expectNewTrade);
        expect(mockedAllowReadTradeDriver).toHaveBeenCalledTimes(1);
        expect(mockedAllowReadTradeDriver).toHaveBeenNthCalledWith(
            1,
            expectNewTrade.id,
            identityDriverPublicKey,
            identityDriverAddress,
            simmetrickey,
        );
    });

    it('should update TransactionEvent object', async () => {
        const expectedMaterialAlreadyExist1 = new Material('material1', [], ipfsHash, 'matIn1', 'owner1');
        const expectedMaterialAlreadyExist2 = new Material('material2', [], ipfsHash, 'matIn2', 'owner1');
        mockedRetrieveAllMaterialDriver.mockResolvedValue([expectedMaterialAlreadyExist1, expectedMaterialAlreadyExist2]);
        mockedRetrieveByExternalEventId.mockResolvedValue(new Trade(
            [['mat456', 'mat456'], ['mat789', 'mat789']],
            '',
            [transactionEvent.businessStepCode],
            transactionEvent.certifications.map((c) => c.referenceStandard),
            transactionEvent.destinationParty.partyID,
            ipfsHash,
        ));
        await transactionEventStandardStrategy.update(transactionEvent, 'eventID', ipfsHash);

        expect(mockedRetrieveAllMaterialDriver).toHaveBeenCalledTimes(1);
        expect(mockedRetrieveByExternalEventId).toHaveBeenCalledTimes(1);
        expect(mockedRetrieveByExternalEventId).toHaveBeenNthCalledWith(1, 'eventID');

        expect(mockedUpdateMaterialDriver).toHaveBeenCalledTimes(2);

        expect(mockedUpdateMaterialDriver).toHaveBeenNthCalledWith(1, expectedMaterialAlreadyExist1);
        expect(mockedUpdateMaterialDriver).toHaveBeenNthCalledWith(2, expectedMaterialAlreadyExist2);

        expect(mockedUpdateTradeDriver).toHaveBeenCalledTimes(1);

        const expectedTransaction = new Trade(
            [['matIn1', 'matIn1'], ['matIn2', 'matIn2']],
            '',
            [transactionEvent.businessStepCode],
            transactionEvent.certifications.map((c) => c.referenceStandard),
            transactionEvent.destinationParty.partyID,
            ipfsHash,
        );
        expect(mockedUpdateTradeDriver).toHaveBeenNthCalledWith(1, expectedTransaction);
    });

    it('should read from ipfs storage', async () => {
        const response = await transactionEventStandardStrategy.readSourceURL('eventID');

        expect(mockedRetrieveByExternalEventId).toHaveBeenCalledTimes(1);
        expect(mockedRetrieveByExternalEventId).toHaveBeenNthCalledWith(1, 'eventID');
        expect(response).toEqual(ipfsHash);
    });
});
