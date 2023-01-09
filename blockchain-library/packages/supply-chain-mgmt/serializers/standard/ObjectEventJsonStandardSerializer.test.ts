import ObjectEvent, { Certification } from '../../entities/standard/ObjectEvent';
import ObjectEventJsonStandardSerializer from './ObjectEventJsonStandardSerializer';

describe('ObjectEventJsonStandardSerializer', () => {
    let objectEventJsonStandardSerializer: ObjectEventJsonStandardSerializer;

    const objectEvent = new ObjectEvent(
        [],
        [],
        'eventTypeTest',
        '2020-07-10 15:00:00.000',
        'actionCodeTest',
        'dispositionCodeTest',
        'businessStepCodeTest',
        'readPointIdTest',
        'locationIdTest',
        [
            {
                certificateID: 'certificateID1Test',
                referenceStandard: 'referenceStandard1Test',
                assessmentLevel: 'third-party',
            } as Certification,
            {
                certificateID: 'certificateID2Test',
                referenceStandard: 'referenceStandard2Test',
                assessmentLevel: 'third-party',
            } as Certification,
        ],
    );

    beforeAll(() => {
        objectEventJsonStandardSerializer = new ObjectEventJsonStandardSerializer();
    });

    it('should correctly serialize a TransformationEvent', () => {
        const result = objectEventJsonStandardSerializer.serialize(objectEvent);

        expect(result).toEqual(JSON.stringify({
            itemList: objectEvent.itemList,
            quantityList: objectEvent.quantityList,
            eventType: objectEvent.eventType,
            eventTime: objectEvent.eventTime,
            actionCode: objectEvent.actionCode,
            dispositionCode: objectEvent.dispositionCode,
            businessStepCode: objectEvent.businessStepCode,
            readPointId: objectEvent.readPointId,
            certifications: objectEvent.certifications,
            locationId: objectEvent.locationId,
        }));
    });

    it('should correctly deserialize a TransformationEvent', () => {
        const serialized = JSON.stringify({
            itemList: objectEvent.itemList,
            quantityList: objectEvent.quantityList,
            eventType: objectEvent.eventType,
            eventTime: objectEvent.eventTime,
            actionCode: objectEvent.actionCode,
            dispositionCode: objectEvent.dispositionCode,
            businessStepCode: objectEvent.businessStepCode,
            readPointId: objectEvent.readPointId,
            certifications: objectEvent.certifications,
            locationId: objectEvent.locationId,
        });

        const result = objectEventJsonStandardSerializer.deserialize(serialized);

        expect(result).toEqual(objectEvent);
    });
});
