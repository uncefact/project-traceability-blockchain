import Certificate, { AssessmentAssuranceLevel, CertificateStatusType } from '../entities/Certificate';
import { CertificateJsonSerializer } from './CertificateJsonSerializer';

describe('CertificateJsonSerializer', () => {
    let certificateJsonSerializer: CertificateJsonSerializer;
    let now: Date;
    let inAMinute: Date;

    beforeAll(() => {
        certificateJsonSerializer = new CertificateJsonSerializer();
        now = new Date();
        inAMinute = new Date(now.getTime() + 60000);
    });

    it('should correctly serialize a Certificate', () => {
        const certificate = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processingTypes'],
            'processingStd',
            ['productTypes'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportId',
            'documentType',
            'companyID',
            CertificateStatusType.UNVERFIED,
            'sourceUrl',
        );

        const result = certificateJsonSerializer.serialize(certificate);

        expect(result).toEqual(JSON.stringify({
            externalEventId: certificate.externalEventId,
            externalCertificateId: certificate.externalCertificateId,
            ownerAddress: certificate.ownerAddress,
            startDate: certificate.startDate,
            endDate: certificate.endDate,
            processTypes: certificate.processTypes,
            processingStd: certificate.processingStd,
            productTypes: certificate.productTypes,
            assessmentAssuranceLevel: certificate.assessmentAssuranceLevel,
            reportId: certificate.reportId,
            documentType: certificate.documentType,
            companyId: certificate.companyId,
            status: certificate.status,
            sourceUrl: certificate.sourceUrl,
        }));
    });

    it('should correctly deserialize a Certificate', () => {
        const certificate = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processingTypes'],
            'processingStd',
            ['productTypes'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportId',
            'documentType',
            'companyID',
            CertificateStatusType.UNVERFIED,
            'sourceUrl',
        );

        const serializedEbEvent = JSON.stringify({
            externalEventId: certificate.externalEventId,
            externalCertificateId: certificate.externalCertificateId,
            ownerAddress: certificate.ownerAddress,
            startDate: certificate.startDate,
            endDate: certificate.endDate,
            processTypes: certificate.processTypes,
            processingStd: certificate.processingStd,
            productTypes: certificate.productTypes,
            assessmentAssuranceLevel: certificate.assessmentAssuranceLevel,
            reportId: certificate.reportId,
            documentType: certificate.documentType,
            companyId: certificate.companyId,
            status: certificate.status,
            sourceUrl: certificate.sourceUrl,
        });

        const result = certificateJsonSerializer.deserialize(serializedEbEvent);
        expect(result).toEqual(certificate);
    });
});
