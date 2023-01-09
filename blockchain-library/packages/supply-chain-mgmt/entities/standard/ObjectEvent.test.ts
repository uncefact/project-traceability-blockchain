import ObjectEvent from './ObjectEvent';

describe('ObjectEvent', () => {
    let objectEvent: ObjectEvent;
    const eventTime = '2020-07-10 15:00:00.000';

    beforeAll(() => {
        objectEvent = new ObjectEvent(
            [],
            [{ productClass: 'material1', quantity: '', uom: '' }],
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

    it('should correctly initialize a new ObjectEvent', () => {
        expect(objectEvent.itemList).toEqual([]);
        expect(objectEvent.quantityList).toEqual([{ productClass: 'material1', quantity: '', uom: '' }]);
        expect(objectEvent.eventType).toEqual('');
        expect(objectEvent.eventTime).toEqual(eventTime);
        expect(objectEvent.actionCode).toEqual('');
        expect(objectEvent.dispositionCode).toEqual('');
        expect(objectEvent.businessStepCode).toEqual('processType1');
        expect(objectEvent.readPointId).toEqual('');
        expect(objectEvent.locationId).toEqual('');
        expect(objectEvent.certifications).toEqual([{
            referenceStandard: 'processingStandard1',
            certificateID: '',
            evidenceURL: '',
            assessmentLevel: '',
            criteriaList: [],
            responsibleAgency: { partyID: '', name: '' },
        }]);
    });
});
