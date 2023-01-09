import TransformationEvent from './TransformationEvent';

describe('TransformationEvent', () => {
    let transformationEvent: TransformationEvent;
    const eventTime = '2020-07-10 15:00:00.000';

    beforeAll(() => {
        transformationEvent = new TransformationEvent(
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
    });

    it('should correctly initialize a new TransformationEvent', () => {
        expect(transformationEvent.outputItemList).toEqual([]);
        expect(transformationEvent.inputItemList).toEqual([]);
        expect(transformationEvent.inputQuantityList).toEqual([{ productClass: 'materialIn1', quantity: '', uom: '' }]);
        expect(transformationEvent.outputQuantityList).toEqual([{ productClass: 'materialOut1', quantity: '', uom: '' }]);
        expect(transformationEvent.eventType).toEqual('');
        expect(transformationEvent.eventTime).toEqual(eventTime);
        expect(transformationEvent.actionCode).toEqual('');
        expect(transformationEvent.dispositionCode).toEqual('');
        expect(transformationEvent.businessStepCode).toEqual('processType1');
        expect(transformationEvent.readPointId).toEqual('');
        expect(transformationEvent.locationId).toEqual('');
        expect(transformationEvent.certifications).toEqual([{
            referenceStandard: 'processingStandard1',
            certificateID: '',
            evidenceURL: '',
            assessmentLevel: '',
            criteriaList: [],
            responsibleAgency: { partyID: '', name: '' },
        }]);
    });
});
