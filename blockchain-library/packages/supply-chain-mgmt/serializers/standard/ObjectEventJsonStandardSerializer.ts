/* eslint-disable class-methods-use-this */
import EntitySerializer from '../EntitySerializer.interface';
import ObjectEvent from '../../entities/standard/ObjectEvent';

export class ObjectEventJsonStandardSerializer implements EntitySerializer<ObjectEvent> {
    serialize(t: ObjectEvent): string {
        return JSON.stringify({
            itemList: t.itemList,
            quantityList: t.quantityList,
            eventType: t.eventType,
            eventTime: t.eventTime,
            actionCode: t.actionCode,
            dispositionCode: t.dispositionCode,
            businessStepCode: t.businessStepCode,
            readPointId: t.readPointId,
            certifications: t.certifications,
            locationId: t.locationId,
        });
    }

    deserialize(serializedT: string): ObjectEvent {
        const plainObject = JSON.parse(serializedT);
        return new ObjectEvent(
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
        );
    }
}
export default ObjectEventJsonStandardSerializer;
