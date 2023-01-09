import { createMock } from 'ts-auto-mock';
import EventEthersDriver from '../drivers/EventEthersDriver';
import EventService from './EventService';

describe('EventService', () => {
    let eventService: EventService;

    let mockedEthersEventDriver: EventEthersDriver;

    const mockedRetrieveResourceStoredEvents = jest.fn().mockReturnValue('foo');
    const mockedRetrieveResourceIndexStoredEvents = jest.fn().mockReturnValue('bar');
    const mockedRetrieveResourceUpdatedEvents = jest.fn().mockReturnValue('bar');
    const mockedRetrieveEvents = jest.fn().mockReturnValue('baz');

    beforeAll(() => {
        mockedEthersEventDriver = createMock<EventEthersDriver>({
            retrieveResourceStoredEvents: mockedRetrieveResourceStoredEvents,
            retrieveResourceIndexStoredEvents: mockedRetrieveResourceIndexStoredEvents,
            retrieveResourceUpdatedEvents: mockedRetrieveResourceUpdatedEvents,
            retrieveEvents: mockedRetrieveEvents,
        });

        eventService = new EventService(mockedEthersEventDriver);
    });

    it.each([
        {
            retrieveFunctionName: 'retrieveResourceStoredEvents',
            driverReturnValue: mockedRetrieveResourceStoredEvents(),
        },
        {
            retrieveFunctionName: 'retrieveResourceIndexStoredEvents',
            driverReturnValue: mockedRetrieveResourceIndexStoredEvents(),
        },
        {
            retrieveFunctionName: 'retrieveResourceUpdatedEvents',
            driverReturnValue: mockedRetrieveResourceUpdatedEvents(),
        },
        {
            retrieveFunctionName: 'retrieveEvents',
            driverReturnValue: mockedRetrieveEvents(),
        },
    ])('should call the $retrieveFunctionName method of the provided driver', async ({ retrieveFunctionName, driverReturnValue }) => {
        const result = await (eventService as any)[retrieveFunctionName]();

        expect(result).toEqual(driverReturnValue);
    });
});
