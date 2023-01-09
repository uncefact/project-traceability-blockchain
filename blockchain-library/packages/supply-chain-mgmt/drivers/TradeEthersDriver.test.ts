/* eslint-disable camelcase */
import { UrlJsonRpcProvider } from '@ethersproject/providers';
import { createMock } from 'ts-auto-mock';
import EthCrypto from 'eth-crypto';
import TradeEthersDriver from './TradeEthersDriver';
import IdentityEthersDriver from './IdentityEthersDriver';
import { UneceCottonTracking, UneceCottonTracking__factory } from '../smart-contracts';
import EntitySerializer from '../serializers/EntitySerializer.interface';
import SymmetricEncryptor from '../crypto/SymmetricEncryptor';
import SymmetricKey from '../crypto/SymmetricKey';
import AsymmetricEncryptor from '../crypto/AsymmetricEncryptor';
import Trade from '../entities/Trade';

jest.mock('nanoid', () => ({
    nanoid: jest.fn().mockReturnValue('uuid-test'),
}));

describe('TradeEthersDriver', () => {
    let tradeEthersDriver: TradeEthersDriver;

    let mockedIdentityDriver: IdentityEthersDriver;
    let mockedSerializer: EntitySerializer<Trade>;
    let mockedProvider: UrlJsonRpcProvider;

    const testPrivateKey = '0x77d28989707ad7554ab15e1c35859340585e6f786ea05ac0247c1b8b2688c2cc';
    const testPublicKey = EthCrypto.publicKeyByPrivateKey(testPrivateKey);
    const testAddress = EthCrypto.publicKey.toAddress(testPublicKey);
    const testSymmetricKey = new SymmetricKey();

    const mockedContractConnect = jest.fn();

    const mockedWait = jest.fn();
    const mockedStoreTrade = jest.fn();
    const mockedUpdateTrade = jest.fn();
    const mockedGetTradesIndexes = jest.fn();
    const mockedStoreTradeIndex = jest.fn();
    const mockedGetTrade = jest.fn();

    const mockedSerialize = jest.fn();
    const mockedDeserialize = jest.fn();

    let generateSymmetricKeySpy: jest.SpyInstance;

    beforeAll(() => {
        mockedStoreTrade.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedUpdateTrade.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedStoreTradeIndex.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedContractConnect.mockReturnValue({
            storeTrade: mockedStoreTrade,
            updateTrade: mockedUpdateTrade,
            getTradesIndexes: mockedGetTradesIndexes,
            storeTradeIndex: mockedStoreTradeIndex,
            getTrade: mockedGetTrade,
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
        mockedSerializer = createMock<EntitySerializer<Trade>>({
            serialize: mockedSerialize,
            deserialize: mockedDeserialize,
        });
        mockedProvider = createMock<UrlJsonRpcProvider>({
            _isProvider: true,
        });

        tradeEthersDriver = new TradeEthersDriver(
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

    it('should correctly store a trade using contract methods', async () => {
        const trade = new Trade([['mat1', 'mat2']], 'trade 1', [], [], 'companyID1', 'sourceUrl', 'trade1', 'testOwnerAddress');

        mockedSerialize.mockReturnValue('serializedTrade');

        const testEncryptedTrade = SymmetricEncryptor.encrypt(
            testSymmetricKey,
            'serializedTrade',
        );

        const response = await tradeEthersDriver.store(trade);

        expect(response).toEqual(testSymmetricKey);
        expect(mockedSerialize).toHaveBeenCalledTimes(1);
        expect(mockedSerialize).toHaveBeenNthCalledWith(1, trade);

        expect(mockedStoreTrade).toHaveBeenCalledTimes(1);
        expect(mockedStoreTrade).toHaveBeenNthCalledWith(
            1,
            'trade1',
            'testOwnerAddress',
            [['mat1', 'mat2']],
            testEncryptedTrade,
        );
        expect(mockedWait).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when smart contract store trade fails', async () => {
        const trade = new Trade([['mat1', 'mat2']], 'trade 1', [], [], 'companyID1', 'sourceUrl', 'trade1', 'testOwnerAddress');

        mockedSerialize.mockReturnValue('serializedTrade');

        mockedWait.mockRejectedValue(new Error());

        const storeFn = () => tradeEthersDriver.store(trade);

        expect(storeFn).rejects.toThrowError(new Error('Error while creating trade: Error'));
    });

    it('should correctly update a trade using contract methods', async () => {
        const trade = new Trade([['mat1', 'mat2']], 'trade 1', [], [], 'companyID1', 'sourceUrl', 'trade1', 'testOwnerAddress');

        const tradeIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'trade1')),
            },
        ];
        mockedGetTradesIndexes.mockResolvedValue(tradeIndexes);

        mockedSerialize.mockReturnValue('serializedTrade');

        const testEncryptedTrade = SymmetricEncryptor.encrypt(
            testSymmetricKey,
            'serializedTrade',
        );

        mockedWait.mockResolvedValue('test');

        await tradeEthersDriver.update(trade);

        expect(mockedSerialize).toHaveBeenCalledTimes(1);
        expect(mockedSerialize).toHaveBeenNthCalledWith(1, trade);

        expect(mockedUpdateTrade).toHaveBeenCalledTimes(1);
        expect(mockedUpdateTrade).toHaveBeenNthCalledWith(
            1,
            'trade1',
            [['mat1', 'mat2']],
            testEncryptedTrade,
        );
        expect(mockedWait).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when smart contract update trade fails', async () => {
        const trade = new Trade([['mat1', 'mat2']], 'trade 1', [], [], 'companyID1', 'sourceUrl', 'trade1', 'testOwnerAddress');

        const tradeIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(2))),
            },
        ];
        mockedGetTradesIndexes.mockResolvedValue(tradeIndexes);

        mockedSerialize.mockReturnValue('serializedTrade');

        const updateFn = () => tradeEthersDriver.update(trade);
        expect(updateFn).rejects.toThrowError(new Error('Error while updating trade: Error: Trade with id trade1 not found'));
    });

    it('should store a new index for trade using adapter', async () => {
        const trade = new Trade([['mat1', 'mat2']], 'trade 1', [], [], 'companyID1', 'sourceUrl', 'trade1', 'testOwnerAddress');

        const tradeIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'trade1')),
            },
        ];
        mockedGetTradesIndexes.mockResolvedValue(tradeIndexes);

        await tradeEthersDriver.allowRead(
            trade.id,
        );

        expect(mockedStoreTradeIndex).toBeCalledTimes(1);
        expect(mockedStoreTradeIndex).toHaveBeenNthCalledWith(
            1,
            testAddress,
            expect.any(String),
            expect.any(String),
        );

        const obtainedEncryptedSymmetricKey = mockedStoreTradeIndex.mock.calls[0][1];
        const obtainedEncryptedDataIndex = mockedStoreTradeIndex.mock.calls[0][2];

        const obtainedSymmetricKey = await AsymmetricEncryptor.decrypt(testPrivateKey, JSON.parse(obtainedEncryptedSymmetricKey));
        const obtainedDataIndex = await AsymmetricEncryptor.decrypt(testPrivateKey, JSON.parse(obtainedEncryptedDataIndex));

        expect(testSymmetricKey.toJson()).toEqual(obtainedSymmetricKey);
        expect(String(trade.id)).toEqual(obtainedDataIndex);
    });

    it('should throw an error when smart contract storeTradeIndex fails', async () => {
        const trade = new Trade([['mat1', 'mat2']], 'trade 1', [], [], 'companyID1', 'sourceUrl', 'trade1', 'testOwnerAddress');

        const tradeIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(2))),
            },
        ];
        mockedGetTradesIndexes.mockResolvedValue(tradeIndexes);
        mockedStoreTradeIndex.mockRejectedValue(new Error());

        mockedSerialize.mockReturnValue('serializedTrade');

        const allowReadFn = () => tradeEthersDriver.allowRead(
            trade.id,
            testPublicKey,
            testAddress,
            testSymmetricKey,
        );
        expect(allowReadFn).rejects.toThrowError(new Error('Error while adding new reader: Error'));
    });

    it('should retrieve the list of trades using using contract methods', async () => {
        const trade1 = new Trade([['mat1', 'mat2']], 'trade 1', [], [], 'companyID1', 'sourceUrl', 'trade1', 'testOwnerAddress');
        const trade2 = new Trade([['mat3', 'mat4']], 'trade 2', [], [], 'companyID2', 'sourceUrl', 'trade2', 'testOwnerAddress');

        const tradeIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(trade1.consigneeCompanyId))),
            },
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(trade2.consigneeCompanyId))),
            },
        ];
        mockedGetTradesIndexes.mockReturnValue(tradeIndexes);

        mockedDeserialize.mockReturnValueOnce(trade1);
        mockedDeserialize.mockReturnValueOnce(trade2);

        const encyptedTrade1 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'foo'),
        };
        const encyptedTrade2 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'bar'),
        };
        mockedGetTrade.mockReturnValueOnce(encyptedTrade1);
        mockedGetTrade.mockReturnValueOnce(encyptedTrade2);

        const retrievedTrade = await tradeEthersDriver.retrieveAll();

        expect(retrievedTrade).toEqual([trade1, trade2]);
    });

    it('should retrieve an empty list of trades using using contract methods', async () => {
        mockedGetTradesIndexes.mockReturnValue([]);

        const retrievedTrade = await tradeEthersDriver.retrieveAll();

        expect(retrievedTrade).toEqual([]);
    });

    it('should throw an error when smart contract getTradesIndexes fails', async () => {
        mockedGetTradesIndexes.mockRejectedValue(new Error());

        mockedSerialize.mockReturnValue('serializedTrade');

        const retrieveAllFn = () => tradeEthersDriver.retrieveAll();
        expect(retrieveAllFn).rejects.toThrowError(new Error('Error while retrieving trades'));
    });

    it('should retrieve a trade using using contract methods', async () => {
        const trade1 = new Trade([['mat1', 'mat2']], 'trade 1', [], [], 'companyID1', 'sourceUrl', 'trade42', 'testOwnerAddress');
        const trade2 = new Trade([['mat3', 'mat4']], 'trade 2', [], [], 'companyID2', 'sourceUrl', 'trade43', 'testOwnerAddress');

        const tradeIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(trade1.consigneeCompanyId))),
            },
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, String(trade2.consigneeCompanyId))),
            },
        ];
        mockedGetTradesIndexes.mockReturnValue(tradeIndexes);

        mockedDeserialize.mockReturnValueOnce(trade1);
        mockedDeserialize.mockReturnValueOnce(trade2);

        const encyptedTrade1 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'foo'),
        };
        const encyptedTrade2 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'bar'),
        };
        mockedGetTrade.mockReturnValueOnce(encyptedTrade1);
        mockedGetTrade.mockReturnValueOnce(encyptedTrade2);

        const retrievedTrade = await tradeEthersDriver.retrieve('trade42');

        expect(retrievedTrade).toEqual(trade1);
    });

    it('should throw an error when resource is not found', async () => {
        mockedGetTradesIndexes.mockResolvedValue([]);

        const retrieveFn = () => tradeEthersDriver.retrieve('trade42');
        expect(retrieveFn).rejects.toThrowError(new Error('Error while retrieving trade'));
    });

    it('should throw an error when retrieveAll fails', async () => {
        mockedGetTradesIndexes.mockRejectedValue(new Error());

        const retrieveFn = () => tradeEthersDriver.retrieve('trade42');
        expect(retrieveFn).rejects.toThrowError(new Error('Error while retrieving trade'));
    });
});
