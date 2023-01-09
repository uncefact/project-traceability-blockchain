import Material from '../entities/Material';
import { MaterialJsonSerializer } from './MaterialJsonSerializer';

describe('MaterialJsonSerializer', () => {
    let materialJsonSerializer: MaterialJsonSerializer;

    beforeAll(() => {
        materialJsonSerializer = new MaterialJsonSerializer();
    });

    it('should correctly serialize a Material', () => {
        const material = new Material(
            'testName',
            [],
            'http://test.source.url',
            'mat1',
            'testOwnerAddress',
        );

        const result = materialJsonSerializer.serialize(material);

        expect(result).toEqual(JSON.stringify({
            name: material.name,
            productTypes: material.productTypes,
            sourceUrl: material.sourceUrl,
            id: material.id,
            ownerAddress: material.ownerAddress,
        }));
    });

    it('should correctly deserialize a Material', () => {
        const material = new Material(
            'testName',
            [],
            'http://test.source.url',
            'mat1',
            'testOwnerAddress',
        );
        const serializedEbEvent = JSON.stringify({
            name: material.name,
            productTypes: material.productTypes,
            sourceUrl: material.sourceUrl,
            id: material.id,
            ownerAddress: material.ownerAddress,
        });

        const result = materialJsonSerializer.deserialize(serializedEbEvent);

        expect(result).toEqual(material);
    });
});
