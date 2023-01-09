import { Node } from './Node';
import { Edge } from './Edge';

export class GraphData {
    private _nodes: Node[];

    private _edges: Edge[];

    /**
     * Object representing the data required to represent a graph.
     * @param {Node[]} nodes - Nodes of the graph, representing a transformation.
     * @param {Edge[]} edges - Edges of the graph, representing a trade.
     */
    constructor(nodes: Node[], edges: Edge[]) {
        this._nodes = nodes;
        this._edges = edges;
    }

    get nodes(): Node[] {
        return this._nodes;
    }

    get edges(): Edge[] {
        return this._edges;
    }
}
