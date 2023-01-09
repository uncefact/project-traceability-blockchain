import { EntityEthersDriver } from '../drivers/EntityEthersDriver.interface';
import { Edge } from '../entities/graph-entities/Edge';
import { GraphData } from '../entities/graph-entities/GraphData';
import { Node } from '../entities/graph-entities/Node';
import { StatusType } from '../entities/graph-entities/StatusType';
import Material from '../entities/Material';
import Trade from '../entities/Trade';
import Transformation from '../entities/Transformation';
import { SupplyChainUtils } from '../utils/SupplyChainUtils';
import { SupplyChainService } from './SupplyChainService';

describe('SupplyChainService', () => {
    let supplyChainService: SupplyChainService;
    const mockedFindTransformationByMaterialOutput = jest.fn();
    const mockedEvaluateTranformationStatus = jest.fn();
    const mockedFindTradesByMaterialOutput = jest.fn();
    const mockedEvaluateTradesStatus = jest.fn();

    jest.spyOn(SupplyChainUtils, 'findTransformationByMaterialOutput').mockImplementation(mockedFindTransformationByMaterialOutput);
    jest.spyOn(SupplyChainUtils, 'evaluateTranformationStatus').mockImplementation(mockedEvaluateTranformationStatus);
    jest.spyOn(SupplyChainUtils, 'findTradesByMaterialOutput').mockImplementation(mockedFindTradesByMaterialOutput);
    jest.spyOn(SupplyChainUtils, 'evaluateTradesStatus').mockImplementation(mockedEvaluateTradesStatus);

    const processingStds = ['processingStd1'];
    const processTypes = ['processType1'];

    beforeAll(() => {
        supplyChainService = new SupplyChainService(
            {} as EntityEthersDriver<Material>,
            {} as EntityEthersDriver<Transformation>,
            {} as EntityEthersDriver<Trade>,
        );
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    // TODO: Remove when data are retrieved from blockchain
    it('setSupplyChainData test', () => {
        const trasformation = {} as Transformation;
        supplyChainService.setSupplyChainData(
            [],
            [trasformation],
            [],
            [],
        );
        const resp = supplyChainService.computeGraphData(
            'mat1',
            processingStds,
            [],
        );

        expect(resp).toEqual(new GraphData([], []));
        expect(mockedFindTransformationByMaterialOutput).toHaveBeenCalledTimes(1);
        expect(mockedFindTransformationByMaterialOutput).toHaveBeenNthCalledWith(1, [trasformation], 'mat1');
    });

    it('computeGraphData test - no transformations found for the given material', () => {
        mockedFindTransformationByMaterialOutput.mockReturnValueOnce(undefined);

        const resp = supplyChainService.computeGraphData(
            'mat1',
            processingStds,
            [],
        );

        expect(resp).toEqual(new GraphData([], []));
    });

    it('computeGraphData test - simple graph with only one node', () => {
        const transformation = new Transformation(
            [],
            'matOut2',
            'nameTest',
            new Date(),
            new Date(),
            processTypes,
            processingStds,
            'sourceUrlTest',
            'trans123',
            'ownerAddressTest',
        );

        mockedFindTransformationByMaterialOutput.mockReturnValueOnce(transformation);
        mockedEvaluateTranformationStatus.mockReturnValue(StatusType.FULLY_COMPLIANT);

        const resp = supplyChainService.computeGraphData(
            'mat1',
            processingStds,
            [],
        );

        expect(resp).toEqual(new GraphData([
            new Node(
                transformation.id,
                transformation.name,
                StatusType.FULLY_COMPLIANT,
            ),
        ], []));
    });

    it('computeGraphData test - simple graph two nodes and one edge', () => {
        const transformation1 = new Transformation(
            [],
            'matOut1',
            'name1Test',
            new Date(),
            new Date(),
            processTypes,
            processingStds,
            'sourceUrlTest',
            'trans123',
            'ownerAddressTest',
        );
        const transformation2 = new Transformation(
            ['matIn2'],
            'matOut3',
            'name2Test',
            new Date(),
            new Date(),
            processTypes,
            processingStds,
            'sourceUrlTest',
            'trans456',
            'ownerAddressTest',
        );
        const trade = new Trade(
            [['mat1', 'mat2']],
            'name3Test',
            processTypes,
            [],
            'consigneeID',
            'trade1234',
            /* The ID of the consignee of the trade. */
            'ownerAddressTest',
        );

        mockedFindTransformationByMaterialOutput.mockReturnValueOnce(transformation2);
        mockedFindTransformationByMaterialOutput.mockReturnValueOnce(transformation1);
        mockedFindTransformationByMaterialOutput.mockReturnValueOnce(transformation1);
        mockedFindTradesByMaterialOutput.mockReturnValueOnce([trade]);
        mockedEvaluateTranformationStatus.mockReturnValue(StatusType.FULLY_COMPLIANT);
        mockedEvaluateTradesStatus.mockReturnValue(StatusType.FULLY_COMPLIANT);

        const resp = supplyChainService.computeGraphData(
            'matOut3',
            processingStds,
            [],
        );

        expect(resp).toEqual(new GraphData([
            new Node(
                transformation2.id,
                transformation2.name,
                StatusType.FULLY_COMPLIANT,
            ),
            new Node(
                transformation1.id,
                transformation1.name,
                StatusType.FULLY_COMPLIANT,
            ),
        ], [
            new Edge(
                transformation1.id,
                transformation2.id,
                'name3Test',
                StatusType.FULLY_COMPLIANT,
            ),
        ]));
    });

    it('computeGraphData test - no trades found for the transformation', () => {
        const transformation2 = new Transformation(
            ['matIn2'],
            'matOut3',
            'name2Test',
            new Date(),
            new Date(),
            processTypes,
            processingStds,
            'sourceUrlTest',
            'trans456',
            'ownerAddressTest',
        );

        mockedFindTransformationByMaterialOutput.mockReturnValueOnce(transformation2);
        mockedFindTradesByMaterialOutput.mockReturnValueOnce([]);
        mockedEvaluateTranformationStatus.mockReturnValue(StatusType.FULLY_COMPLIANT);
        mockedEvaluateTradesStatus.mockReturnValue(StatusType.FULLY_COMPLIANT);

        const resp = supplyChainService.computeGraphData(
            'mat3',
            processingStds,
            [],
        );

        expect(resp).toEqual(new GraphData([
            new Node(
                transformation2.id,
                transformation2.name,
                StatusType.FULLY_COMPLIANT,
            ),
        ], []));
    });
    it('computeGraphData test - no transformation from found', () => {
        const transformation2 = new Transformation(
            ['matIn2'],
            'mat3',
            'name2Test',
            new Date(),
            new Date(),
            processTypes,
            processingStds,
            'sourceUrlTest',
            'trans456',
            'ownerAddressTest',
        );
        const trade = new Trade(
            [['mat1', 'mat2']],
            'name3Test',
            processTypes,
            [],
            'consigneeID',
            'trade123',
            'ownerAddressTest',
        );

        mockedFindTransformationByMaterialOutput.mockReturnValueOnce(transformation2);
        mockedFindTransformationByMaterialOutput.mockReturnValueOnce(undefined);
        mockedFindTradesByMaterialOutput.mockReturnValueOnce([trade]);
        mockedEvaluateTranformationStatus.mockReturnValue(StatusType.FULLY_COMPLIANT);
        mockedEvaluateTradesStatus.mockReturnValue(StatusType.FULLY_COMPLIANT);

        const resp = supplyChainService.computeGraphData(
            'mat3',
            processingStds,
            [],
        );

        expect(resp).toEqual(new GraphData([
            new Node(
                transformation2.id,
                transformation2.name,
                StatusType.FULLY_COMPLIANT,
            ),
        ], []));
    });
});
