/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import { nanoid } from 'nanoid';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { IndexStruct } from '../smart-contracts/UneceCottonTracking';
import AsymmetricEncryptor from '../crypto/AsymmetricEncryptor';
import SymmetricEncryptor from '../crypto/SymmetricEncryptor';
import SymmetricKey from '../crypto/SymmetricKey';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';
import { IndexWithDecryptedData } from './IndexWithDecryptedData.interface';
import IdentityEthersDriver from './IdentityEthersDriver';
import EntitySerializer from '../serializers/EntitySerializer.interface';
import Trade from '../entities/Trade';
import { UneceCottonTracking__factory } from '../smart-contracts';
import { EntityEthersDriver } from './EntityEthersDriver.interface';

/* It implements the `EntityEthersDriver` interface, and it uses the `UneceCottonTracking` contract to
store and retrieve `Trade` entities */
export class TradeEthersDriver implements EntityEthersDriver<Trade> {
    private _identityDriver: IdentityEthersDriver;

    private _serializer: EntitySerializer<Trade>;

    private _contract: Contract;

    constructor(
        identityDriver: IdentityEthersDriver,
        serializer: EntitySerializer<Trade>,
        provider: JsonRpcProvider,
        contractAddress: string,
    ) {
        this._identityDriver = identityDriver;
        this._serializer = serializer;
        this._contract = UneceCottonTracking__factory
            .connect(contractAddress, provider)
            .connect(identityDriver.wallet);
    }

    /**
     * It takes a trade object, serializes it, encrypts it with a randomly generated symmetric key, and
     * stores the encrypted data on the blockchain
     * @param {Trade} t - Trade - the trade object that we want to store
     * @returns The symmetric key used to encrypt the trade data.
     */
    async store(t: Trade): Promise<SymmetricKey> {
        try {
            const symmetricKey = SymmetricEncryptor.generateSymmetricKey();
            if (!t.ownerAddress) t.ownerAddress = this._identityDriver.address;
            if (!t.consigneeCompanyId) t.consigneeCompanyId = this._identityDriver.address;
            if (!t.id) t.id = `T${nanoid(10)}`;
            const serializedT = this._serializer.serialize(t);
            const encryptedData = SymmetricEncryptor.encrypt(symmetricKey, serializedT);
            const storeTTx = await this._contract.storeTrade(
                t.id,
                t.ownerAddress,
                t.materialsIds,
                encryptedData,
            );
            await storeTTx.wait();
            return symmetricKey;
        } catch (e) {
            throw new Error(`Error while creating trade: ${e}`);
        }
    }

    /**
     * It takes a trade object, retrieves the symmetric key, encrypts the trade object with the
     * symmetric key, and then updates the trade on the blockchain
     * @param {Trade} t - Trade - the trade object to be updated
     */
    async update(t: Trade) {
        try {
            if (!t.id) {
                throw new Error('Entity id must not be null! Trade may not yet have been stored');
            }
            const symmetricKey = await this.retrieveSymmetricKey(t.id);
            const serializedT = this._serializer.serialize(t);
            const encryptedData = SymmetricEncryptor.encrypt(symmetricKey, serializedT);

            const updateTTx = await this._contract.updateTrade(
                t.id,
                t.materialsIds,
                encryptedData,
            );
            await updateTTx.wait();
        } catch (e) {
            throw new Error(`Error while updating trade: ${e}`);
        }
    }

    private async retrieveSymmetricKey(tId: string): Promise<SymmetricKey> {
        // retrieve t indexes
        const dataIndexes: Array<IndexStruct> = await this._contract.getTradesIndexes();

        // decrypt index content
        const indexPromises: Promise<IndexWithDecryptedData>[] = dataIndexes
            .map(async (rawEncryptedT) => ({
                symmetricKey: SymmetricKey.fromJson(await AsymmetricEncryptor.decrypt(this._identityDriver.privateKey, JSON.parse(rawEncryptedT.encrypted_symmetric_key))),
                index: await AsymmetricEncryptor.decrypt(this._identityDriver.privateKey, JSON.parse(rawEncryptedT.encrypted_id)),
            } as IndexWithDecryptedData));

        // find index that match resource id
        const tIndex = (await Promise.all(indexPromises))
            .find((index) => index.index === tId);

        if (tIndex === undefined) {
            throw new ResourceNotFoundException(tId, 'Trade');
        }
        return tIndex.symmetricKey;
    }

    /**
     * It allows a new reader to access the data by re-encrypting the symmetric key and the data index
     * for the new reader
     * @param {string} tId - The trade ID
     * @param {string} [readerPublicKey] - The public key of the reader.
     * @param {string} [readerAddress] - The address of the reader.
     * @param {SymmetricKey} [symmetricKey] - The symmetric key used to encrypt the data.
     */
    async allowRead(tId: string | undefined, readerPublicKey?: string, readerAddress?: string, symmetricKey?: SymmetricKey): Promise<void> {
        try {
            if (!tId) {
                throw new Error('Entity id must not be null! Trade may not yet have been stored');
            }
            if (!readerPublicKey || !readerAddress) { // ! If not specified, the writer is the reader
                readerPublicKey = this._identityDriver.publicKey;
                readerAddress = this._identityDriver.address;
            }
            if (!symmetricKey) {
                // eslint-disable-next-line no-param-reassign
                symmetricKey = await this.retrieveSymmetricKey(tId);
            }

            // Re-encrypt symmetric key and data index for the new reader
            const encryptedSymmetricKey = await AsymmetricEncryptor.encrypt(readerPublicKey, symmetricKey.toJson());
            const encryptedDataIndex = await AsymmetricEncryptor.encrypt(readerPublicKey, String(tId));

            // Store the new index on-chain
            const storeTradeIndexTx = await this._contract.storeTradeIndex(
                readerAddress,
                JSON.stringify(encryptedSymmetricKey),
                JSON.stringify(encryptedDataIndex),
            );
            await storeTradeIndexTx.wait();
        } catch (e) {
            throw new Error(`Error while adding new reader: ${e}`);
        }
    }

    /**
     * It retrieves all the trades from the blockchain, decrypts them, and returns them as an array of
     * Trade objects
     * @returns An array of Trade objects
     */
    async retrieveAll(): Promise<Array<Trade>> {
        try {
            // retrieve t indexes
            const dataIndexes: Array<IndexStruct> = await this._contract.getTradesIndexes();

            if (dataIndexes === undefined || dataIndexes.length < 1) {
                return [];
            }

            const dataPromises = dataIndexes.map(async (rawEncryptedT) => {
                const jsonSymmetricKey: string = String(
                    await AsymmetricEncryptor.decrypt(
                        this._identityDriver.privateKey,
                        JSON.parse(rawEncryptedT.encrypted_symmetric_key),
                    ),
                );
                const index = await AsymmetricEncryptor.decrypt(
                    this._identityDriver.privateKey,
                    JSON.parse(rawEncryptedT.encrypted_id),
                );
                const encryptedData = await this._contract.getTrade(index);

                const symmetricKey: SymmetricKey = SymmetricKey.fromJson(jsonSymmetricKey);

                const encryptedMessage = encryptedData.encrypted_data;
                const serializedData = SymmetricEncryptor.decrypt(symmetricKey, encryptedMessage);

                return this._serializer.deserialize(serializedData);
            });

            return Promise.all(dataPromises);
        } catch (e) {
            throw new Error('Error while retrieving trades');
        }
    }

    /**
     * It retrieves all trades and then finds the one with the given id
     * @param {string} tId - number - the id of the trade to retrieve
     * @returns A promise that resolves to a trade
     */
    async retrieve(tId: string): Promise<Trade> {
        try {
            const data = await this.retrieveAll();

            const maybeData = data.find((m) => m.id === tId); // first element or undefined
            if (!maybeData) { throw new ResourceNotFoundException(tId, 'Trade'); }
            return maybeData;
        } catch (e) {
            throw new Error('Error while retrieving trade');
        }
    }

    /**
     * Retrieve a transformation by its external id
     * @param {string} externalEventId - the id of the standard json
     * @returns A promise that resolves to a Trade
     */
    async retrieveByExternalEventId(externalEventId: string): Promise<Trade> {
        try {
            const data = await this.retrieveAll();

            const maybeData = data.find((t) => t.id === externalEventId); // first element or undefined
            if (!maybeData) { throw new ResourceNotFoundException(externalEventId, 'Trade'); }
            return maybeData;
        } catch (e) {
            throw new Error('Error while retrieving trade');
        }
    }
}

export default TradeEthersDriver;
