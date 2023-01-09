import { Edge } from './Edge';
import { StatusType } from './StatusType';

describe('Edge', () => {
    let edge: Edge;

    beforeAll(() => {
        edge = new Edge(
            'node1',
            'node2',
            'testLabel',
            StatusType.DEFAULT,
        );
    });

    it('should correctly initialize a new Edge', () => {
        expect(edge.from).toEqual('node1');
        expect(edge.to).toEqual('node2');
        expect(edge.label).toEqual('testLabel');
        expect(edge.status).toEqual(StatusType.DEFAULT);
    });
});
