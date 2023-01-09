import TransactionEvent from './TransactionEvent';

describe('TransactionEvent', () => {
    let transactionEvent: TransactionEvent;
    const eventTime = '2020-07-10 15:00:00.000';

    beforeAll(() => {
        transactionEvent = new TransactionEvent(
            { partyID: 'sourceID', name: 'agency name 1' },
            { partyID: 'destinationID', name: 'agency name 2' },
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
            { type: 'tr', identifier: 'idTrans', documentURL: 'url' },
        );
    });

    it('should correctly initialize a new TransactionEvent', () => {
        expect(transactionEvent.sourceParty).toEqual({ partyID: 'sourceID', name: 'agency name 1' });
        expect(transactionEvent.destinationParty).toEqual({ partyID: 'destinationID', name: 'agency name 2' });
        expect(transactionEvent.transaction).toEqual({ type: 'tr', identifier: 'idTrans', documentURL: 'url' });
        expect(transactionEvent.itemList).toEqual([]);
        expect(transactionEvent.quantityList).toEqual([{ productClass: 'material1', quantity: '', uom: '' }]);
        expect(transactionEvent.eventType).toEqual('');
        expect(transactionEvent.eventTime).toEqual(eventTime);
        expect(transactionEvent.actionCode).toEqual('');
        expect(transactionEvent.dispositionCode).toEqual('');
        expect(transactionEvent.businessStepCode).toEqual('processType1');
        expect(transactionEvent.readPointId).toEqual('');
        expect(transactionEvent.locationId).toEqual('');
        expect(transactionEvent.certifications).toEqual([{
            referenceStandard: 'processingStandard1',
            certificateID: '',
            evidenceURL: '',
            assessmentLevel: '',
            criteriaList: [],
            responsibleAgency: { partyID: '', name: '' },
        }]);
    });
});
