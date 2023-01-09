import TransformationEvent from '../../entities/standard/TransformationEvent';
import TransformationEventJsonStandardSerializer from './TransformationEventJsonStandardSerializer';

describe('TransformationEventJsonStandardSerializer', () => {
    let transformationEventJsonStandardSerializer: TransformationEventJsonStandardSerializer;

    const transformationEvent = new TransformationEvent(
        [],
        [],
        [{ productClass: 'materialIn1', quantity: '', uom: '' }],
        [{ productClass: 'materialOut1', quantity: '', uom: '' }],
        '',
        '2020-07-10 15:00:00.000',
        '',
        '',
        'processType1',
        '',
        '',
        [{
            referenceStandard: 'processingStandard1',
            certificateID: '',
            evidenceURL: '',
            assessmentLevel: '',
            criteriaList: [],
            responsibleAgency: { partyID: '', name: '' },
        }],
    );

    beforeAll(() => {
        transformationEventJsonStandardSerializer = new TransformationEventJsonStandardSerializer();
    });

    it('should correctly serialize a TransformationEvent', () => {
        const result = transformationEventJsonStandardSerializer.serialize(transformationEvent);

        expect(result).toEqual(JSON.stringify({
            outputItemList: transformationEvent.outputItemList,
            inputItemList: transformationEvent.inputItemList,
            inputQuantityList: transformationEvent.inputQuantityList,
            outputQuantityList: transformationEvent.outputQuantityList,
            eventType: transformationEvent.eventType,
            eventTime: transformationEvent.eventTime,
            actionCode: transformationEvent.actionCode,
            dispositionCode: transformationEvent.dispositionCode,
            businessStepCode: transformationEvent.businessStepCode,
            readPointId: transformationEvent.readPointId,
            locationId: transformationEvent.locationId,
            certifications: transformationEvent.certifications,
        }));
    });

    it('should correctly deserialize a TransformationEvent', () => {
        const serialized = JSON.stringify({
            outputItemList: transformationEvent.outputItemList,
            inputItemList: transformationEvent.inputItemList,
            inputQuantityList: transformationEvent.inputQuantityList,
            outputQuantityList: transformationEvent.outputQuantityList,
            eventType: transformationEvent.eventType,
            eventTime: transformationEvent.eventTime,
            actionCode: transformationEvent.actionCode,
            dispositionCode: transformationEvent.dispositionCode,
            businessStepCode: transformationEvent.businessStepCode,
            readPointId: transformationEvent.readPointId,
            locationId: transformationEvent.locationId,
            certifications: transformationEvent.certifications,
        });

        const result = transformationEventJsonStandardSerializer.deserialize(serialized);

        expect(result).toEqual(transformationEvent);
    });
});
