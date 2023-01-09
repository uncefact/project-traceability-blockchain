/* eslint-disable camelcase */
import { createMock } from 'ts-auto-mock';
import { UrlJsonRpcProvider } from '@ethersproject/providers';
import { Event } from 'ethers';
import EventEthersDriver from './EventEthersDriver';
import EventBuilder from '../builders/EventBuilder';
import IdentityEthersDriver from './IdentityEthersDriver';
import { UneceCottonTracking, UneceCottonTracking__factory } from '../smart-contracts';
import ParsingException from '../exceptions/ParsingException';

describe('EventEthersDriver', () => {
    let mockedIdentityDriver: IdentityEthersDriver;
    let mockedProvider: UrlJsonRpcProvider;

    const testAddress = '0x6C9E9ADB5F57952434A4148b401502d9c6C70318';

    const mockedContractConnect = jest.fn();

    const mockedResourceStoredFilter = jest.fn();
    const mockedResourceIndexStoredFilter = jest.fn();
    const mockedResourceUpdatedFilter = jest.fn();
    const mockedQueryFilter = jest.fn();

    let ethersEventDriver: EventEthersDriver;

    beforeAll(() => {
        mockedContractConnect.mockReturnValue({
            filters: {
                ResourceStored: mockedResourceStoredFilter,
                ResourceIndexStored: mockedResourceIndexStoredFilter,
                ResourceUpdated: mockedResourceUpdatedFilter,
            },
            queryFilter: mockedQueryFilter,
        });
        const mockedUneceCottonTracking = createMock<UneceCottonTracking>({
            connect: mockedContractConnect,
        });
        jest.spyOn(UneceCottonTracking__factory, 'connect').mockReturnValue(mockedUneceCottonTracking);

        mockedIdentityDriver = createMock<IdentityEthersDriver>();

        mockedProvider = createMock<UrlJsonRpcProvider>({
            _isProvider: true,
        });

        ethersEventDriver = new EventEthersDriver(
            mockedIdentityDriver,
            mockedProvider,
            testAddress,
        );
    });

    it.each([
        {
            mockedEvent: createMock<Event>({
                args: {
                    _resource_type: 'material',
                    _from: 'foo',
                    _resource_id: {
                        toNumber: () => 42,
                    },
                },
            }),
            retrieveFunctionName: 'retrieveResourceStoredEvents',
            buildEventFunctionName: 'buildResourceStoredEvent',
        },
        {
            mockedEvent: createMock<Event>({
                args: {
                    _resource_type: 'material',
                    _from: 'foo',
                    _reader: 'bar',
                },
            }),
            retrieveFunctionName: 'retrieveResourceIndexStoredEvents',
            buildEventFunctionName: 'buildResourceIndexStoredEvent',
        },
        {
            mockedEvent: createMock<Event>({
                args: {
                    _resource_type: 'material',
                    _from: 'foo',
                    _resource_id: {
                        toNumber: () => 42,
                    },
                },
            }),
            retrieveFunctionName: 'retrieveResourceUpdatedEvents',
            buildEventFunctionName: 'buildResourceUpdatedEvent',
        },
    ])('should correctly $retrieveFunctionName', async ({ mockedEvent, retrieveFunctionName, buildEventFunctionName }) => {
        mockedQueryFilter.mockReturnValue([mockedEvent]);

        const result = await (ethersEventDriver as any)[retrieveFunctionName]();

        expect(result).toEqual([
            (EventBuilder as any)[buildEventFunctionName](mockedEvent),
        ]);
    });

    it.each([
        {
            retrieveFunctionName: 'retrieveResourceStoredEvents',
        },
        {
            retrieveFunctionName: 'retrieveResourceIndexStoredEvents',
        },
        {
            retrieveFunctionName: 'retrieveResourceUpdatedEvents',
        },
    ])('should return an empty list calling $retrieveFunctionName', async ({ retrieveFunctionName }) => {
        mockedQueryFilter.mockReturnValue([]);
        const result = await (ethersEventDriver as any)[retrieveFunctionName]();

        expect(result).toEqual([]);
    });

    it.each([
        {
            retrieveFunctionName: 'retrieveResourceStoredEvents',
        },
        {
            retrieveFunctionName: 'retrieveResourceIndexStoredEvents',
        },
        {
            retrieveFunctionName: 'retrieveResourceUpdatedEvents',
        },
    ])('should raise an exeption on bad data when calling $retrieveFunctionName', async ({ retrieveFunctionName }) => {
        mockedQueryFilter.mockReturnValue(['something wrong']);

        const fn = () => (ethersEventDriver as any)[retrieveFunctionName]();
        expect(fn).rejects.toThrow(ParsingException);
    });

    it('should correctly retrieveEvents', async () => {
        const mockedResourceStoredEvent = createMock<Event>({
            args: {
                _resource_type: 'material',
                _from: 'foo',
                _resource_id: {
                    toNumber: () => 42,
                },
            },
        });
        const mockedResouceIndexStoredEvent = createMock<Event>({
            args: {
                args: {
                    _resource_type: 'material',
                    _from: 'foo',
                    _reader: 'bar',
                },
            },
        });
        const mockedResourceUpdatedEvent = createMock<Event>({
            args: {
                _resource_type: 'material',
                _from: 'foo',
                _resource_id: {
                    toNumber: () => 42,
                },
            },
        });
        mockedQueryFilter.mockReturnValueOnce([mockedResourceStoredEvent]);
        mockedQueryFilter.mockReturnValueOnce([mockedResouceIndexStoredEvent]);
        mockedQueryFilter.mockReturnValueOnce([mockedResourceUpdatedEvent]);

        const result = await ethersEventDriver.retrieveEvents();

        expect(result).toEqual({
            resouceStoredEvents: [EventBuilder.buildResourceStoredEvent(mockedResourceStoredEvent)],
            resourceIndexStoredEvents: [EventBuilder.buildResourceIndexStoredEvent(mockedResouceIndexStoredEvent)],
            resourceUpdatedEvents: [EventBuilder.buildResourceUpdatedEvent(mockedResourceUpdatedEvent)],
        });
    });
});
