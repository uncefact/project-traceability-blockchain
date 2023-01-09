import { arrayCompare } from '../utils/utils';

/* eslint-disable no-unused-vars */
export enum AssessmentAssuranceLevel {
    THIRD_PARTY_CERTIFICATION,
    PEER_REVIEW,
    SELF_ASSESSMENT,
    UNVERIFIED_SELF_DECLARATION,
    SECOND_PARTY_VERIFICATION
}

export enum CertificateStatusType {
    UNVERFIED,
    ACCEPTED,
    REJECTED
}

/* Class representing a Certificate.  */
export class Certificate {
    private _id?: string;

    // this will be an uuid which represent the entire objectEvent (because for one object, more certifications can be created)
    private _externalEventId: string;

    private _externalCertificateId: string;

    private _ownerAddress?: string;

    private _startDate: Date;

    private _endDate: Date;

    private _processTypes: Array<string>;

    private _processingStd: string;

    private _productTypes: Array<string>;

    private _assessmentAssuranceLevel: AssessmentAssuranceLevel;

    private _reportId: string;

    private _documentType: string;

    private _companyId: string;

    private _status: CertificateStatusType;

    private _sourceUrl: string;

    private _tradeId?: string;

    /**
     * Constructor for the class.
     * @param {string} externalEventId - The eventID generated
     * @param {string} externalCertificateId - The certificateID retrieved from the standard JSON.
     * @param {Date} startDate - Validity start
     * @param {Date} endDate - Validity End
     * @param {Array<string>} processTypes - The trade process types.
     * @param {string} processingStd - The trade processing standards.
     * @param productTypes - The trade product types.
     * @param {AssessmentAssuranceLevel} assessmentAssuranceLevel - AssessmentAssuranceLevel,
     * @param {string} reportId - The unique identifier of the certificate.
     * @param {string} documentType - The type of document that is being uploaded.
     * @param {string} companyId - The id of the company that the certificate is for.
     * @param {CertificateStatusType} status - CertificateStatusType
     * @param {string} sourceUrl - The URL of the certificate
     * @param {string} [id] - The id of the certificate
     * @param {string} [ownerAddress] - The address of the owner of the certificate.
     * @param {string} [tradeId] - The id of the trade that this certificate is associated with.
     */
    constructor(
        externalEventId: string,
        externalCertificateId: string,
        startDate: Date,
        endDate: Date,
        processTypes: Array<string>,
        processingStd: string,
        productTypes: Array<string>,
        assessmentAssuranceLevel: AssessmentAssuranceLevel,
        reportId: string,
        documentType: string,
        companyId: string,
        status: CertificateStatusType,
        sourceUrl: string,
        id?: string,
        ownerAddress?: string,
        tradeId?: string,
    ) {
        this._externalEventId = externalEventId;
        this._externalCertificateId = externalCertificateId;
        this._startDate = startDate;
        this._endDate = endDate;
        this._processTypes = processTypes;
        this._processingStd = processingStd;
        this._productTypes = productTypes;
        this._assessmentAssuranceLevel = assessmentAssuranceLevel;
        this._reportId = reportId;
        this._documentType = documentType;
        this._companyId = companyId;
        this._status = status;
        this._sourceUrl = sourceUrl;
        this._id = id;
        this._ownerAddress = ownerAddress;
        this._tradeId = tradeId;
    }

    get id(): string | undefined {
        return this._id;
    }

    set id(value: string | undefined) {
        this._id = value;
    }

    get externalEventId(): string {
        return this._externalEventId;
    }

    get externalCertificateId(): string {
        return this._externalCertificateId;
    }

    get ownerAddress(): string | undefined {
        return this._ownerAddress;
    }

    set ownerAddress(value: string | undefined) {
        this._ownerAddress = value;
    }

    get startDate(): Date {
        return this._startDate;
    }

    get endDate(): Date {
        return this._endDate;
    }

    get processTypes(): Array<string> {
        return this._processTypes;
    }

    get processingStd(): string {
        return this._processingStd;
    }

    get productTypes(): Array<string> {
        return this._productTypes;
    }

    get assessmentAssuranceLevel(): AssessmentAssuranceLevel {
        return this._assessmentAssuranceLevel;
    }

    get reportId(): string {
        return this._reportId;
    }

    get documentType(): string {
        return this._documentType;
    }

    get companyId(): string {
        return this._companyId;
    }

    get status(): CertificateStatusType {
        return this._status;
    }

    get sourceUrl(): string {
        return this._sourceUrl;
    }

    get tradeId(): string | undefined {
        return this._tradeId;
    }

    equals(obj: Certificate): boolean {
        const keys1 = Object.keys(this);
        const keys2 = Object.keys(obj);
        if (keys1.length !== keys2.length) {
            return false;
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const key of keys1) {
            if (key !== '_sourceUrl') {
                // @ts-ignore
                if (this[key] instanceof Array) return arrayCompare(this[key], obj[key]);
                // @ts-ignore
                if (this[key] !== obj[key]) return false;
            }
        }
        return true;
    }
}

export default Certificate;
