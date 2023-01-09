import Certificate, { AssessmentAssuranceLevel, CertificateStatusType } from './Certificate';

describe('Certificate', () => {
    let certificate: Certificate;
    let now: Date;
    let inAMinute: Date;

    beforeAll(() => {
        now = new Date();
        inAMinute = new Date(now.getTime() + 60000);

        certificate = new Certificate(
            'externalEventId',
            'externalCertificateId',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert123',
            'ownerAddressTest',
            'trade789',
        );
    });

    it('should correctly initialize a new Certificate', () => {
        expect(certificate.externalEventId).toEqual('externalEventId');
        expect(certificate.externalCertificateId).toEqual('externalCertificateId');
        expect(certificate.startDate).toEqual(now);
        expect(certificate.endDate).toEqual(inAMinute);
        expect(certificate.processTypes).toEqual(['processTypeTest']);
        expect(certificate.processingStd).toEqual('processingStdTest');
        expect(certificate.productTypes).toEqual(['productTypeTest']);
        expect(certificate.assessmentAssuranceLevel).toEqual(AssessmentAssuranceLevel.PEER_REVIEW);
        expect(certificate.reportId).toEqual('reportIdTest');
        expect(certificate.documentType).toEqual('documentTypeTest');
        expect(certificate.companyId).toEqual('companyID');
        expect(certificate.status).toEqual(CertificateStatusType.ACCEPTED);
        expect(certificate.sourceUrl).toEqual('sourceUrlTest');
        expect(certificate.id).toEqual('cert123');
        expect(certificate.ownerAddress).toEqual('ownerAddressTest');
        expect(certificate.tradeId).toEqual('trade789');
    });
});
