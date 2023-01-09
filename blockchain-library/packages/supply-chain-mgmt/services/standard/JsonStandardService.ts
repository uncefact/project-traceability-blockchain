/* eslint-disable no-param-reassign */
import { StandardType } from '../../types/StandardType.type';
import IPFSDriver from '../../drivers/IPFSDriver.interface';
import { StandardEventStrategy } from '../../strategies/standard/StandardEventStrategy.interface';

/* This class is used to store and retrieve entity using the driver  */
export class JsonStandardService<T extends StandardType> {
    private _ipfsDriver: IPFSDriver;

    private _standardEventStrategy: StandardEventStrategy<T>;

    /**
     * @param ipfsDriver - IPFSDriver
     * @param standardEventStrategy - StandardEventStrategy
     */
    constructor(
        ipfsDriver: IPFSDriver,
        standardEventStrategy: StandardEventStrategy<T>,
    ) {
        this._ipfsDriver = ipfsDriver;
        this._standardEventStrategy = standardEventStrategy;
    }

    /**
     * IMPORTANT: the sourceUrl of an entity could be a reference (of ipfs) of an external data or the reference of the standard object itself
     * "Process the TransformationEvent object and save it to IPFS and its metadata on blockchain"
     * @param {t} t - standard JSON object, deserialized in TransformationEvent
     * @param {string} ipfsHash - reference of the object data file stored within ipfs
     * @param {string} externalId - id of the stored entity (in this case it will not be automatically generated)
     * @param {string} extDataIpfsHash - reference of an external data file stored within ipfs
     */
    // TODO: if the transformation event json file is provided by another company, also the reader identity is necessary as parameter
    async store(t: T, ipfsHash?: string, externalId?: string, extDataIpfsHash?: string): Promise<string | undefined> {
        if (!ipfsHash)
            ipfsHash = await this._ipfsDriver.store(JSON.stringify(t));
        return this._standardEventStrategy.store(t, ipfsHash, externalId, extDataIpfsHash);
    }

    /**
     * The function update the transformation and materials related to TransformationEvent object
     * @param {t} t - standard JSON object, deserialized in TransformationEvent
     * @param eventId - id of the event to update
     */
    async update(t: T, eventId: string): Promise<void> {
        const ipfsHash = await this._ipfsDriver.store(JSON.stringify(t));
        const oldIpfsHash = await this._standardEventStrategy.update(t, eventId, ipfsHash);
        await this._ipfsDriver.delete(oldIpfsHash);
    }

    /**
     * "Read the source URL of the event, retrieve the data from IPFS, and return it."
     *
     * The first line of the function is a TypeScript annotation. It's not required, but it's a good idea
     * to include it. It tells the compiler what type of data the function will return. In this case, the
     * function will return a generic type, which is defined in the class declaration
     * @param {string} eventID - The ID of the event you want to read.
     * @returns The data that was stored in IPFS or a list of sourcesURL (references of IPFS files) if no parameter is provided.
     */
    async read(eventID?: string): Promise<string | string[]> {
        if (eventID){
            const ipfsHash = await this._standardEventStrategy.readSourceURL(eventID);
            return this._ipfsDriver.retrieve(ipfsHash);
        }
        return this._standardEventStrategy.readSourcesURL();
    }

}

export default JsonStandardService;
