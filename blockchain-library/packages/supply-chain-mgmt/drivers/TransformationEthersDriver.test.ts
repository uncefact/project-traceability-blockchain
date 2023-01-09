/* eslint-disable camelcase */
import { UrlJsonRpcProvider } from '@ethersproject/providers';
import { createMock } from 'ts-auto-mock';
import EthCrypto from 'eth-crypto';
import TransformationEthersDriver from './TransformationEthersDriver';
import IdentityEthersDriver from './IdentityEthersDriver';
import { UneceCottonTracking, UneceCottonTracking__factory } from '../smart-contracts';
import EntitySerializer from '../serializers/EntitySerializer.interface';
import SymmetricEncryptor from '../crypto/SymmetricEncryptor';
import SymmetricKey from '../crypto/SymmetricKey';
import AsymmetricEncryptor from '../crypto/AsymmetricEncryptor';
import Transformation from '../entities/Transformation';

jest.mock('nanoid', () => ({
    nanoid: jest.fn().mockReturnValue('uuid-test'),
}));

describe('TransformationEthersDriver', () => {
    let transformationEthersDriver: TransformationEthersDriver;

    let mockedIdentityDriver: IdentityEthersDriver;
    let mockedSerializer: EntitySerializer<Transformation>;
    let mockedProvider: UrlJsonRpcProvider;

    const testPrivateKey = '0x77d28989707ad7554ab15e1c35859340585e6f786ea05ac0247c1b8b2688c2cc';
    const testPublicKey = EthCrypto.publicKeyByPrivateKey(testPrivateKey);
    const testAddress = EthCrypto.publicKey.toAddress(testPublicKey);
    const testSymmetricKey = new SymmetricKey();
    const transformationStartDate: Date = new Date();
    const transformationEndDate: Date = new Date();

    const mockedContractConnect = jest.fn();

    const mockedWait = jest.fn();
    const mockedStoreTransformation = jest.fn();
    const mockedUpdateTransformation = jest.fn();
    const mockedGetTransformationsIndexes = jest.fn();
    const mockedStoreTransformationIndex = jest.fn();
    const mockedGetTransformation = jest.fn();

    const mockedSerialize = jest.fn();
    const mockedDeserialize = jest.fn();

    let generateSymmetricKeySpy: jest.SpyInstance;

    beforeAll(() => {
        mockedStoreTransformation.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedUpdateTransformation.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedStoreTransformationIndex.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedContractConnect.mockReturnValue({
            storeTransformation: mockedStoreTransformation,
            updateTransformation: mockedUpdateTransformation,
            getTransformationsIndexes: mockedGetTransformationsIndexes,
            storeTransformationIndex: mockedStoreTransformationIndex,
            getTransformation: mockedGetTransformation,
        });
        const mockedUneceCottonTracking = createMock<UneceCottonTracking>({
            connect: mockedContractConnect,
        });
        jest.spyOn(UneceCottonTracking__factory, 'connect').mockReturnValue(mockedUneceCottonTracking);

        mockedIdentityDriver = createMock<IdentityEthersDriver>({
            privateKey: testPrivateKey,
            publicKey: testPublicKey,
            address: testAddress,
        });
        mockedSerializer = createMock<EntitySerializer<Transformation>>({
            serialize: mockedSerialize,
            deserialize: mockedDeserialize,
        });
        mockedProvider = createMock<UrlJsonRpcProvider>({
            _isProvider: true,
        });

        transformationEthersDriver = new TransformationEthersDriver(
            mockedIdentityDriver,
            mockedSerializer,
            mockedProvider,
            testAddress,
        );

        generateSymmetricKeySpy = jest.spyOn(SymmetricEncryptor, 'generateSymmetricKey');
        generateSymmetricKeySpy.mockImplementation(() => testSymmetricKey);
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should correctly store a transformation using contract methods', async () => {
        const transformation = new Transformation(['matIn1'], 'matOut2', 'transformation 1', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1', 'testOwnerAddress');

        mockedSerialize.mockReturnValue('serializedTransformation');

        const testEncryptedTransformation = SymmetricEncryptor.encrypt(
            testSymmetricKey,
            'serializedTransformation',
        );

        const response = await transformationEthersDriver.store(transformation);

        expect(response).toEqual(testSymmetricKey);
        expect(mockedSerialize).toHaveBeenCalledTimes(1);
        expect(mockedSerialize).toHaveBeenNthCalledWith(1, transformation);

        expect(mockedStoreTransformation).toHaveBeenCalledTimes(1);
        expect(mockedStoreTransformation).toHaveBeenNthCalledWith(
            1,
            'trans1',
            'testOwnerAddress',
            ['matIn1'],
            'matOut2',
            testEncryptedTransformation,
        );
        expect(mockedWait).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when smart contract store transformation fails', async () => {
        const transformation = new Transformation(['matIn1'], 'matOut2', 'transformation 1', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1', 'testOwnerAddress');

        mockedSerialize.mockReturnValue('serializedTransformation');

        mockedWait.mockRejectedValue(new Error());

        const storeFn = () => transformationEthersDriver.store(transformation);

        expect(storeFn).rejects.toThrowError(new Error('Error while creating transformation: Error'));
    });

    it('should correctly update a transformation using contract methods', async () => {
        const transformation = new Transformation(['matIn1'], 'matOut2', 'transformation 1', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1', 'testOwnerAddress');

        const transformationIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'trans1')),
            },
        ];
        mockedGetTransformationsIndexes.mockResolvedValue(transformationIndexes);

        mockedSerialize.mockReturnValue('serializedTransformation');

        const testEncryptedTransformation = SymmetricEncryptor.encrypt(
            testSymmetricKey,
            'serializedTransformation',
        );

        mockedWait.mockResolvedValue('test');

        await transformationEthersDriver.update(transformation);

        expect(mockedSerialize).toHaveBeenCalledTimes(1);
        expect(mockedSerialize).toHaveBeenNthCalledWith(1, transformation);

        expect(mockedUpdateTransformation).toHaveBeenCalledTimes(1);
        expect(mockedUpdateTransformation).toHaveBeenNthCalledWith(
            1,
            'trans1',
            ['matIn1'],
            'matOut2',
            testEncryptedTransformation,
        );
        expect(mockedWait).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when smart contract update transformation fails', async () => {
        const transformation = new Transformation(['matIn1'], 'matOut2', 'transformation 1', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1', 'testOwnerAddress');

        const transformationIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(2))),
            },
        ];
        mockedGetTransformationsIndexes.mockResolvedValue(transformationIndexes);

        mockedSerialize.mockReturnValue('serializedTransformation');

        const updateFn = () => transformationEthersDriver.update(transformation);
        expect(updateFn).rejects.toThrowError(new Error('Error while updating transformation: Error: Transformation with id trans1 not found'));
    });

    it('should store a new index for transformation using adapter', async () => {
        const transformation = new Transformation(['matIn1'], 'matOut2', 'transformation 1', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1', 'testOwnerAddress');

        const transformationIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'trans1')),
            },
        ];
        mockedGetTransformationsIndexes.mockResolvedValue(transformationIndexes);

        await transformationEthersDriver.allowRead(
            transformation.id,
        );

        expect(mockedStoreTransformationIndex).toBeCalledTimes(1);
        expect(mockedStoreTransformationIndex).toHaveBeenNthCalledWith(
            1,
            testAddress,
            expect.any(String),
            expect.any(String),
        );

        const obtainedEncryptedSymmetricKey = mockedStoreTransformationIndex.mock.calls[0][1];
        const obtainedEncryptedDataIndex = mockedStoreTransformationIndex.mock.calls[0][2];

        const obtainedSymmetricKey = await AsymmetricEncryptor.decrypt(testPrivateKey, JSON.parse(obtainedEncryptedSymmetricKey));
        const obtainedDataIndex = await AsymmetricEncryptor.decrypt(testPrivateKey, JSON.parse(obtainedEncryptedDataIndex));

        expect(testSymmetricKey.toJson()).toEqual(obtainedSymmetricKey);
        expect(String(transformation.id)).toEqual(obtainedDataIndex);
    });

    it('should throw an error when smart contract storeTransformationIndex fails', async () => {
        const transformation = new Transformation(['matIn1'], 'matOut2', 'transformation 1', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1', 'testOwnerAddress');

        const transformationIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(2))),
            },
        ];
        mockedGetTransformationsIndexes.mockResolvedValue(transformationIndexes);
        mockedStoreTransformationIndex.mockRejectedValue(new Error());

        mockedSerialize.mockReturnValue('serializedTransformation');

        const allowReadFn = () => transformationEthersDriver.allowRead(
            transformation.id,
            testPublicKey,
            testAddress,
            testSymmetricKey,
        );
        expect(allowReadFn).rejects.toThrowError(new Error('Error while adding new reader'));
    });

    it('should retrieve the list of transformations using using contract methods', async () => {
        const transformation1 = new Transformation(['matIn1'], 'matOut2', 'transformation 1', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1', 'testOwnerAddress');
        const transformation2 = new Transformation(['matIn1'], 'matOut2', 'transformation 2', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans2', 'testOwnerAddres2');

        const transformationIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(42))),
            },
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(43))),
            },
        ];
        mockedGetTransformationsIndexes.mockReturnValue(transformationIndexes);

        mockedDeserialize.mockReturnValueOnce(transformation1);
        mockedDeserialize.mockReturnValueOnce(transformation2);

        const encyptedTransformation1 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'foo'),
        };
        const encyptedTransformation2 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'bar'),
        };
        mockedGetTransformation.mockReturnValueOnce(encyptedTransformation1);
        mockedGetTransformation.mockReturnValueOnce(encyptedTransformation2);

        const retrievedTransformation = await transformationEthersDriver.retrieveAll();

        expect(retrievedTransformation).toEqual([transformation1, transformation2]);
    });

    it('should retrieve an empty list of transformations using using contract methods', async () => {
        mockedGetTransformationsIndexes.mockReturnValue([]);

        const retrievedTransformation = await transformationEthersDriver.retrieveAll();

        expect(retrievedTransformation).toEqual([]);
    });

    it('should throw an error when smart contract getTransformationsIndexes fails', async () => {
        mockedGetTransformationsIndexes.mockRejectedValue(new Error());

        mockedSerialize.mockReturnValue('serializedTransformation');

        const retrieveAllFn = () => transformationEthersDriver.retrieveAll();
        expect(retrieveAllFn).rejects.toThrowError(new Error('Error while retrieving transformations: Error'));
    });

    it('should retrieve a transformation using using contract methods', async () => {
        const transformation1 = new Transformation(['matIn1'], 'matOut2', 'transformation 1', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans1', 'testOwnerAddress');
        const transformation2 = new Transformation(['matIn1'], 'matOut2', 'transformation 2', transformationStartDate, transformationEndDate, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans2', 'testOwnerAddres2');

        const transformationIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'trans1')),
            },
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'trans2')),
            },
        ];
        mockedGetTransformationsIndexes.mockReturnValue(transformationIndexes);

        mockedDeserialize.mockReturnValueOnce(transformation1);
        mockedDeserialize.mockReturnValueOnce(transformation2);

        const encyptedTransformation1 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'foo'),
        };
        const encyptedTransformation2 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'bar'),
        };
        mockedGetTransformation.mockReturnValueOnce(encyptedTransformation1);
        mockedGetTransformation.mockReturnValueOnce(encyptedTransformation2);

        const retrievedTransformation = await transformationEthersDriver.retrieve('trans1');

        expect(retrievedTransformation).toEqual(transformation1);
    });

    it('should throw an error when resource is not found', async () => {
        mockedGetTransformationsIndexes.mockResolvedValue([]);

        const retrieveFn = () => transformationEthersDriver.retrieve('trans42');
        expect(retrieveFn).rejects.toThrowError(new Error('Error while retrieving transformation'));
    });

    it('should throw an error when retrieveAll fails', async () => {
        mockedGetTransformationsIndexes.mockRejectedValue(new Error());

        const retrieveFn = () => transformationEthersDriver.retrieve('trans42');
        expect(retrieveFn).rejects.toThrowError(new Error('Error while retrieving transformation'));
    });
});
