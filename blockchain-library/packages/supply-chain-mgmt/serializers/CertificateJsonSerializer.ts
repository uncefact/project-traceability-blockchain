/* eslint-disable class-methods-use-this */
import EntitySerializer from './EntitySerializer.interface';
import Certificate from '../entities/Certificate';

export class CertificateJsonSerializer implements EntitySerializer<Certificate> {
    serialize(t: Certificate): string {
        return JSON.stringify({
            id: t.id,
            externalEventId: t.externalEventId,
            externalCertificateId: t.externalCertificateId,
            ownerAddress: t.ownerAddress,
            startDate: t.startDate,
            endDate: t.endDate,
            processTypes: t.processTypes,
            processingStd: t.processingStd,
            productTypes: t.productTypes,
            assessmentAssuranceLevel: t.assessmentAssuranceLevel,
            reportId: t.reportId,
            documentType: t.documentType,
            companyId: t.companyId,
            status: t.status,
            sourceUrl: t.sourceUrl,
            tradeId: t.tradeId,
        });
    }

    deserialize(serializedT: string): Certificate {
        const plainObject = JSON.parse(serializedT);
        return new Certificate(
            plainObject.externalEventId,
            plainObject.externalCertificateId,
            new Date(plainObject.startDate),
            new Date(plainObject.endDate),
            plainObject.processTypes,
            plainObject.processingStd,
            plainObject.productTypes,
            plainObject.assessmentAssuranceLevel,
            plainObject.reportId,
            plainObject.documentType,
            plainObject.companyId,
            plainObject.status,
            plainObject.sourceUrl,
            plainObject.id,
            plainObject.ownerAddress,
            plainObject.tradeId,
        );
    }
}
export default CertificateJsonSerializer;
