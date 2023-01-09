import { Node } from './Node';
import { StatusType } from './StatusType';

describe('Node', () => {
    let node: Node;

    beforeAll(() => {
        node = new Node(
            'node42',
            'testNodeLabel0',
            StatusType.DEFAULT,
        );
    });

    it('should correctly initialize a Node', () => {
        expect(node.id).toEqual('node42');
        expect(node.label).toEqual('testNodeLabel0');
        expect(node.status).toEqual(StatusType.DEFAULT);
    });
});
