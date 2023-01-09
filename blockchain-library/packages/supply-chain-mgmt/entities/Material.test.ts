import Material from './Material';

describe('Material', () => {
    let material: Material;

    beforeAll(() => {
        material = new Material('testName', [], 'http://test.source.url', 'mat42', 'testOwnerAddress');
    });

    it('should correctly initialize a new Material', () => {
        expect(material.id).toEqual('mat42');
        expect(material.name).toEqual('testName');
        expect(material.productTypes).toEqual([]);
        expect(material.sourceUrl).toEqual('http://test.source.url');
    });
});
