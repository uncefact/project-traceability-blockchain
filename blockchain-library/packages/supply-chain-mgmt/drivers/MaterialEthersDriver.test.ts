/* eslint-disable camelcase */
import { UrlJsonRpcProvider } from '@ethersproject/providers';
import { createMock } from 'ts-auto-mock';
import EthCrypto from 'eth-crypto';
import MaterialEthersDriver from './MaterialEthersDriver';
import IdentityEthersDriver from './IdentityEthersDriver';
import { UneceCottonTracking, UneceCottonTracking__factory } from '../smart-contracts';
import EntitySerializer from '../serializers/EntitySerializer.interface';
import SymmetricEncryptor from '../crypto/SymmetricEncryptor';
import SymmetricKey from '../crypto/SymmetricKey';
import AsymmetricEncryptor from '../crypto/AsymmetricEncryptor';
import Material from '../entities/Material';

jest.mock('nanoid', () => ({
    nanoid: jest.fn().mockReturnValue('uuid-test'),
}));

describe('MaterialEthersDriver', () => {
    let materialEthersDriver: MaterialEthersDriver;

    let mockedIdentityDriver: IdentityEthersDriver;
    let mockedSerializer: EntitySerializer<Material>;
    let mockedProvider: UrlJsonRpcProvider;

    const testPrivateKey = '0x77d28989707ad7554ab15e1c35859340585e6f786ea05ac0247c1b8b2688c2cc';
    const testPublicKey = EthCrypto.publicKeyByPrivateKey(testPrivateKey);
    const testAddress = EthCrypto.publicKey.toAddress(testPublicKey);
    const testSymmetricKey = new SymmetricKey();

    const mockedContractConnect = jest.fn();

    const mockedWait = jest.fn();
    const mockedStoreMaterial = jest.fn();
    const mockedUpdateMaterial = jest.fn();
    const mockedGetMaterialsIndexes = jest.fn();
    const mockedStoreMaterialIndex = jest.fn();
    const mockedGetMaterial = jest.fn();

    const mockedSerialize = jest.fn();
    const mockedDeserialize = jest.fn();

    let generateSymmetricKeySpy: jest.SpyInstance;

    beforeAll(() => {
        mockedStoreMaterial.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedUpdateMaterial.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedStoreMaterialIndex.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedContractConnect.mockReturnValue({
            storeMaterial: mockedStoreMaterial,
            updateMaterial: mockedUpdateMaterial,
            getMaterialsIndexes: mockedGetMaterialsIndexes,
            storeMaterialIndex: mockedStoreMaterialIndex,
            getMaterial: mockedGetMaterial,
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
        mockedSerializer = createMock<EntitySerializer<Material>>({
            serialize: mockedSerialize,
            deserialize: mockedDeserialize,
        });
        mockedProvider = createMock<UrlJsonRpcProvider>({
            _isProvider: true,
        });

        materialEthersDriver = new MaterialEthersDriver(
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

    it('should correctly store a material using contract methods', async () => {
        const material = new Material('material 1', [], 'http://test.source.url', 'mat1', 'testOwnerAddress');

        mockedSerialize.mockReturnValue('serializedMaterial');

        const testEncryptedMaterial = SymmetricEncryptor.encrypt(
            testSymmetricKey,
            'serializedMaterial',
        );

        const response = await materialEthersDriver.store(material);

        expect(response).toEqual(testSymmetricKey);
        expect(mockedSerialize).toHaveBeenCalledTimes(1);
        expect(mockedSerialize).toHaveBeenNthCalledWith(1, material);

        expect(mockedStoreMaterial).toHaveBeenCalledTimes(1);
        expect(mockedStoreMaterial).toHaveBeenNthCalledWith(
            1,
            material.id,
            'testOwnerAddress',
            testEncryptedMaterial,
        );
        expect(mockedWait).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when smart contract store material fails', async () => {
        const material = new Material('material 1', [], 'http://test.source.url', 'mat1', 'testOwnerAddress');

        mockedSerialize.mockReturnValue('serializedMaterial');

        mockedWait.mockRejectedValue(new Error());

        const storeFn = () => materialEthersDriver.store(material);

        expect(storeFn).rejects.toThrowError(new Error('Error while creating material: Error'));
    });

    it('should correctly update a material using contract methods', async () => {
        const material = new Material('material 1', [], 'http://test.source.url', 'mat1', 'testOwnerAddress');

        const materialIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'mat1')),
            },
        ];
        mockedGetMaterialsIndexes.mockResolvedValue(materialIndexes);

        mockedSerialize.mockReturnValue('serializedMaterial');

        const testEncryptedMaterial = SymmetricEncryptor.encrypt(
            testSymmetricKey,
            'serializedMaterial',
        );

        mockedWait.mockResolvedValue('test');

        await materialEthersDriver.update(material);

        expect(mockedSerialize).toHaveBeenCalledTimes(1);
        expect(mockedSerialize).toHaveBeenNthCalledWith(1, material);

        expect(mockedUpdateMaterial).toHaveBeenCalledTimes(1);
        expect(mockedUpdateMaterial).toHaveBeenNthCalledWith(
            1,
            'mat1',
            testEncryptedMaterial,
        );
        expect(mockedWait).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when smart contract update material fails', async () => {
        const material = new Material('material 1', [], 'http://test.source.url', 'mat1', 'testOwnerAddress');

        const materialIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'mat2')),
            },
        ];
        mockedGetMaterialsIndexes.mockResolvedValue(materialIndexes);

        mockedSerialize.mockReturnValue('serializedMaterial');

        const updateFn = () => materialEthersDriver.update(material);
        expect(updateFn).rejects.toThrowError(new Error('Error while updating material: Error: Material with id mat1 not found'));
    });

    it('should store a new index for material using adapter', async () => {
        const material = new Material('material 1', [], 'http://test.source.url', 'mat1', 'testOwnerAddress');

        const materialIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'mat1')),
            },
        ];
        mockedGetMaterialsIndexes.mockResolvedValue(materialIndexes);

        await materialEthersDriver.allowRead(
            material.id,
        );

        expect(mockedStoreMaterialIndex).toBeCalledTimes(1);
        expect(mockedStoreMaterialIndex).toHaveBeenNthCalledWith(
            1,
            testAddress,
            expect.any(String),
            expect.any(String),
        );

        const obtainedEncryptedSymmetricKey = mockedStoreMaterialIndex.mock.calls[0][1];
        const obtainedEncryptedDataIndex = mockedStoreMaterialIndex.mock.calls[0][2];

        const obtainedSymmetricKey = await AsymmetricEncryptor.decrypt(testPrivateKey, JSON.parse(obtainedEncryptedSymmetricKey));
        const obtainedDataIndex = await AsymmetricEncryptor.decrypt(testPrivateKey, JSON.parse(obtainedEncryptedDataIndex));

        expect(testSymmetricKey.toJson()).toEqual(obtainedSymmetricKey);
        expect(String(material.id)).toEqual(obtainedDataIndex);
    });

    it('should throw an error when smart contract storeMaterialIndex fails', async () => {
        const material = new Material('material 1', [], 'http://test.source.url', 'mat1', 'testOwnerAddress');

        const materialIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'mat2')),
            },
        ];
        mockedGetMaterialsIndexes.mockResolvedValue(materialIndexes);
        mockedStoreMaterialIndex.mockRejectedValue(new Error());

        mockedSerialize.mockReturnValue('serializedMaterial');

        const allowReadFn = () => materialEthersDriver.allowRead(
            material.id,
            testPublicKey,
            testAddress,
            testSymmetricKey,
        );
        expect(allowReadFn).rejects.toThrowError(new Error('Error while adding new reader: Error'));
    });

    it('should retrieve the list of materials using using contract methods', async () => {
        const material1 = new Material('material 1', [], 'http://test.source.url', 'mat1', 'testOwnerAddress');
        const material2 = new Material('material 2', [], 'http://test.source.url', 'mat2', 'testOwnerAddress2');

        const materialIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(42))),
            },
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(43))),
            },
        ];
        mockedGetMaterialsIndexes.mockReturnValue(materialIndexes);

        mockedDeserialize.mockReturnValueOnce(material1);
        mockedDeserialize.mockReturnValueOnce(material2);

        const encyptedMaterial1 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'foo'),
        };
        const encyptedMaterial2 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'bar'),
        };
        mockedGetMaterial.mockReturnValueOnce(encyptedMaterial1);
        mockedGetMaterial.mockReturnValueOnce(encyptedMaterial2);

        const retrievedTrade = await materialEthersDriver.retrieveAll();

        expect(retrievedTrade).toEqual([material1, material2]);
    });

    it('should retrieve an empty list of materials using using contract methods', async () => {
        mockedGetMaterialsIndexes.mockReturnValue([]);

        const retrievedTrade = await materialEthersDriver.retrieveAll();

        expect(retrievedTrade).toEqual([]);
    });

    it('should throw an error when smart contract getMaterialsIndexes fails', async () => {
        mockedGetMaterialsIndexes.mockRejectedValue(new Error());

        mockedSerialize.mockReturnValue('serializedMaterial');

        const retrieveAllFn = () => materialEthersDriver.retrieveAll();
        expect(retrieveAllFn).rejects.toThrowError(new Error('Error while retrieving materials: Error'));
    });

    it('should retrieve a material using using contract methods', async () => {
        const material1 = new Material('material 1', [], 'http://test.source.url', 'mat1', 'testOwnerAddress');
        const material2 = new Material('material 2', [], 'http://test.source.url', 'mat2', 'testOwnerAddress2');

        const materialIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(42))),
            },
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(43))),
            },
        ];
        mockedGetMaterialsIndexes.mockReturnValue(materialIndexes);

        mockedDeserialize.mockReturnValueOnce(material1);
        mockedDeserialize.mockReturnValueOnce(material2);

        const encyptedMaterial1 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'foo'),
        };
        const encyptedMaterial2 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'bar'),
        };
        mockedGetMaterial.mockReturnValueOnce(encyptedMaterial1);
        mockedGetMaterial.mockReturnValueOnce(encyptedMaterial2);

        const retrievedTrade = await materialEthersDriver.retrieve('mat1');

        expect(retrievedTrade).toEqual(material1);
    });

    it('should throw an error when resource is not found', async () => {
        mockedGetMaterialsIndexes.mockResolvedValue([]);

        const retrieveFn = () => materialEthersDriver.retrieve('mat42');
        expect(retrieveFn).rejects.toThrowError(new Error('Error while retrieving material'));
    });

    it('should throw an error when retrieveAll fails', async () => {
        mockedGetMaterialsIndexes.mockRejectedValue(new Error());

        const retrieveFn = () => materialEthersDriver.retrieve('mat42');
        expect(retrieveFn).rejects.toThrowError(new Error('Error while retrieving material'));
    });
});
