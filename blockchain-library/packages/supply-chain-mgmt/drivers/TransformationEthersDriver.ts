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
import Transformation from '../entities/Transformation';
import { UneceCottonTracking__factory } from '../smart-contracts';
import { EntityEthersDriver } from './EntityEthersDriver.interface';

/* It implements the `EntityEthersDriver` interface, and it usesthe  `UneceCottonTracking` contract to
store and retrieve `Transformation` entities */
export class TransformationEthersDriver implements EntityEthersDriver<Transformation> {
    private _identityDriver: IdentityEthersDriver;

    private _serializer: EntitySerializer<Transformation>;

    private _contract: Contract;

    constructor(
        identityDriver: IdentityEthersDriver,
        serializer: EntitySerializer<Transformation>,
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
     * It takes a transformation object, generates a symmetric key, encrypts the transformation object
     * with the symmetric key, and stores the encrypted transformation object on the blockchain
     * @param {Transformation} t - Transformation - the transformation object that we want to store
     * @returns The symmetric key used to encrypt the transformation.
     */
    async store(t: Transformation): Promise<SymmetricKey> {
        try {
            const symmetricKey = SymmetricEncryptor.generateSymmetricKey();
            if (!t.ownerAddress) t.ownerAddress = this._identityDriver.address;
            if (!t.id) t.id = `t${nanoid(10)}`;
            const serializedT = this._serializer.serialize(t);
            const encryptedData = SymmetricEncryptor.encrypt(symmetricKey, serializedT);

            const storeTTx = await this._contract.storeTransformation(
                t.id,
                t.ownerAddress,
                t.materialsInIds,
                t.materialOutId,
                encryptedData,
            );

            await storeTTx.wait();
            return symmetricKey;
        } catch (e) {
            throw new Error(`Error while creating transformation: ${e}`);
        }
    }

    /**
     * It takes a transformation object, retrieves the symmetric key, encrypts the transformation
     * object with the symmetric key, and then sends the encrypted transformation object to the
     * blockchain
     * @param {Transformation} t - Transformation - the transformation object to be updated
     */
    async update(t: Transformation) {
        try {
            if (!t.id) {
                throw new Error('Entity id must not be null! Transformation may not yet have been stored');
            }
            const symmetricKey = await this.retrieveSymmetricKey(t.id);
            const serializedT = this._serializer.serialize(t);
            const encryptedData = SymmetricEncryptor.encrypt(symmetricKey, serializedT);

            const updateTTx = await this._contract.updateTransformation(
                t.id,
                t.materialsInIds,
                t.materialOutId,
                encryptedData,
            );
            await updateTTx.wait();
        } catch (e) {
            throw new Error(`Error while updating transformation: ${e}`);
        }
    }

    private async retrieveSymmetricKey(tId: string): Promise<SymmetricKey> {
        // retrieve t indexes
        const dataIndexes: Array<IndexStruct> = await this._contract.getTransformationsIndexes();

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
            throw new ResourceNotFoundException(tId, 'Transformation');
        }
        return tIndex.symmetricKey;
    }

    /**
     * The function allows a new reader to read the data by re-encrypting the symmetric key and the
     * data index for the new reader and storing the new index on-chain
     * @param {string} tId - The transformation ID of the data you want to share.
     * @param {string} [readerPublicKey] - The public key of the reader.
     * @param {string} [readerAddress] - The address of the reader.
     * @param {SymmetricKey} [symmetricKey] - The symmetric key used to encrypt the data.
     */
    async allowRead(tId: string | undefined, readerPublicKey?: string, readerAddress?: string, symmetricKey?: SymmetricKey): Promise<void> {
        try {
            if (!tId) {
                throw new Error('Entity id must not be null! Transformation may not yet have been stored');
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
            const storeTransformationIndexTx = await this._contract.storeTransformationIndex(
                readerAddress,
                JSON.stringify(encryptedSymmetricKey),
                JSON.stringify(encryptedDataIndex),
            );
            await storeTransformationIndexTx.wait();
        } catch (e) {
            throw new Error('Error while adding new reader');
        }
    }

    /**
     * It retrieves all the transformations from the blockchain, decrypts them, and returns them as an
     * array of Transformation objects
     * @returns An array of Transformation objects
     */
    async retrieveAll(): Promise<Array<Transformation>> {
        try {
            // retrieve t indexes
            const dataIndexes: Array<IndexStruct> = await this._contract.getTransformationsIndexes();

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
                const encryptedData = await this._contract.getTransformation(index);

                const symmetricKey: SymmetricKey = SymmetricKey.fromJson(jsonSymmetricKey);

                const encryptedMessage = encryptedData.encrypted_data;
                const serializedData = SymmetricEncryptor.decrypt(symmetricKey, encryptedMessage);

                return this._serializer.deserialize(serializedData);
            });

            return Promise.all(dataPromises);
        } catch (e) {
            throw new Error(`Error while retrieving transformations: ${e}`);
        }
    }

    /**
     * Retrieve a transformation by its id
     * @param {string} tId - number - the id of the transformation to retrieve
     * @returns A promise that resolves to a Transformation
     */
    async retrieve(tId: string): Promise<Transformation> {
        try {
            const data = await this.retrieveAll();

            const maybeData = data.find((m) => m.id === tId); // first element or undefined
            if (!maybeData) { throw new ResourceNotFoundException(tId, 'Transformation'); }
            return maybeData;
        } catch (e) {
            throw new Error('Error while retrieving transformation');
        }
    }

    /**
     * Retrieve a transformation by its external id
     * @param {string} externalEventId - the id of the standard json
     * @returns A promise that resolves to a Transformation
     */
    async retrieveByExternalEventId(externalEventId: string): Promise<Transformation> {
        try {
            const data = await this.retrieveAll();

            const maybeData = data.find((t) => t.id === externalEventId); // first element or undefined
            if (!maybeData) { throw new ResourceNotFoundException(externalEventId, 'Transformation'); }
            return maybeData;
        } catch (e) {
            throw new Error('Error while retrieving transformation');
        }
    }
}

export default TransformationEthersDriver;
