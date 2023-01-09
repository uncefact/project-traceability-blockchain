/* eslint-disable class-methods-use-this */
import EntitySerializer from './EntitySerializer.interface';
import Material from '../entities/Material';

export class MaterialJsonSerializer implements EntitySerializer<Material> {
    /**
     * It takes a Material object and returns a string that contains the JSON representation of the
     * object
     * @param {Material} t - Material - the object to be converted to JSON
     * @returns A string
     */
    serialize(t: Material): string {
        return JSON.stringify({
            name: t.name,
            productTypes: t.productTypes,
            sourceUrl: t.sourceUrl,
            id: t.id,
            ownerAddress: t.ownerAddress,
        });
    }

    /**
     * It takes a JSON string and returns a Material object
     * @param {string} serializedT - string - the JSON string to be converted to a Material object
     * @returns A new instance of the Material class.
     */
    deserialize(serializedT: string): Material {
        const plainObject = JSON.parse(serializedT);
        return new Material(
            plainObject.name,
            plainObject.productTypes,
            plainObject.sourceUrl,
            plainObject.id,
            plainObject.ownerAddress,
        );
    }
}
export default MaterialJsonSerializer;
