import { createMock } from 'ts-auto-mock';
import { Event } from 'ethers';
import EventBuilder from './EventBuilder';
import ParsingException from '../exceptions/ParsingException';

describe('EventBuilder', () => {
    it.each([
        {
            buildFunctionName: 'buildResourceStoredEvent',
            mockedEvent: createMock<Event>({
                args: {
                    _resource_type: 'material',
                    _from: 'foo',
                    _resource_id: {
                        toNumber: () => 42,
                    },
                },
                transactionHash: 'bar',
                blockNumber: 43,
            }),
            expectedEvent: {
                resourceType: 'material',
                from: 'foo',
                resourceId: 42,
                transactionHash: 'bar',
                blockNumber: 43,
            },
        },
        {
            buildFunctionName: 'buildResourceIndexStoredEvent',
            mockedEvent: createMock<Event>({
                args: {
                    _resource_type: 'material',
                    _from: 'foo',
                    _reader: 'bar',
                },
                transactionHash: 'baz',
                blockNumber: 43,
            }),
            expectedEvent: {
                resourceType: 'material',
                from: 'foo',
                reader: 'bar',
                transactionHash: 'baz',
                blockNumber: 43,
            },
        },
        {
            buildFunctionName: 'buildResourceUpdatedEvent',
            mockedEvent: createMock<Event>({
                args: {
                    _resource_type: 'material',
                    _from: 'foo',
                    _resource_id: {
                        toNumber: () => 42,
                    },
                },
                transactionHash: 'bar',
                blockNumber: 43,
            }),
            expectedEvent: {
                resourceType: 'material',
                from: 'foo',
                resourceId: 42,
                transactionHash: 'bar',
                blockNumber: 43,
            },
        },
    ])('should build Event when calling $buildFunctionName', ({ buildFunctionName, mockedEvent, expectedEvent }) => {
        const result = (EventBuilder as any)[buildFunctionName](mockedEvent);

        expect(result).toEqual(expectedEvent);
    });

    it.each([
        {
            buildFunctionName: 'buildResourceStoredEvent',
        },
        {
            buildFunctionName: 'buildResourceIndexStoredEvent',
        },
        {
            buildFunctionName: 'buildResourceUpdatedEvent',
        },
    ])('should throw ParsingException when calling $buildFunctionName', ({ buildFunctionName }) => {
        const mockedEvent = createMock<Event>({
            args: undefined,
        });
        const fn = () => (EventBuilder as any)[buildFunctionName](mockedEvent);

        expect(fn).toThrow(ParsingException);
    });
});
