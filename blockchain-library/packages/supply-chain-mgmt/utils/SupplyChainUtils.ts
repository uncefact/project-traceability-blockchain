/* eslint-disable no-restricted-syntax */
import { StatusType } from '../entities/graph-entities/StatusType';
import Transformation from '../entities/Transformation';
import Trade from '../entities/Trade';
import Certificate, { CertificateStatusType } from '../entities/Certificate';
import { CustomCheck } from '../types/CustomCheck.type';

export class SupplyChainUtils {
    private static checkProcessingStdMap(processingStdMap: Map<string, boolean>): StatusType {
        // No required processing standard
        if ([...processingStdMap.values()].length === 0) return StatusType.DEFAULT;

        // Every processing standard is compliant
        if ([...processingStdMap.values()].every((p) => p)) return StatusType.FULLY_COMPLIANT;

        // No processing standard is compliant
        if ([...processingStdMap.values()].every((p) => !p)) return StatusType.NOT_COMPLIANT;

        return StatusType.PARTIALLY_COMPLIANT;
    }

    // checks compatibility between the processing standard used in a transformation and the one needed by the
    // chosen sustainability criterion
    private static filterRequiredProcessingStds(processingStds1: Array<string>, processingStds2: Array<string>) {
        return processingStds1.filter((processingStd: string) => processingStds2.includes(processingStd));
    }

    public static filterCurrentTransformationCertificates(transformation: Transformation, certificates: Certificate[]) {
        // Certificates process types includes transformation process types
        return certificates.filter((certificate: Certificate) => (transformation.ownerAddress === certificate.companyId)
            && (certificate.processTypes.length === 0 || certificate.processTypes.every((pT) => transformation.processTypes.includes(pT)))
            && (certificate.status === CertificateStatusType.ACCEPTED));
    }

    public static filterCurrentTradeCertificates(trade: Trade, certificates: Certificate[]) {
        // Certificates process types includes trade process types
        return certificates.filter((certificate: Certificate) => (certificate.tradeId === trade.id)
            && (trade.ownerAddress === certificate.companyId)
            && (certificate.processTypes.length === 0 || certificate.processTypes.every((pT) => trade.processTypes.includes(pT)))
            && (certificate.status === CertificateStatusType.ACCEPTED));
    }

    private static checkProcessingStdCompliance(processingStd: string, certificates: Array<Certificate>) {
        return certificates.some((certificate: Certificate) => certificate.processingStd === processingStd && certificate.status === CertificateStatusType.ACCEPTED);
    }

    public static evaluateTranformationStatus(
        transformations: Array<Transformation>,
        certificates: Array<Certificate>,
        processingStds: Array<string>,
        transformation: Transformation,
        alreadyProcessedTransformationsId: Array<string>,
        customChecks: CustomCheck[],
    ) {
        // Processing Standard => certificate is present
        const processingStdMap = new Map<string, boolean>();

        // Not the current trasformation
        // Not already processed transformation (following transformations)
        const previousTransformations = transformations.filter((t: Transformation) => t.id !== transformation.id
            && alreadyProcessedTransformationsId.every((id) => id !== t.id));

        // Get processing standards specified in the trasformation, filtered by the selected sustainability criteria
        const requiredProcessingStds = SupplyChainUtils.filterRequiredProcessingStds(
            transformation.processingStds,
            processingStds,
        );
        const transformationCertificates = SupplyChainUtils.filterCurrentTransformationCertificates(
            transformation,
            certificates,
        );

        for (const processingStd of requiredProcessingStds) {
            // Is the certificate for the processing standards present?
            const isSimpleCertificatePresent: boolean = transformationCertificates.some((c) => c.processingStd === processingStd);
            const areCustomCheckCompliant: boolean = customChecks.every((customCheck: CustomCheck) => customCheck(processingStd, transformation, previousTransformations, certificates));

            processingStdMap.set(processingStd, isSimpleCertificatePresent && areCustomCheckCompliant);
        }

        return SupplyChainUtils.checkProcessingStdMap(processingStdMap);
    }

    public static evaluateTradesStatus(
        certificates: Array<Certificate>,
        processingStds: Array<string>,
        trades: Array<Trade>,
    ) {
        const tradeProcessingStdMap = new Map<Trade, Map<string, boolean>>();

        for (const trade of trades) {
            const processingStdMap = new Map<string, boolean>();
            tradeProcessingStdMap.set(trade, processingStdMap);

            const requiredProcessingStds = SupplyChainUtils.filterRequiredProcessingStds(trade.processingStds, processingStds);
            const tradeCertificates = SupplyChainUtils.filterCurrentTradeCertificates(trade, certificates);

            for (const processingStd of requiredProcessingStds) {
                const hasValidCertificates = SupplyChainUtils.checkProcessingStdCompliance(processingStd, tradeCertificates);
                processingStdMap.set(processingStd, hasValidCertificates);
            }
        }

        if ([...tradeProcessingStdMap.values()].every((map) => SupplyChainUtils.checkProcessingStdMap(map) === StatusType.DEFAULT)) { return StatusType.DEFAULT; }
        if ([...tradeProcessingStdMap.values()].every((map) => SupplyChainUtils.checkProcessingStdMap(map) === StatusType.FULLY_COMPLIANT)) { return StatusType.FULLY_COMPLIANT; }
        if ([...tradeProcessingStdMap.values()].every((map) => SupplyChainUtils.checkProcessingStdMap(map) === StatusType.NOT_COMPLIANT)) { return StatusType.NOT_COMPLIANT; }
        return StatusType.PARTIALLY_COMPLIANT;
    }

    public static findTransformationByMaterialOutput(
        transformations: Array<Transformation>,
        materialOutId: string,
    ) {
        return transformations.find((t) => t.materialOutId === materialOutId);
    }

    public static findTradesByMaterialOutput(
        trades: Array<Trade>,
        materialOutId: string,
    ) {
        return trades.filter((t) => t.materialsIds.map((x) => x[1]).includes(materialOutId));
    }
}
