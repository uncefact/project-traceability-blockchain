/* eslint-disable no-unused-vars */
import { Edge } from '../entities/graph-entities/Edge';
import { GraphData } from '../entities/graph-entities/GraphData';
import { Node } from '../entities/graph-entities/Node';
import { CustomCheck } from '../types/CustomCheck.type';
import Material from '../entities/Material';
import Transformation from '../entities/Transformation';
import Trade from '../entities/Trade';
import Certificate from '../entities/Certificate';
import { EntityEthersDriver } from '../drivers/EntityEthersDriver.interface';
import { SupplyChainUtils } from '../utils/SupplyChainUtils';

export class SupplyChainService {
    private _materials: Array<Material>;

    private _transformations: Array<Transformation>;

    private _trades: Array<Trade>;

    private _certificates: Array<Certificate>;

    constructor(
        materialDriver: EntityEthersDriver<Material>,
        transformationDriver: EntityEthersDriver<Transformation>,
        tradeDriver: EntityEthersDriver<Trade>,
        // FIXME: Certificate driver
    ) {
        // TODO: Retrieve from blockchain
        this._materials = [];
        this._transformations = [];
        this._trades = [];
        this._certificates = [];
    }

    // TODO: Remove when data are retrieved from blockchain
    public setSupplyChainData(
        materials: Array<Material>,
        transformations: Array<Transformation>,
        trades: Array<Trade>,
        certificates: Array<Certificate>,
    ) {
        this._materials = materials;
        this._transformations = transformations;
        this._trades = trades;
        this._certificates = certificates;
    }

    public computeGraphData = (
        materialId: string,
        processingStds: Array<string>,
        customChecks: CustomCheck[],
        partialGraphData?: GraphData,
    ): GraphData => {
        let _graphData = partialGraphData || new GraphData([], []);

        const transformation = SupplyChainUtils.findTransformationByMaterialOutput(
            this._transformations,
            materialId,
        );
        if (!transformation) { return _graphData; }

        const node = new Node(
            transformation.id,
            transformation?.name,
            SupplyChainUtils.evaluateTranformationStatus(
                this._transformations,
                this._certificates,
                processingStds,
                transformation,
                _graphData.nodes.map((n) => n.id),
                customChecks,
            ),
        );
        _graphData.nodes.push(node);

        transformation
            .materialsInIds
            .forEach((mId: string) => {
                const trades = SupplyChainUtils.findTradesByMaterialOutput(
                    this._trades,
                    mId,
                );

                // there is no trade as input of the current transformation
                if (trades.length === 0) {
                    return;
                }
                _graphData.edges
                    .push(
                        // we only care for one of the many trades to represent it graphically
                        ...trades[0]
                            .materialsIds
                            .map((materialTuple) => {
                                _graphData = this.computeGraphData(materialTuple[0], processingStds, customChecks, _graphData);
                                return materialTuple;
                            })
                            .flatMap((materialTuple) => {
                                const transformationFrom = SupplyChainUtils.findTransformationByMaterialOutput(
                                    this._transformations,
                                    materialTuple[0],
                                );
                                if (!transformationFrom) { return []; }

                                const nodeFromId = transformationFrom.id;
                                const nodeToId = transformation.id;

                                return new Edge(
                                    nodeFromId,
                                    nodeToId,
                                    trades.map((t) => t.name).join(', '),
                                    SupplyChainUtils.evaluateTradesStatus(
                                        this._certificates,
                                        processingStds,
                                        trades,
                                    ),
                                );
                            }),
                    );
            });

        return _graphData;
    };
}
