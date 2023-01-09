import { createMock } from 'ts-auto-mock';
import EntityService from './EntityService';
import Material from '../entities/Material';
import { EntityEthersDriver } from '../drivers/EntityEthersDriver.interface';

describe('EntityService', () => {
    const testPublicKey = 'testPublicKey';
    const testAddress = 'testAddress';

    const testMaterial = new Material('testName', [], 'http://test.source.url', 'matID', 'testOwner');

    let entityService: EntityService<Material>;
    let mockedEthersEntityDriver: EntityEthersDriver<Material>;

    const mockedStore = jest.fn();
    const mockedUpdate = jest.fn();
    const mockedAllowRead = jest.fn();
    const mockedRetrieve = jest.fn();
    const mockedRetrieveAll = jest.fn();

    beforeAll(() => {
        mockedEthersEntityDriver = createMock<EntityEthersDriver<Material>>({
            store: mockedStore,
            update: mockedUpdate,
            allowRead: mockedAllowRead,
            retrieve: mockedRetrieve,
            retrieveAll: mockedRetrieveAll,
        });

        entityService = new EntityService(mockedEthersEntityDriver);
    });

    it.each([
        {
            serviceFunctionName: 'store',
            serviceFunction: () => entityService.store(testMaterial, testPublicKey, testAddress),
            expectedMockedFunction: mockedStore,
            expectedMockedFunctionArgs: [testMaterial],
        },
        {
            serviceFunctionName: 'update',
            serviceFunction: () => entityService.update(testMaterial),
            expectedMockedFunction: mockedUpdate,
            expectedMockedFunctionArgs: [testMaterial],
        },
        {
            serviceFunctionName: 'allowRead',
            serviceFunction: () => entityService.allowRead('matID', testPublicKey, testAddress),
            expectedMockedFunction: mockedAllowRead,
            expectedMockedFunctionArgs: ['matID', testPublicKey, testAddress],
        },
        {
            serviceFunctionName: 'retrieve',
            serviceFunction: () => entityService.retrieve('matID'),
            expectedMockedFunction: mockedRetrieve,
            expectedMockedFunctionArgs: ['matID'],
        },
        {
            serviceFunctionName: 'retrieveAll',
            serviceFunction: () => entityService.retrieveAll(),
            expectedMockedFunction: mockedRetrieveAll,
            expectedMockedFunctionArgs: [],
        },
    ])('should call driver $serviceFunctionName', async ({ serviceFunction, expectedMockedFunction, expectedMockedFunctionArgs }) => {
        await serviceFunction();

        expect(expectedMockedFunction).toHaveBeenCalledTimes(1);
        expect(expectedMockedFunction).toHaveBeenNthCalledWith(1, ...expectedMockedFunctionArgs);
    });
});
