import { createMock } from 'ts-auto-mock';
import IdentityEthersDriver from '../../drivers/IdentityEthersDriver';
import MaterialEthersDriver from '../../drivers/MaterialEthersDriver';
import TransformationEthersDriver from '../../drivers/TransformationEthersDriver';
import Material from '../../entities/Material';
import TransformationEvent from '../../entities/standard/TransformationEvent';
import Transformation from '../../entities/Transformation';
import { TransformationEventStrategy } from './TransformationEventStrategy';

describe('TransformationEventStrategy', () => {
    let mockedIdentityDriver;
    let mockedMaterialEthersDriver;
    let mockedTransformationEthersDriver;
    let transformationEventStrategy: TransformationEventStrategy;

    const ipfsHash = 'ipfsHash';
    const simmetrickey = 'simmetrickey';
    const identityDriverPublicKey = 'publicKey';
    const identityDriverAddress = 'address';

    const transformationEvent = new TransformationEvent(
        [],
        [],
        [{ productClass: 'materialIn1', quantity: '', uom: '' }, { productClass: 'materialIn2', quantity: '', uom: '' }],
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
    const oldMaterials = [
        new Material('mat name1', [], ipfsHash, 'mat10', 'owner'),
        new Material('mat name 2', [], ipfsHash, 'mat2', 'owner'),
    ];

    // force material store driver to get back 1 id, in order to not throw exception
    const mockedStoreMaterialDriver = jest.fn().mockResolvedValue(simmetrickey);
    const mockedUpdateMaterialDriver = jest.fn();
    const mockedRetrieveAllMaterialDriver = jest.fn().mockResolvedValue(oldMaterials);
    const mockedAllowReadMaterialDriver = jest.fn();
    const mockedStoreTransformationDriver = jest.fn().mockResolvedValue(simmetrickey);
    const mockedAllowReadTransformationDriver = jest.fn();
    const mockedUpdateTransformationDriver = jest.fn();
    const mockedRetrieveByExternalEventId = jest.fn().mockResolvedValue({ sourceUrl: ipfsHash });

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
        mockedTransformationEthersDriver = createMock<TransformationEthersDriver>({
            store: mockedStoreTransformationDriver,
            allowRead: mockedAllowReadTransformationDriver,
            update: mockedUpdateTransformationDriver,
            retrieveByExternalEventId: mockedRetrieveByExternalEventId,
        });
        transformationEventStrategy = new TransformationEventStrategy(
            mockedIdentityDriver,
            mockedMaterialEthersDriver,
            mockedTransformationEthersDriver,
        );

        // jest.spyOn(transformationEventStrategy, 'extractMaterialsFromEvent').mockReturnValue([...inputMaterials, outputMaterial]);
        // jest.spyOn(transformationEventStrategy, 'extractTransformationFromEvent').mockReturnValue(transformation);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should store TransformationEvent object', async () => {
        await transformationEventStrategy.store(transformationEvent, ipfsHash);

        const expectedFirstInputMaterial = new Material('materialIn1', [], ipfsHash);
        const expectedSecondInputMaterial = new Material('materialIn2', [], ipfsHash);
        const expectedOutputMaterial = new Material('materialOut1', [], ipfsHash);

        expect(mockedStoreMaterialDriver).toHaveBeenCalledTimes(3);
        expect(mockedStoreMaterialDriver).toHaveBeenNthCalledWith(1, expectedFirstInputMaterial);
        expect(mockedStoreMaterialDriver).toHaveBeenNthCalledWith(2, expectedSecondInputMaterial);
        expect(mockedStoreMaterialDriver).toHaveBeenNthCalledWith(3, expectedOutputMaterial);
        expect(mockedAllowReadMaterialDriver).toHaveBeenCalledTimes(3);
        expect(mockedAllowReadMaterialDriver).toHaveBeenNthCalledWith(
            1,
            expectedFirstInputMaterial.id,
            identityDriverPublicKey,
            identityDriverAddress,
            simmetrickey,
        );
        expect(mockedAllowReadMaterialDriver).toHaveBeenNthCalledWith(
            2,
            expectedSecondInputMaterial.id,
            identityDriverPublicKey,
            identityDriverAddress,
            simmetrickey,
        );
        expect(mockedAllowReadMaterialDriver).toHaveBeenNthCalledWith(
            3,
            expectedOutputMaterial.id,
            identityDriverPublicKey,
            identityDriverAddress,
            simmetrickey,
        );

        const expectedTrasformation = new Transformation(
            [expectedFirstInputMaterial.id || '', expectedSecondInputMaterial.id || ''],
            expectedOutputMaterial.id || '',
            '',
            new Date(transformationEvent.eventTime),
            new Date(transformationEvent.eventTime),
            [transformationEvent.businessStepCode],
            transformationEvent.certifications.map((c) => c.referenceStandard),
            ipfsHash,
        );

        expect(mockedStoreTransformationDriver).toHaveBeenCalledTimes(1);
        expect(mockedStoreTransformationDriver).toHaveBeenNthCalledWith(1, expectedTrasformation);
        expect(mockedAllowReadTransformationDriver).toHaveBeenCalledTimes(1);
        expect(mockedAllowReadTransformationDriver).toHaveBeenNthCalledWith(
            1,
            expectedTrasformation.id,
            identityDriverPublicKey,
            identityDriverAddress,
            simmetrickey,
        );
    });

    it('should update TransformationEvent object', async () => {
        const expectedMaterialAlreadyExist1 = new Material('materialIn1', [], ipfsHash, 'matIn1', 'owner1');
        const expectedMaterialAlreadyExist2 = new Material('materialIn2', [], ipfsHash, 'matIn2', 'owner1');
        const expectedMaterialAlreadyExist3 = new Material('materialOut1', [], ipfsHash, 'matOut1', 'owner1');
        mockedRetrieveAllMaterialDriver.mockResolvedValue([expectedMaterialAlreadyExist1, expectedMaterialAlreadyExist2, expectedMaterialAlreadyExist3]);
        mockedRetrieveByExternalEventId.mockResolvedValue(new Transformation(
            ['matIn1', 'matIn70'],
            'matOut97',
            '',
            new Date(transformationEvent.eventTime),
            new Date(transformationEvent.eventTime),
            [transformationEvent.businessStepCode],
            transformationEvent.certifications.map((c) => c.referenceStandard),
            ipfsHash,
            'trans36',
            'owner1',
        ));
        await transformationEventStrategy.update(transformationEvent, 'eventID', ipfsHash);

        expect(mockedRetrieveAllMaterialDriver).toHaveBeenCalledTimes(2);
        expect(mockedRetrieveByExternalEventId).toHaveBeenCalledTimes(1);
        expect(mockedRetrieveByExternalEventId).toHaveBeenNthCalledWith(1, 'eventID');

        expect(mockedUpdateMaterialDriver).toHaveBeenCalledTimes(3);

        expect(mockedUpdateMaterialDriver).toHaveBeenNthCalledWith(1, expectedMaterialAlreadyExist1);
        expect(mockedUpdateMaterialDriver).toHaveBeenNthCalledWith(2, expectedMaterialAlreadyExist2);
        expect(mockedUpdateMaterialDriver).toHaveBeenNthCalledWith(3, expectedMaterialAlreadyExist3);

        expect(mockedUpdateTransformationDriver).toHaveBeenCalledTimes(1);

        const expectedTrasformation = new Transformation(
            ['matIn1', 'matIn2'],
            'matOut1',
            '',
            new Date(transformationEvent.eventTime),
            new Date(transformationEvent.eventTime),
            [transformationEvent.businessStepCode],
            transformationEvent.certifications.map((c) => c.referenceStandard),
            ipfsHash,
            'trans36',
            'owner1',
        );
        expect(mockedUpdateTransformationDriver).toHaveBeenNthCalledWith(1, expectedTrasformation);
    });

    it('should read from ipfs storage', async () => {
        const response = await transformationEventStrategy.readSourceURL('eventID');

        expect(mockedRetrieveByExternalEventId).toHaveBeenCalledTimes(1);
        expect(mockedRetrieveByExternalEventId).toHaveBeenNthCalledWith(1, 'eventID');
        expect(response).toEqual(ipfsHash);
    });
});
