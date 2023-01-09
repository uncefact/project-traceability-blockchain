import { createMock } from 'ts-auto-mock';
import { nanoid } from 'nanoid';
import IdentityEthersDriver from '../../drivers/IdentityEthersDriver';
import CertificateEthersDriver from '../../drivers/CertificateEthersDriver';
import ObjectEvent, { Certification } from '../../entities/standard/ObjectEvent';
import Certificate, { AssessmentAssuranceLevel, CertificateStatusType } from '../../entities/Certificate';
import { ObjectEventStrategy } from './ObjectEventStrategy';

jest.mock('nanoid', () => ({
    nanoid: jest.fn().mockReturnValue('uuid-test'),
}));

describe('ObjectEventStrategy', () => {
    let mockedIdentityDriver;
    let mockedCertificateEthersDriver;
    let objectEventStrategy: ObjectEventStrategy;

    const mockedNanoid = jest.mocked(nanoid, true);

    const ipfsHash = 'ipfsHash';
    const simmetrickey = 'simmetrickey';
    const identityDriverPublicKey = 'publicKey';
    const identityDriverAddress = 'address';

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
                evidenceURL: 'url',
                responsibleAgency: { partyID: 'company', name: '' },
            } as Certification,
            {
                certificateID: 'certificateID2Test',
                referenceStandard: 'referenceStandard2Test',
                assessmentLevel: 'third-party',
                evidenceURL: 'url',
                responsibleAgency: { partyID: 'company', name: '' },
            } as Certification,
        ],
    );

    const mockedStoreCertificateDriver = jest.fn().mockResolvedValue(simmetrickey);
    const mockedAllowReadCertificateDriver = jest.fn();
    const mockedUpdateCertificateDriver = jest.fn();
    const mockedRetrieveByExternalEventId = jest.fn().mockResolvedValue({ sourceUrl: ipfsHash });
    const mockedRetrieveByExternalCertificateId = jest.fn();

    beforeAll(() => {
        mockedIdentityDriver = createMock<IdentityEthersDriver>({
            publicKey: identityDriverPublicKey,
            address: identityDriverAddress,
        });
        mockedCertificateEthersDriver = createMock<CertificateEthersDriver>({
            store: mockedStoreCertificateDriver,
            allowRead: mockedAllowReadCertificateDriver,
            update: mockedUpdateCertificateDriver,
            retrieveByExternalEventId: mockedRetrieveByExternalEventId,
            retrieveByExternalCertificateId: mockedRetrieveByExternalCertificateId,
        });
        objectEventStrategy = new ObjectEventStrategy(
            mockedIdentityDriver,
            mockedCertificateEthersDriver,
        );
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should store certificates from ObjectEvent object', async () => {
        await objectEventStrategy.store(objectEvent, ipfsHash);

        const expectedCertificate1 = new Certificate(
            'uuid-test',
            objectEvent.certifications[0].certificateID,
            new Date(objectEvent.eventTime),
            new Date(objectEvent.eventTime),
            [objectEvent.businessStepCode],
            objectEvent.certifications[0].referenceStandard,
            objectEvent.quantityList.map((q) => q.productClass),
            AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION,
            objectEvent.certifications[0].certificateID,
            'documentType',
            objectEvent.certifications[0].responsibleAgency.partyID,
            CertificateStatusType.UNVERFIED,
            ipfsHash,
        );
        const expectedCertificate2 = new Certificate(
            'uuid-test',
            objectEvent.certifications[1].certificateID,
            new Date(objectEvent.eventTime),
            new Date(objectEvent.eventTime),
            [objectEvent.businessStepCode],
            objectEvent.certifications[1].referenceStandard,
            objectEvent.quantityList.map((q) => q.productClass),
            AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION,
            objectEvent.certifications[1].certificateID,
            'documentType',
            objectEvent.certifications[1].responsibleAgency.partyID,
            CertificateStatusType.UNVERFIED,
            ipfsHash,
        );

        expect(mockedNanoid).toHaveBeenCalledTimes(1);
        expect(mockedStoreCertificateDriver).toHaveBeenCalledTimes(2);
        expect(mockedStoreCertificateDriver).toHaveBeenNthCalledWith(1, expectedCertificate1);
        expect(mockedStoreCertificateDriver).toHaveBeenNthCalledWith(2, expectedCertificate2);
        expect(mockedAllowReadCertificateDriver).toHaveBeenCalledTimes(2);
        expect(mockedAllowReadCertificateDriver).toHaveBeenNthCalledWith(
            1,
            expectedCertificate1.id,
            identityDriverPublicKey,
            identityDriverAddress,
            simmetrickey,
        );
        expect(mockedAllowReadCertificateDriver).toHaveBeenNthCalledWith(
            2,
            expectedCertificate2.id,
            identityDriverPublicKey,
            identityDriverAddress,
            simmetrickey,
        );
    });

    it('should update certificates from ObjectEvent object', async () => {
        const eventId = 'eventID';
        mockedRetrieveByExternalCertificateId.mockResolvedValueOnce({
            id: 'cert123',
            ownerAddress: 'ownerAddress1Test',
        } as Certificate);
        mockedRetrieveByExternalCertificateId.mockResolvedValueOnce({
            id: 'cert456',
            ownerAddress: 'ownerAddress2Test',
        } as Certificate);
        await objectEventStrategy.update(objectEvent, eventId, ipfsHash);

        const expectedCertificate1 = new Certificate(
            eventId,
            objectEvent.certifications[0].certificateID,
            new Date(objectEvent.eventTime),
            new Date(objectEvent.eventTime),
            [objectEvent.businessStepCode],
            objectEvent.certifications[0].referenceStandard,
            objectEvent.quantityList.map((q) => q.productClass),
            AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION,
            objectEvent.certifications[0].certificateID,
            'documentType',
            objectEvent.certifications[0].responsibleAgency.partyID,
            CertificateStatusType.UNVERFIED,
            ipfsHash,
            'cert123',
            'ownerAddress1Test',
        );
        const expectedCertificate2 = new Certificate(
            eventId,
            objectEvent.certifications[1].certificateID,
            new Date(objectEvent.eventTime),
            new Date(objectEvent.eventTime),
            [objectEvent.businessStepCode],
            objectEvent.certifications[1].referenceStandard,
            objectEvent.quantityList.map((q) => q.productClass),
            AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION,
            objectEvent.certifications[1].certificateID,
            'documentType',
            objectEvent.certifications[1].responsibleAgency.partyID,
            CertificateStatusType.UNVERFIED,
            ipfsHash,
            'cert456',
            'ownerAddress2Test',
        );

        expect(mockedUpdateCertificateDriver).toHaveBeenCalledTimes(2);
        expect(mockedUpdateCertificateDriver).toHaveBeenNthCalledWith(1, expectedCertificate1);
        expect(mockedUpdateCertificateDriver).toHaveBeenNthCalledWith(2, expectedCertificate2);
    });

    it('should store certificate if not already exist', async () => {
        mockedRetrieveByExternalCertificateId.mockResolvedValueOnce(undefined);
        const eventId = 'eventID';
        await objectEventStrategy.update(objectEvent, eventId, ipfsHash);
        const newCertificate1 = new Certificate(
            eventId,
            objectEvent.certifications[0].certificateID,
            new Date(objectEvent.eventTime),
            new Date(objectEvent.eventTime),
            [objectEvent.businessStepCode],
            objectEvent.certifications[0].referenceStandard,
            objectEvent.quantityList.map((q) => q.productClass),
            AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION,
            objectEvent.certifications[0].certificateID, // TODO FIX
            'documentType', // TODO FIX
            objectEvent.certifications[0].responsibleAgency.partyID,
            CertificateStatusType.UNVERFIED,
            ipfsHash,
            // TODO Trade id?
        );

        const newCertificate2 = new Certificate(
            eventId,
            objectEvent.certifications[1].certificateID,
            new Date(objectEvent.eventTime),
            new Date(objectEvent.eventTime),
            [objectEvent.businessStepCode],
            objectEvent.certifications[1].referenceStandard,
            objectEvent.quantityList.map((q) => q.productClass),
            AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION,
            objectEvent.certifications[1].certificateID, // TODO FIX
            'documentType', // TODO FIX
            objectEvent.certifications[1].responsibleAgency.partyID,
            CertificateStatusType.UNVERFIED,
            ipfsHash,
            // TODO Trade id?
        );

        expect(mockedStoreCertificateDriver).toHaveBeenNthCalledWith(1, newCertificate1);
        expect(mockedStoreCertificateDriver).toHaveBeenNthCalledWith(2, newCertificate2);
        expect(mockedAllowReadCertificateDriver).toHaveBeenNthCalledWith(1, undefined, 'publicKey', 'address', 'simmetrickey');
        expect(mockedAllowReadCertificateDriver).toHaveBeenNthCalledWith(2, undefined, 'publicKey', 'address', 'simmetrickey');
    });

    it('should read from ipfs storage', async () => {
        const response = await objectEventStrategy.readSourceURL('externalCertificateIDTest');

        expect(mockedRetrieveByExternalEventId).toHaveBeenCalledTimes(1);
        expect(mockedRetrieveByExternalEventId).toHaveBeenNthCalledWith(1, 'externalCertificateIDTest');
        expect(response).toEqual(ipfsHash);
    });
});
