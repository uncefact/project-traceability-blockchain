/* eslint-disable class-methods-use-this */
import EntitySerializer from '../EntitySerializer.interface';
import TransactionEvent from '../../entities/standard/TransactionEvent';

export class TransactionEventJsonStandardSerializer implements EntitySerializer<TransactionEvent> {
    /**
     * It takes a Material object and returns a string that contains the JSON representation of the
     * object
     * @param {TransactionEvent} t - TransactionEvent - the object to be converted to JSON
     * @returns A string
     */
    serialize(t: TransactionEvent): string {
        return JSON.stringify({
            sourceParty: t.sourceParty,
            destinationParty: t.destinationParty,
            itemList: t.itemList,
            quantityList: t.quantityList,
            eventType: t.eventType,
            eventTime: t.eventTime,
            actionCode: t.actionCode,
            dispositionCode: t.dispositionCode,
            businessStepCode: t.businessStepCode,
            readPointId: t.readPointId,
            locationId: t.locationId,
            certifications: t.certifications,
            transaction: t.transaction,
        });
    }

    /**
     * It takes a JSON string and returns a TransactionEvent object
     * @param {string} serializedT - string - the JSON string to be converted to a TransactionEvent object
     * @returns A new instance of the TransactionEvent class.
     */
    deserialize(serializedT: string): TransactionEvent {
        const plainObject = JSON.parse(serializedT);
        return new TransactionEvent(
            plainObject.sourceParty,
            plainObject.destinationParty,
            plainObject.itemList,
            plainObject.quantityList,
            plainObject.eventType,
            plainObject.eventTime,
            plainObject.actionCode,
            plainObject.dispositionCode,
            plainObject.businessStepCode,
            plainObject.readPointId,
            plainObject.locationId,
            plainObject.certifications,
            plainObject.transaction,
        );
    }
}
export default TransactionEventJsonStandardSerializer;
