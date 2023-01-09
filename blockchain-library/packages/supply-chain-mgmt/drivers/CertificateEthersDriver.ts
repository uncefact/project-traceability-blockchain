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
import { UneceCottonTracking__factory } from '../smart-contracts';
import { EntityEthersDriver } from './EntityEthersDriver.interface';
import Certificate from '../entities/Certificate';

export class CertificateEthersDriver implements EntityEthersDriver<Certificate> {
    private _identityDriver: IdentityEthersDriver;

    private _serializer: EntitySerializer<Certificate>;

    private _contract: Contract;

    constructor(
        identityDriver: IdentityEthersDriver,
        serializer: EntitySerializer<Certificate>,
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
     * The function takes a certification object as input, generates a symmetric key, encrypts the certification
     * object with the symmetric key, and stores the encrypted certification object on the blockchain
     * @param {Certificate} t - Certificate - the certification to be stored
     * @returns The symmetric key is being returned.
     */
    async store(t: Certificate): Promise<SymmetricKey> {
        try {
            const symmetricKey = SymmetricEncryptor.generateSymmetricKey();
            if (!t.ownerAddress) t.ownerAddress = this._identityDriver.address;
            if (!t.id) t.id = `C${nanoid(10)}`;
            const serializedT = this._serializer.serialize(t);
            const encryptedData = SymmetricEncryptor.encrypt(symmetricKey, serializedT);

            const storeTTx = await this._contract.storeCertificate(
                t.id,
                t.ownerAddress,
                encryptedData,
            );
            await storeTTx.wait();

            return symmetricKey;
        } catch (e) {
            throw new Error(`Error while creating certificate: ${e}`);
        }
    }

    /**
     * The function takes a certificate object as an argument, retrieves the symmetric key associated with
     * the certificate, encrypts the certificate object with the symmetric key, and then updates the certificate
     * on the blockchain
     * @param {Certificate} t - Certificate - the certificate object that we want to update
     */
    async update(t: Certificate) {
        try {
            if (!t.id) {
                throw new Error('Entity id must not be null! Certificate may not yet have been stored');
            }
            const symmetricKey = await this.retrieveSymmetricKey(t.id);
            const serializedT = this._serializer.serialize(t);
            const encryptedData = SymmetricEncryptor.encrypt(symmetricKey, serializedT);

            const updateTTx = await this._contract.updateCertificate(
                t.id,
                encryptedData,
            );
            await updateTTx.wait();
        } catch (e) {
            throw new Error(`Error while updating certificate: ${e}`);
        }
    }

    private async retrieveSymmetricKey(tId: string): Promise<SymmetricKey> {
        // retrieve t indexes
        const dataIndexes: Array<IndexStruct> = await this._contract.getCertificatesIndexes();

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
            throw new ResourceNotFoundException(tId, 'Certificate');
        }
        return tIndex.symmetricKey;
    }

    /**
     * It allows a new reader to access the data by re-encrypting the symmetric key and the data index
     * for the new reader
     * @param {string} tId - The transaction ID of the data you want to share.
     * @param {string} [readerPublicKey] - The public key of the reader.
     * @param {string} [readerAddress] - The address of the reader.
     * @param {SymmetricKey} [symmetricKey] - The symmetric key used to encrypt the data.
     */
    async allowRead(tId: string | undefined, readerPublicKey?: string, readerAddress?: string, symmetricKey?: SymmetricKey): Promise<void> {
        try {
            if (!tId) {
                throw new Error('Entity id must not be null! Certificate may not yet have been stored');
            }
            if (!readerPublicKey || !readerAddress) { // ! If not specified, the writer is the reader
                readerPublicKey = this._identityDriver.publicKey;
                readerAddress = this._identityDriver.address;
            }
            if (!symmetricKey) {
                symmetricKey = await this.retrieveSymmetricKey(tId);
            }

            // Re-encrypt symmetric key and data index for the new reader
            const encryptedSymmetricKey = await AsymmetricEncryptor.encrypt(readerPublicKey, symmetricKey.toJson());
            const encryptedDataIndex = await AsymmetricEncryptor.encrypt(readerPublicKey, tId);

            // Store the new index on-chain
            const storeCertificateIndexTx = await this._contract.storeCertificateIndex(
                readerAddress,
                JSON.stringify(encryptedSymmetricKey),
                JSON.stringify(encryptedDataIndex),
            );
            await storeCertificateIndexTx.wait();
        } catch (e) {
            throw new Error(`Error while adding new reader: ${e}`);
        }
    }

    /**
     * It retrieves all the certificates from the blockchain, decrypts them, and returns them as an array
     * of Certificate objects
     * @returns An array of certificates
     */
    async retrieveAll(): Promise<Array<Certificate>> {
        try {
            // retrieve t indexes
            const dataIndexes: Array<IndexStruct> = await this._contract.getCertificatesIndexes();

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
                const encryptedData = await this._contract.getCertificate(index);

                const symmetricKey: SymmetricKey = SymmetricKey.fromJson(jsonSymmetricKey);

                const encryptedMessage = encryptedData.encrypted_data;
                const serializedData = SymmetricEncryptor.decrypt(symmetricKey, encryptedMessage);

                return this._serializer.deserialize(serializedData);
            });

            return Promise.all(dataPromises);
        } catch (e) {
            throw new Error(`Error while retrieving certificates: ${e}`);
        }
    }

    /**
     * It retrieves all certificates and then returns the first certificate that matches the given id
     * @param {string} tId - number - the id of the certificate to retrieve
     * @returns A promise that resolves to a certificate
     */
    async retrieve(tId: string): Promise<Certificate> {
        try {
            const data = await this.retrieveAll();

            const maybeData = data.find((m) => m.id === tId); // first element or undefined
            if (!maybeData) { throw new ResourceNotFoundException(tId, 'Certificate'); }
            return maybeData;
        } catch (e) {
            throw new Error(`Error while retrieving certificate: ${e}`);
        }
    }

    /**
     * Retrieve a certificate by its external certificate id
     * @param {string} externalCertificateId - The external certificate id of the certificate you want
     * to retrieve.
     * @returns A promise of a Certificate object
     */
    async retrieveByExternalCertificateId(externalCertificateId: string): Promise<Certificate | undefined> {
        try {
            const data = await this.retrieveAll();

            const maybeData = data.find((m) => m.externalCertificateId === externalCertificateId); // first element or undefined
            return maybeData;
        } catch (e) {
            throw new Error(`Error while retrieving certificate: ${e}`);
        }
    }

    async retrieveByExternalEventId(eventId: string): Promise<Certificate> {
        try {
            const data = await this.retrieveAll();

            const maybeData = data.find((m) => m.externalEventId === eventId); // first element or undefined
            if (!maybeData) { throw new ResourceNotFoundException(eventId, 'Certificate'); }
            return maybeData;
        } catch (e) {
            throw new Error(`Error while retrieving certificate: ${e}`);
        }
    }

    /**
     * It checks if a certificate exists in the database by its external certificate id
     * @param {string} externalCertificateId - The external certificate id that you want to check for.
     * @returns A boolean value
     */
    async isPresentByExternalCertificateId(externalCertificateId: string): Promise<boolean> {
        try {
            const data = await this.retrieveAll();

            return !!data.find((m) => m.externalCertificateId === externalCertificateId);
        } catch (e) {
            throw new Error(`Error while retrieving certificates: ${e}`);
        }
    }
}

export default CertificateEthersDriver;
