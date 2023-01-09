type Item = {
    itemID: string,
    name: string
}

export type Quantity = {
    productClass: string,
    quantity?: string,
    uom?: string
}

type Agency = {
    partyID: string,
    name: string
}

type Certification = {
    certificateID: string,
    referenceStandard: string,
    evidenceURL: string,
    criteriaList: string[],
    assessmentLevel: string,
    responsibleAgency: Agency
}

/* Class representing a TransformationEvent. */
export class TransformationEvent {
    private _outputItemList: Item[];

    private _inputItemList: Item[];

    private _inputQuantityList: Quantity[];

    private _outputQuantityList: Quantity[];

    private _eventType: string;

    private _eventTime: string;

    private _actionCode: string;

    private _dispositionCode: string;

    private _businessStepCode: string;

    private _readPointId: string;

    private _locationId: string;

    private _certifications: Certification[];

    /**
     * Constructor for the class.
     * @param {Item[]} outputItemList
     * @param {Item[]} inputItemList
     * @param {Quantity[]} inputQuantityList
     * @param {Quantity[]} outputQuantityList
     * @param {string} eventType
     * @param {string} eventTime
     * @param {string} actionCode
     * @param {string} dispositionCode
     * @param {string} businessStepCode
     * @param {string} readPointId
     * @param {string} locationId
     * @param {Certification[]} certifications
     */
    constructor(
        outputItemList: Item[],
        inputItemList: Item[],
        inputQuantityList: Quantity[],
        outputQuantityList: Quantity[],
        eventType: string,
        eventTime: string,
        actionCode: string,
        dispositionCode: string,
        businessStepCode: string,
        readPointId: string,
        locationId: string,
        certifications: Certification[],
    ) {
        this._outputItemList = outputItemList;
        this._inputItemList = inputItemList;
        this._inputQuantityList = inputQuantityList;
        this._outputQuantityList = outputQuantityList;
        this._eventType = eventType;
        this._eventTime = eventTime;
        this._actionCode = actionCode;
        this._dispositionCode = dispositionCode;
        this._businessStepCode = businessStepCode;
        this._readPointId = readPointId;
        this._locationId = locationId;
        this._certifications = certifications;
    }

    get outputItemList(): Item[] {
        return this._outputItemList;
    }

    get inputItemList(): Item[] {
        return this._inputItemList;
    }

    get inputQuantityList(): Quantity[] {
        return this._inputQuantityList;
    }

    get outputQuantityList(): Quantity[] {
        return this._outputQuantityList;
    }

    get eventType(): string {
        return this._eventType;
    }

    get eventTime(): string {
        return this._eventTime;
    }

    get actionCode(): string {
        return this._actionCode;
    }

    get dispositionCode(): string {
        return this._dispositionCode;
    }

    get businessStepCode(): string {
        return this._businessStepCode;
    }

    get readPointId(): string {
        return this._readPointId;
    }

    get locationId(): string {
        return this._locationId;
    }

    get certifications(): Certification[] {
        return this._certifications;
    }

    toJSON() {
        const proto = Object.getPrototypeOf(this);
        const jsonObj: any = { ...this};

        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([key, descriptor]) => typeof descriptor.get === 'function')
            .map(([key, descriptor]) => {
                if (descriptor && key[0] !== '_') {
                    try {
                        const val = (this as any)[key];
                        jsonObj[key] = val;
                    } catch (error) {
                        console.error(`Error calling getter ${key}`, error);
                    }
                }
            });

        return jsonObj;
    }

}

export default TransformationEvent;
