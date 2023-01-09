import { arrayCompare } from '../utils/utils';

export class Transformation {
    private _id?: string;

    private _ownerAddress?: string;

    private _materialsInIds: string[];

    private _materialOutId: string;

    private _name: string;

    private _startDate: Date;

    private _endDate: Date;

    private _processTypes: string[];

    private _processingStds: string[];

    private _sourceUrl?: string;

    /**
     * The constructor function is a function that is called when a new instance of the class is created
     * @param {string[]} materialsInIds - The ids of the input materials for the transformation.
     * @param {string} materialOutId - The id of the material generated by the transformation.
     * @param {string} name - The name of the transformation.
     * @param {Date} startDate - The date the transformation started.
     * @param {Date} endDate - The date the transformation ended.
     * @param processTypes - An array of processes types defing the relevant operations of the transformation.
     * @param processingStds - An array containing the processing standards required by the transformation.
     * @param {string} sourceUrl - The URL of the original JSON file used to generate the current transaction.
     * @param {string | undefined} id - The id of the transformation.
     *                      Can be undefined, in this case the transformation driver store will set it with its identity driver address
     * @param {string | undefined} ownerAddress - The address of the wallet of the owner of the transformation.
     *                                            Can be undefined, in this case the transformation driver store will set it with its identity driver address
     */
    constructor(
        materialsInIds: string[],
        materialOutId: string,
        name: string,
        startDate: Date,
        endDate: Date,
        processTypes: Array<string>,
        processingStds: Array<string>,
        sourceUrl?: string,
        id?: string,
        ownerAddress?: string,
    ) {
        this._materialsInIds = materialsInIds;
        this._materialOutId = materialOutId;
        this._name = name;
        this._startDate = startDate;
        this._endDate = endDate;
        this._processTypes = processTypes;
        this._processingStds = processingStds;
        this._sourceUrl = sourceUrl;
        this._id = id;
        this._ownerAddress = ownerAddress;
    }

    get id(): string | undefined {
        return this._id;
    }

    set id(value: string | undefined) {
        this._id = value;
    }

    get ownerAddress(): string | undefined {
        return this._ownerAddress;
    }

    set ownerAddress(value: string | undefined) {
        this._ownerAddress = value;
    }

    get materialsInIds(): string[] {
        return this._materialsInIds;
    }

    get materialOutId(): string {
        return this._materialOutId;
    }

    get name(): string {
        return this._name;
    }

    get startDate(): Date {
        return this._startDate;
    }

    get endDate(): Date {
        return this._endDate;
    }

    get processTypes(): string[] {
        return this._processTypes;
    }

    get processingStds(): string[] {
        return this._processingStds;
    }

    get sourceUrl(): string | undefined {
        return this._sourceUrl;
    }

    // TODO: capire come fare l'equals perchè alcuni valori mancheranno (id dei materiali, owneraddress, etc..)
    equals(obj: Transformation): boolean {
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

export default Transformation;
