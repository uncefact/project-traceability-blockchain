/* eslint-disable class-methods-use-this */
import EntitySerializer from './EntitySerializer.interface';
import Transformation from '../entities/Transformation';

export class TransformationJsonSerializer implements EntitySerializer<Transformation> {
    /**
     * It takes a Transformation object and returns a string that contains the JSON representation of the
     * object
     * @param {Transformation} t - Transformation - the object to be converted to JSON
     * @returns A string
     */
    serialize(t: Transformation): string {
        return JSON.stringify({
            id: t.id,
            ownerAddress: t.ownerAddress,
            materialsInIds: t.materialsInIds,
            materialOutId: t.materialOutId,
            name: t.name,
            startDate: t.startDate,
            endDate: t.endDate,
            processTypes: t.processTypes,
            processingStds: t.processingStds,
            sourceUrl: t.sourceUrl,
        });
    }

    /**
     * It takes a JSON string and returns a Transformation object
     * @param {string} serializedT - string - the JSON string to be converted to a Transformation object
     * @returns A new instance of the Transformation class.
     */
    deserialize(serializedT: string): Transformation {
        const plainObject = JSON.parse(serializedT);
        return new Transformation(
            plainObject.materialsInIds,
            plainObject.materialOutId,
            plainObject.name,
            new Date(Date.parse(plainObject.startDate)),
            new Date(Date.parse(plainObject.endDate)),
            plainObject.processTypes,
            plainObject.processingStds,
            plainObject.sourceUrl,
            plainObject.id,
            plainObject.ownerAddress,
        );
    }
}
export default TransformationJsonSerializer;
