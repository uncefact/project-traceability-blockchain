/* eslint-disable class-methods-use-this */
import EntitySerializer from './EntitySerializer.interface';
import Trade from '../entities/Trade';

export class TradeJsonSerializer implements EntitySerializer<Trade> {
    /**
     * It takes a Trade object and returns a string that contains the JSON representation of the
     * object
     * @param {Trade} t - Trade - the object to be converted to JSON
     * @returns A string
     */
    serialize(t: Trade): string {
        return JSON.stringify({
            materialsIds: t.materialsIds,
            name: t.name,
            processTypes: t.processTypes,
            processingStds: t.processingStds,
            consigneeCompanyId: t.consigneeCompanyId,
            sourceUrl: t.sourceUrl,
            id: t.id,
            ownerAddress: t.ownerAddress,
        });
    }

    /**
     * It takes a JSON string and returns a Trade object
     * @param {string} serializedT - string - the JSON string to be converted to a Trade object
     * @returns A new instance of the Trade class.
     */
    deserialize(serializedT: string): Trade {
        const plainObject = JSON.parse(serializedT);
        return new Trade(
            plainObject.materialsIds,
            plainObject.name,
            plainObject.processTypes,
            plainObject.processingStds,
            plainObject.consigneeCompanyId,
            plainObject.sourceUrl,
            plainObject.id,
            plainObject.ownerAddress,
        );
    }
}
export default TradeJsonSerializer;
