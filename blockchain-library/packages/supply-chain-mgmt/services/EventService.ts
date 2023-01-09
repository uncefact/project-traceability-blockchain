import EventEthersDriver from '../drivers/EventEthersDriver';

/* This class is used to retrieve events from the contract */
export class EventService {
    private _driver: EventEthersDriver;

    /**
     * @param {EventEthersDriver} driver - EthersEventDriver - The driver that is used to communicate with
     * the contract.
     */
    constructor(driver: EventEthersDriver) {
        this._driver = driver;
    }

    /**
     * Retrieve the "resource stored" events.
     * @returns An array of events.
     */
    async retrieveResourceStoredEvents() {
        return this._driver.retrieveResourceStoredEvents();
    }

    /**
     * Retrieve the "resource index stored" events.
     * @returns An array of events.
     */
    async retrieveResourceIndexStoredEvents() {
        return this._driver.retrieveResourceIndexStoredEvents();
    }

    /**
     * Retrieve the "resource updated" events.
     * @returns An array of events.
     */
    async retrieveResourceUpdatedEvents() {
        return this._driver.retrieveResourceUpdatedEvents();
    }

    /**
     * Retrieve all the events from the driver.
     * @returns An array of events.
     */
    async retrieveEvents() {
        return this._driver.retrieveEvents();
    }
}

export default EventService;
