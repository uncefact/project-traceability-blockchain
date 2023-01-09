/* eslint-disable class-methods-use-this */
import { nanoid } from 'nanoid';
import IdentityEthersDriver from '../../drivers/IdentityEthersDriver';
import CertificateEthersDriver from '../../drivers/CertificateEthersDriver';
import ObjectEvent from '../../entities/standard/ObjectEvent';
import { resolvePromiseSequentially } from '../../utils/utils';
import { StandardEventStrategy } from './StandardEventStrategy.interface';
import Certificate, { AssessmentAssuranceLevel, CertificateStatusType } from '../../entities/Certificate';

export class ObjectEventStrategy implements StandardEventStrategy<ObjectEvent> {
    private _identityDriver: IdentityEthersDriver;

    private _certificateEthersDriver: CertificateEthersDriver;

    constructor(
        identityDriver: IdentityEthersDriver,
        certificateEthersDriver: CertificateEthersDriver,
    ) {
        this._identityDriver = identityDriver;
        this._certificateEthersDriver = certificateEthersDriver;
    }

    private getAssessmentAssuranceLevel = (s: string): AssessmentAssuranceLevel => { // TODO fix with real values
        const map: { [key: string]: AssessmentAssuranceLevel } = {
            'third-party': AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION,
            'peer-review': AssessmentAssuranceLevel.PEER_REVIEW,
            'self-assessed': AssessmentAssuranceLevel.SELF_ASSESSMENT,
            'unverified-self': AssessmentAssuranceLevel.UNVERIFIED_SELF_DECLARATION,
            'second-party': AssessmentAssuranceLevel.SECOND_PARTY_VERIFICATION,
        };
        return map[s];
    };

    /**
     * Store certificates from ObjectEvent standard object
     * @param {ObjectEvent} t - standard object
     * @param {string} ipfsHash - cid of ipfs
     * @param {string} externalId - id of the stored entity (in this case it will not be automatically generated)
     */
    async store(t: ObjectEvent, ipfsHash: string, externalId?: string): Promise<string | undefined> {
        const objectEventId = nanoid();
        const certificateFunctions = t.certifications.map((certificate) => async () => {
            const assessmentAssuranceLevel = this.getAssessmentAssuranceLevel(certificate.assessmentLevel);
            const newCertificate: Certificate = new Certificate(
                objectEventId,
                certificate.certificateID,
                new Date(t.eventTime),
                new Date(t.eventTime),
                [t.businessStepCode],
                certificate.referenceStandard,
                t.quantityList.map((q) => q.productClass),
                assessmentAssuranceLevel,
                certificate.certificateID, // TODO FIX
                'documentType', // TODO FIX
                t.certifications[0].responsibleAgency.partyID,
                CertificateStatusType.UNVERFIED,
                ipfsHash,
                externalId
            );
            const symmetricKey = await this._certificateEthersDriver.store(newCertificate);
            await this._certificateEthersDriver.allowRead(
                newCertificate.id,
                this._identityDriver.publicKey,
                this._identityDriver.address,
                symmetricKey,
            );
        });
        try {
            await resolvePromiseSequentially<void>(certificateFunctions);
            return objectEventId;
        } catch (e) {
            throw new Error(`An error during json standard store occurs: ${e}`);
        }
    }

    /**
     * Update certificates from ObjectEvent standard object
     * @param {ObjectEvent} t - standard object
     * @param {string} eventId - id of the object event
     * @param {string} ipfsHash - cid of ipfs
     * @returns the ipfs hash of the old ObjectEvent
     */
    async update(t: ObjectEvent, eventId: string, ipfsHash: string): Promise<string> {
        let oldSourceUrl = '';
        const certificateFunctions = t.certifications.map((certificate) => async () => {
            const oldCertificate: Certificate | undefined = await this._certificateEthersDriver.retrieveByExternalCertificateId(certificate.certificateID);
            const assessmentAssuranceLevel = this.getAssessmentAssuranceLevel(certificate.assessmentLevel);
            const newCertificate = oldCertificate ? new Certificate(
                eventId,
                certificate.certificateID,
                new Date(t.eventTime),
                new Date(t.eventTime),
                [t.businessStepCode],
                certificate.referenceStandard,
                t.quantityList.map((q) => q.productClass),
                assessmentAssuranceLevel,
                certificate.certificateID, // TODO FIX
                'documentType', // TODO FIX
                t.certifications[0].responsibleAgency.partyID,
                CertificateStatusType.UNVERFIED,
                ipfsHash,
                oldCertificate.id,
                oldCertificate.ownerAddress,
                // TODO Trade id?
            ) : new Certificate(
                eventId,
                certificate.certificateID,
                new Date(t.eventTime),
                new Date(t.eventTime),
                [t.businessStepCode],
                certificate.referenceStandard,
                t.quantityList.map((q) => q.productClass),
                assessmentAssuranceLevel,
                certificate.certificateID, // TODO FIX
                'documentType', // TODO FIX
                t.certifications[0].responsibleAgency.partyID,
                CertificateStatusType.UNVERFIED,
                ipfsHash,
                // TODO Trade id?
            );

            if (oldCertificate && !newCertificate.equals(oldCertificate)) {
                await this._certificateEthersDriver.update(newCertificate);
                oldSourceUrl = oldCertificate.sourceUrl;
            } else {
                const symmetricKey = await this._certificateEthersDriver.store(newCertificate);
                await this._certificateEthersDriver.allowRead(newCertificate.id, this._identityDriver.publicKey, this._identityDriver.address, symmetricKey);
            }
        });
        try {
            await resolvePromiseSequentially<void>(certificateFunctions);
            return oldSourceUrl;
        } catch (e) {
            throw new Error(`An error during json standard update occurs: ${e}`);
        }
    }

    /**
     * It retrieves the certificate from the blockchain and returns the source URL
     * @param {string} eventID - The event ID of the certificate you want to retrieve the source URL of.
     * @returns The source URL of the certificate.
     */
    async readSourceURL(eventID: string): Promise<string> {
        const certificate = await this._certificateEthersDriver.retrieveByExternalEventId(eventID);
        return certificate.sourceUrl;
    }

    /**
     * @returns A list of URL's references to a file stored within IPFS
     */
    async readSourcesURL(): Promise<string[]> {
        const certificates = await this._certificateEthersDriver.retrieveAll();
        const distinctCertificates = certificates.filter((certificate,i,tot) =>
            tot.findIndex(certificate2 => (certificate2.sourceUrl === certificate.sourceUrl)) === i);
        return distinctCertificates.map(t => t.sourceUrl);
    }
}
