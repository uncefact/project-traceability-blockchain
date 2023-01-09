import { Node } from './Node';
import { Edge } from './Edge';
import { GraphData } from './GraphData';
import { StatusType } from './StatusType';

describe('GraphData', () => {
    let graphData: GraphData;
    let nodes: Array<Node>;
    let edges: Array<Edge>;

    beforeAll(() => {
        nodes = [
            new Node('node42', 'testNodeLabel0', StatusType.DEFAULT),
            new Node('node43', 'testNodeLabel1', StatusType.FULLY_COMPLIANT),
        ];

        edges = [
            new Edge('node42', 'node43', 'testEdgeLabel', StatusType.PARTIALLY_COMPLIANT),
        ];

        graphData = new GraphData(
            nodes,
            edges,
        );
    });

    it('should correctly construct a GraphData object', () => {
        expect(graphData.nodes).toEqual(nodes);
        expect(graphData.edges).toEqual(edges);
    });
});
