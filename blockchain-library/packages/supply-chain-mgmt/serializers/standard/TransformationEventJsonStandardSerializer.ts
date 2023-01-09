/* eslint-disable class-methods-use-this */
import EntitySerializer from '../EntitySerializer.interface';
import TransformationEvent from '../../entities/standard/TransformationEvent';

export class TransformationEventJsonStandardSerializer implements EntitySerializer<TransformationEvent> {
    /**
     * It takes a Material object and returns a string that contains the JSON representation of the
     * object
     * @param {TransformationEvent} t - TransformationEvent - the object to be converted to JSON
     * @returns A string
     */
    serialize(t: TransformationEvent): string {
        return JSON.stringify({
            outputItemList: t.outputItemList,
            inputItemList: t.inputItemList,
            inputQuantityList: t.inputQuantityList,
            outputQuantityList: t.outputQuantityList,
            eventType: t.eventType,
            eventTime: t.eventTime,
            actionCode: t.actionCode,
            dispositionCode: t.dispositionCode,
            businessStepCode: t.businessStepCode,
            readPointId: t.readPointId,
            locationId: t.locationId,
            certifications: t.certifications,
        });
    }

    /**
     * It takes a JSON string and returns a TransformationEvent object
     * @param {string} serializedT - string - the JSON string to be converted to a TransformationEvent object
     * @returns A new instance of the TransformationEvent class.
     */
    deserialize(serializedT: string): TransformationEvent {
        const plainObject = JSON.parse(serializedT);
        return new TransformationEvent(
            plainObject.outputItemList,
            plainObject.inputItemList,
            plainObject.inputQuantityList,
            plainObject.outputQuantityList,
            plainObject.eventType,
            plainObject.eventTime,
            plainObject.actionCode,
            plainObject.dispositionCode,
            plainObject.businessStepCode,
            plainObject.readPointId,
            plainObject.locationId,
            plainObject.certifications,
        );
    }
}
export default TransformationEventJsonStandardSerializer;
