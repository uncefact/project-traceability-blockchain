export class Trade {
    private _id?: string;

    private _ownerAddress?: string;

    private _materialsIds: string[][];

    private _name: string;

    private _processTypes: Array<string>;

    private _processingStds: Array<string>;

    private _consigneeCompanyId?: string;

    private _sourceUrl?: string;

    /**
     * Constructor for the Trade class.
     * @param {string} id - An unique identifier of a Trade.
     *                      Can be undefined, in this case the trade driver store will set it with an uuid
     * @param {string} ownerAddress - The address of the owner of the trade.
     *                      Can be undefined, in this case the trade driver store will set it with its identity driver address
     * @param {string[][]} materialsIds - This is a 2D array of numbers. The first dimension is the identifier for the outgoing material.
     * The second dimension is the ID of the same material on the receiving end.
     * Sender have a certain ID for a material, and receivers have a different one (for the same material).
     * @param {string} name - The name of the recipe.
     * @param {Array<string>} processTypes - The trade process types.
     * @param {Array<string>} processingStds - The trade processing standards.
     * @param {string} consigneeCompanyId - The id of the consignee (recipient) of the trade.
     * @param {string} sourceUrl - The URL of the original JSON file used to generate the current transaction.
     */
    constructor(
        materialsIds: string[][],
        name: string,
        processTypes: Array<string>,
        processingStds: Array<string>,
        consigneeCompanyId?: string,
        sourceUrl?: string,
        id?: string,
        ownerAddress?: string,
    ) {
        this._id = id;
        this._ownerAddress = ownerAddress;
        this._materialsIds = materialsIds;
        this._name = name;
        this._processTypes = processTypes;
        this._processingStds = processingStds;
        this._sourceUrl = sourceUrl;
        this._consigneeCompanyId = consigneeCompanyId;
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

    get materialsIds(): string[][] {
        return this._materialsIds;
    }

    get name(): string {
        return this._name;
    }

    get processTypes(): Array<string> {
        return this._processTypes;
    }

    get processingStds(): Array<string> {
        return this._processingStds;
    }

    get consigneeCompanyId(): string | undefined {
        return this._consigneeCompanyId;
    }

    set consigneeCompanyId(value: string | undefined) {
        this._consigneeCompanyId = value;
    }

    get sourceUrl(): string | undefined {
        return this._sourceUrl;
    }
}

export default Trade;
