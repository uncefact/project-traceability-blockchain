/* eslint-disable no-param-reassign */
import { SupplyChainManagementType } from '../types/SupplyChainManagementType.type';
import { EntityEthersDriver } from '../drivers/EntityEthersDriver.interface';

/* This class is used to store and retrieve entity using the driver  */
export class EntityService<T extends SupplyChainManagementType> {
    private _tDriver: EntityEthersDriver<T>;

    /**
     * @param tDriver - EthersEntityDriver<T>
     */
    constructor(tDriver: EntityEthersDriver<T>) {
        this._tDriver = tDriver;
    }

    /**
     * "Store the given T, and allow the given reader to read it."
     *
     * The first line of the function is a call to the `store` function of the `TDriver` class. This
     * function returns a symmetric key, which is used to encrypt the T
     * @param {T} t - The object to be stored.
     * @param {string} [readerPublicKey] - The public key of the reader.
     * @param {string} [readerAddress] - The address of the reader.
     */
    async store(
        t: T,
        readerPublicKey?: string,
        readerAddress?: string,
    ): Promise<string> {
        const symmetricKey = await this._tDriver.store(t);
        await this._tDriver.allowRead(t.id, readerPublicKey, readerAddress, symmetricKey);
        return t.id as string;
    }

    /**
     * "Update the resource with the same id as t"
     * @param {T} t - T - the object to be updated
     */
    async update(
        t: T,
    ): Promise<string> {
        await this._tDriver.update(t);
        return t.id as string;
    }

    /**
     * `allowRead` allows a reader to read a transaction
     * @param {string} tId - the transaction id of the transaction you want to allow read access to
     * @param {string} readerPublicKey - The public key of the reader.
     * @param {string} readerAddress - the address of the reader
     */
    async allowRead(
        tId: string,
        readerPublicKey: string,
        readerAddress: string,
    ): Promise<void> { // TODO potentially readerPublicKey isn't required
        await this._tDriver.allowRead(tId, readerPublicKey, readerAddress);
    }

    /**
     * "Retrieve a T from the database."
     *
     * The first line of the function is a comment. It's a comment that describes the function
     * @param {string} tId - The id of the object to retrieve.
     * @returns A promise of type T
     */
    async retrieve(tId: string): Promise<T> {
        return this._tDriver.retrieve(tId);
    }

    /**
     * "Retrieve all the records from the database."
     *
     * The function is marked as `async` because it returns a `Promise` object
     * @returns An array of type T
     */
    async retrieveAll(): Promise<Array<T>> {
        return this._tDriver.retrieveAll();
    }
}

export default EntityService;
