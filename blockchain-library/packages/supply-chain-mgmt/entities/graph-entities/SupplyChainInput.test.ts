import Certificate, { AssessmentAssuranceLevel, CertificateStatusType } from '../Certificate';
import Material from '../Material';
import Trade from '../Trade';
import Transformation from '../Transformation';
import { SupplyChainInput } from './SupplyChainInput';

describe('SupplyChainInput', () => {
    let now: Date;
    let inAMinute: Date;

    let materials: Array<Material>;
    let transformations: Array<Transformation>;
    let trades: Array<Trade>;
    let certificates: Array<Certificate>;

    let supplyChainInput: SupplyChainInput;

    beforeAll(() => {
        now = new Date();
        inAMinute = new Date(now.getTime() + 60000);

        materials = [
            new Material('testName', [], 'http://test.source.url', 'mat1', 'testOwnerAddress'),
            new Material('testName', [], 'http://test.source.url', 'mat2', 'testOwnerAddress'),
        ];

        transformations = [
            new Transformation(['matInt456'], 'matOut789', 'testName', now, inAMinute, [], [], 'http://test.source.url', 'trans42', 'testOwnerAddress'),
        ];

        trades = [
            new Trade([['mat456', 'mat789']], 'testName', [], [], 'companyID', 'trade123', 'testOwnerAddress'),
        ];

        certificates = [
            new Certificate(
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
                'trade123',
            ),
        ];

        supplyChainInput = new SupplyChainInput(
            materials,
            transformations,
            trades,
            certificates,
        );
    });

    it('should correctly initialize a SupplyChainInput instance', () => {
        expect(supplyChainInput.materials).toEqual(materials);
        expect(supplyChainInput.transformations).toEqual(transformations);
        expect(supplyChainInput.trades).toEqual(trades);
        expect(supplyChainInput.certificates).toEqual(certificates);
    });
});
