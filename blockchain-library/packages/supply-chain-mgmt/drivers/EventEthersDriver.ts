/* eslint-disable camelcase */
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import EventBuilder from '../builders/EventBuilder';
import { UneceCottonTracking__factory } from '../smart-contracts';
import IdentityEthersDriver from './IdentityEthersDriver';

/* It provides a way to retrieve events from the contract */
export class EventEthersDriver {
    private _identityDriver: IdentityEthersDriver;

    private _contract: Contract;

    constructor(
        identityDriver: IdentityEthersDriver,
        provider: JsonRpcProvider,
        contractAddress: string,
    ) {
        this._identityDriver = identityDriver;
        this._contract = UneceCottonTracking__factory
            .connect(contractAddress, provider)
            .connect(identityDriver.wallet);
    }

    /**
     * It returns an array of ResourceStored events, which are built from the events emitted by the contract.
     * @returns An array of ResourceStoredEvent objects.
     */
    async retrieveResourceStoredEvents() {
        const filter = this._contract.filters.ResourceStored();

        return (await this._contract.queryFilter(filter)).map((event) => EventBuilder.buildResourceStoredEvent(event));
    }

    /**
     * It returns an array of ResourceIndexStoredEvent events, which are built from the events emitted by the contract.
     * @returns An array of ResourceIndexStoredEvent objects.
     */
    async retrieveResourceIndexStoredEvents() {
        const filter = this._contract.filters.ResourceIndexStored();
        return (await this._contract.queryFilter(filter)).map((event) => EventBuilder.buildResourceIndexStoredEvent(event));
    }

    /**
     * It returns an array of ResourceUpdatedEvent events, which are built from the events emitted by the contract.
     * @returns An array of ResourceUpdatedEvent objects.
     */
    async retrieveResourceUpdatedEvents() {
        const filter = this._contract.filters.ResourceUpdated();
        return (await this._contract.queryFilter(filter)).map((event) => EventBuilder.buildResourceUpdatedEvent(event));
    }

    /**
     * Retrieve all the events that have been stored for the resource and the resource index
     * @returns An object with two properties: resouceStoredEvents (array of ResourceStoredEvents) and resourceIndexStoredEvents (array of ResourceIndexStoredEvents).
     */
    async retrieveEvents() {
        return {
            resouceStoredEvents: await this.retrieveResourceStoredEvents(),
            resourceIndexStoredEvents: await this.retrieveResourceIndexStoredEvents(),
            resourceUpdatedEvents: await this.retrieveResourceUpdatedEvents(),
        };
    }
}

export default EventEthersDriver;
