/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

/* Defining the type of resource that is being stored. */
export enum ResourceType {
    Material = 'material',
    Transformation = 'transformation',
    Trade = 'trade'
}
/**
 * `ResourceStoredEvent` is an object representing an event containing the data related to the insertion of a new resource (Materia, Transaction, Transformation).
 * @property {ResourceType} resourceType - The type of resource that was stored.
 * @property {string} from - The address of the user who stored the resource.
 * @property {number} resourceId - The id of the resource that was stored.
 * @property {string} transactionHash - The hash of the transaction that created the event.
 * @property {number} blockNumber - The block number of the block that contains the transaction that
 * emitted the event.
 */
export type ResourceStoredEvent = {
    resourceType: ResourceType;
    from: string;
    resourceId: number;
    transactionHash: string;
    blockNumber: number;
};
/**
 * `ResourceIndexStoredEvent` is an object representing an event containing the data related to the insertion of a new resource index.
 * @property {ResourceType} resourceType - The type of resource that was stored.
 * @property {string} from - The address of the resource owner.
 * @property {string} reader - The address of the reader that will read the resource (it can also be the owner).
 * @property {string} transactionHash - The hash of the transaction that created the event.
 * @property {number} blockNumber - The block number of the transaction that created the event.
 */
export type ResourceIndexStoredEvent = {
    resourceType: ResourceType;
    from: string;
    reader: string;
    transactionHash: string;
    blockNumber: number;
};

/**
 * `ResourceStoredEvent` is an object representing an event containing the data related to the update of a resource (Materia, Transaction, Transformation).
 * @property {ResourceType} resourceType - The type of resource that was updated.
 * @property {string} from - The address of the user who created the resource.
 * @property {number} resourceId - The id of the resource that was updated.
 * @property {string} transactionHash - The hash of the transaction that created the resource.
 * @property {number} blockNumber - The block number of the transaction that created the event.
 */
export type ResourceUpdatedEvent = {
    resourceType: ResourceType;
    from: string;
    resourceId: number;
    transactionHash: string;
    blockNumber: number;
};
