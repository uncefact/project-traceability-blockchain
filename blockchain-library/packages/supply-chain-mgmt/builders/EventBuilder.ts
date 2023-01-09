import { Event } from 'ethers';
import ParsingException from '../exceptions/ParsingException';
import {
    ResourceStoredEvent,
    ResourceIndexStoredEvent,
    ResourceUpdatedEvent,
    ResourceType,
} from '../types/EventType.type';

/* Utility class that takes an event from the blockchain and converts it into a more readable format */
export class EventBuilder {
    /**
     * It build a ResourceStoredEvent given a generic Blockchain Event
     * @param {Event} event - Event - this is the event object that is returned from the contract.
     * @returns A ResourceStoredEvent
     */
    static buildResourceStoredEvent(event: Event): ResourceStoredEvent {
        if (!event.args) {
            throw new ParsingException('event');
        }

        return {
            resourceType: event.args._resource_type as ResourceType,
            from: event.args._from,
            resourceId: event.args._resource_id.toNumber(),
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
        };
    }

    /**
     * It build a ResourceIndexStoredEvent given a generic Blockchain Event
     * @param {Event} event - Event - this is the event object that is returned from the contract.
     * @returns A ResourceIndexStoredEvent
     */
    static buildResourceIndexStoredEvent(event: Event): ResourceIndexStoredEvent {
        if (!event.args) { throw new ParsingException('event'); }
        return {
            resourceType: event.args._resource_type as ResourceType,
            from: event.args._from,
            reader: event.args._reader,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
        };
    }

    /**
     * It build a ResourceUpdatedEvent given a generic Blockchain Event
     * @param {Event} event - Event - this is the event object that is returned from the contract.
     * @returns A ResourceUpdatedEvent
     */
    static buildResourceUpdatedEvent(event: Event): ResourceUpdatedEvent {
        if (!event.args) { throw new ParsingException('event'); }
        return {
            resourceType: event.args._resource_type as ResourceType,
            from: event.args._from,
            resourceId: event.args._resource_id.toNumber(),
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
        };
    }
}
export default EventBuilder;
