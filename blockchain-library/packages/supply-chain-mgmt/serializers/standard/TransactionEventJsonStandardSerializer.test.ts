import TransactionEvent from '../../entities/standard/TransactionEvent';
import TransactionEventJsonStandardSerializer from './TransactionEventJsonStandardSerializer';

describe('TransactionEventJsonStandardSerializer', () => {
    let transactionEventJsonStandardSerializer: TransactionEventJsonStandardSerializer;

    const transactionEvent = new TransactionEvent(
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

    beforeAll(() => {
        transactionEventJsonStandardSerializer = new TransactionEventJsonStandardSerializer();
    });

    it('should correctly serialize a TransactionEvent', () => {
        const result = transactionEventJsonStandardSerializer.serialize(transactionEvent);

        expect(result).toEqual(JSON.stringify({
            sourceParty: transactionEvent.sourceParty,
            destinationParty: transactionEvent.destinationParty,
            itemList: transactionEvent.itemList,
            quantityList: transactionEvent.quantityList,
            eventType: transactionEvent.eventType,
            eventTime: transactionEvent.eventTime,
            actionCode: transactionEvent.actionCode,
            dispositionCode: transactionEvent.dispositionCode,
            businessStepCode: transactionEvent.businessStepCode,
            readPointId: transactionEvent.readPointId,
            locationId: transactionEvent.locationId,
            certifications: transactionEvent.certifications,
            transaction: transactionEvent.transaction,
        }));
    });

    it('should correctly deserialize a TransactionEvent', () => {
        const serialized = JSON.stringify({
            sourceParty: transactionEvent.sourceParty,
            destinationParty: transactionEvent.destinationParty,
            itemList: transactionEvent.itemList,
            quantityList: transactionEvent.quantityList,
            eventType: transactionEvent.eventType,
            eventTime: transactionEvent.eventTime,
            actionCode: transactionEvent.actionCode,
            dispositionCode: transactionEvent.dispositionCode,
            businessStepCode: transactionEvent.businessStepCode,
            readPointId: transactionEvent.readPointId,
            locationId: transactionEvent.locationId,
            certifications: transactionEvent.certifications,
            transaction: transactionEvent.transaction,
        });

        const result = transactionEventJsonStandardSerializer.deserialize(serialized);

        expect(result).toEqual(transactionEvent);
    });
});
