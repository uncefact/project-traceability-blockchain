import Certificate, { AssessmentAssuranceLevel, CertificateStatusType } from '../entities/Certificate';
import { StatusType } from '../entities/graph-entities/StatusType';
import Trade from '../entities/Trade';
import Transformation from '../entities/Transformation';
import { SupplyChainUtils } from './SupplyChainUtils';

describe('EntityService', () => {
    const processTypes = ['processType1', 'processType2'];
    const processingStds = ['processingStd1', 'processingStd2'];
    const transformation = new Transformation(
        [],
        'matOut2',
        'nameTest',
        new Date(),
        new Date(),
        processTypes,
        processingStds,
        'sourceUrlTest',
        'trans123',
        'companyID',
    );
    const otherTransformation = new Transformation(
        [],
        'matOut3',
        'nameTest',
        new Date(),
        new Date(),
        processTypes,
        [],
        'sourceUrlTest',
        'trans456',
        'companyID',
    );

    const trade = new Trade(
        [['mat1', 'mat2']],
        'nameTest',
        processTypes,
        [],
        'consigneeID',
        'sourceUrl',
        'trade123',
        'companyID',
    );

    const noProcessTypeCertificate = new Certificate(
        'externalEventId',
        'externalCertificateId',
        new Date(),
        new Date(),
        [],
        processingStds[0],
        [],
        AssessmentAssuranceLevel.PEER_REVIEW,
        'reportIdTest',
        'documentTypeTest',
        'companyID',
        CertificateStatusType.ACCEPTED,
        'sourceUrlTest',
        'cert123',
        'ownerAddressTest',
        'trade123',
    );
    const compliantCertificate = new Certificate(
        'externalEventId',
        'externalCertificateId',
        new Date(),
        new Date(),
        processTypes,
        processingStds[0],
        [],
        AssessmentAssuranceLevel.PEER_REVIEW,
        'reportIdTest',
        'documentTypeTest',
        'companyID',
        CertificateStatusType.ACCEPTED,
        'sourceUrlTest',
        'cert123',
        'ownerAddressTest',
        'trade123',
    );

    it('filterCurrentTransformationCertificates - certificate with no process type', () => {
        expect(
            SupplyChainUtils.filterCurrentTransformationCertificates(
                transformation,
                [noProcessTypeCertificate],
            ),
        ).toEqual([noProcessTypeCertificate]);
    });

    it('filterCurrentTransformationCertificates - certificate with all the required process types', () => {
        expect(
            SupplyChainUtils.filterCurrentTransformationCertificates(
                transformation,
                [compliantCertificate],
            ),
        ).toEqual([compliantCertificate]);
    });

    it('filterCurrentTradeCertificates - certificate with no process type', () => {
        expect(
            SupplyChainUtils.filterCurrentTradeCertificates(
                trade,
                [noProcessTypeCertificate],
            ),
        ).toEqual([noProcessTypeCertificate]);
    });

    it('filterCurrentTradeCertificates - certificate with all the required process types', () => {
        expect(
            SupplyChainUtils.filterCurrentTradeCertificates(
                trade,
                [compliantCertificate],
            ),
        ).toEqual([compliantCertificate]);
    });

    it('evaluateTranformationStatus - StatusType DEFAULT', () => {
        const t = new Transformation(
            [],
            'matOut2',
            'nameTest',
            new Date(),
            new Date(),
            processTypes,
            [],
            'sourceUrlTest',
            'trans123',
            'ownerAddressTest',
        );

        const resp = SupplyChainUtils.evaluateTranformationStatus(
            [t, otherTransformation],
            [noProcessTypeCertificate],
            processingStds,
            t,
            ['trans3'],
            [],
        );

        expect(resp).toEqual(StatusType.DEFAULT);
    });
    it('evaluateTranformationStatus - StatusType FULLY_COMPLIANT', () => {
        const t = new Transformation(
            [],
            'matOut2',
            'nameTest',
            new Date(),
            new Date(),
            processTypes,
            [processingStds[0]],
            'sourceUrlTest',
            'trans456',
            'companyID',
        );

        const resp = SupplyChainUtils.evaluateTranformationStatus(
            [t, otherTransformation],
            [noProcessTypeCertificate],
            processingStds,
            t,
            ['trans456'],
            [],
        );

        expect(resp).toEqual(StatusType.FULLY_COMPLIANT);
    });

    it('evaluateTranformationStatus - StatusType PARTIALLY_COMPLIANT', () => {
        const t = new Transformation(
            [],
            'matOut2',
            'nameTest',
            new Date(),
            new Date(),
            processTypes,
            [processingStds[0], 'otherProcessingStd'],
            'sourceUrlTest',
            'trans456',
            'companyID',
        );

        const resp = SupplyChainUtils.evaluateTranformationStatus(
            [t, otherTransformation],
            [noProcessTypeCertificate],
            [processingStds[0], 'otherProcessingStd'],
            t,
            ['trans456'],
            [],
        );

        expect(resp).toEqual(StatusType.PARTIALLY_COMPLIANT);
    });

    it('evaluateTranformationStatus - StatusType NOT_COMPLIANT', () => {
        const t = new Transformation(
            [],
            'matOut2',
            'nameTest',
            new Date(),
            new Date(),
            processTypes,
            [processingStds[0], 'otherProcessingStd'],
            'sourceUrlTest',
            'trans123',
            'ownerAddressTest',
        );

        const resp = SupplyChainUtils.evaluateTranformationStatus(
            [t, otherTransformation],
            [],
            [processingStds[0], 'otherProcessingStd'],
            t,
            ['trans456'],
            [],
        );

        expect(resp).toEqual(StatusType.NOT_COMPLIANT);
    });

    it('evaluateTranformationStatus - customChecks', () => {
        const t = new Transformation(
            [],
            'matOut2',
            'nameTest',
            new Date(),
            new Date(),
            processTypes,
            [processingStds[0]],
            'sourceUrlTest',
            'trans123',
            'companyID',
        );

        const resp = SupplyChainUtils.evaluateTranformationStatus(
            [t, otherTransformation],
            [noProcessTypeCertificate],
            processingStds,
            t,
            ['trans456'],
            [
                jest.fn().mockReturnValue(true),
            ],
        );

        expect(resp).toEqual(StatusType.FULLY_COMPLIANT);
    });

    it('evaluateTradesStatus - StatusType DEFAULT', () => {
        const t = new Trade(
            [],
            'nameTest',
            processTypes,
            [],
            'consigneeID',
            'trade456',
            'ownerAddressTest',
        );

        const resp = SupplyChainUtils.evaluateTradesStatus(
            [noProcessTypeCertificate],
            processingStds,
            [t],
        );

        expect(resp).toEqual(StatusType.DEFAULT);
    });

    it('evaluateTradesStatus - StatusType FULLY_COMPLIANT', () => {
        const t = new Trade(
            [],
            'nameTest',
            processTypes,
            [processingStds[0]],
            'consigneeID',
            'sourceUrl',
            'trade123',
            'companyID',
        );

        const resp = SupplyChainUtils.evaluateTradesStatus(
            [noProcessTypeCertificate],
            processingStds,
            [t],
        );

        expect(resp).toEqual(StatusType.FULLY_COMPLIANT);
    });

    it('evaluateTradesStatus - StatusType PARTIALLY_COMPLIANT', () => {
        const t = new Trade(
            [],
            'nameTest',
            processTypes,
            [processingStds[0], 'otherProcessingStd'],
            'consigneeID',
            'sourceUrl',
            'trade123',
            'companyID',
        );

        const resp = SupplyChainUtils.evaluateTradesStatus(
            [noProcessTypeCertificate],
            [processingStds[0], 'otherProcessingStd'],
            [t],
        );

        expect(resp).toEqual(StatusType.PARTIALLY_COMPLIANT);
    });

    it('evaluateTradesStatus - StatusType NOT_COMPLIANT', () => {
        const t = new Trade(
            [],
            'nameTest',
            processTypes,
            [processingStds[0], 'otherProcessingStd'],
            'consigneeID',
            'trade123',
            'ownerAddressTest',
        );

        const resp = SupplyChainUtils.evaluateTradesStatus(
            [],
            [processingStds[0], 'otherProcessingStd'],
            [t],
        );

        expect(resp).toEqual(StatusType.NOT_COMPLIANT);
    });

    it('findTransformationByMaterialOutput', () => {
        expect(
            SupplyChainUtils.findTransformationByMaterialOutput(
                [transformation, otherTransformation],
                'matOut2',
            ),
        ).toEqual(transformation);
    });
    it('findTradesByMaterialOutput', () => {
        expect(
            SupplyChainUtils.findTradesByMaterialOutput(
                [trade],
                'mat2',
            ),
        ).toEqual([trade]);
    });
});
