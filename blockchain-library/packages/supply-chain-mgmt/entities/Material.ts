import { arrayCompare } from '../utils/utils';

/* Class representing a Material. */
export class Material {
    private _id?: string;

    private _ownerAddress?: string;

    private _name: string;

    private _productTypes: Array<string>;

    private _sourceUrl?: string;

    /**
     * Constructor for the class.
     * @param {string} id - The id of the material.
     *                      Can be undefined, in this case the material driver store will set it with an uuid
     * @param {string | undefined} ownerAddress - The address of the wallet of the owner of the material.
     *                      Can be undefined, in this case the material driver store will set it with its identity driver address
     * @param {string} name - The name of the material.
     * @param {Array<string>} productTypes - The material product types.
     * @param {string} sourceUrl - The URL where you can find the original resource.
     */
    constructor(
        name: string,
        productTypes: Array<string>,
        sourceUrl?: string,
        id?: string,
        ownerAddress?: string,
    ) {
        this._name = name;
        this._productTypes = productTypes;
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

    get name(): string {
        return this._name;
    }

    get productTypes(): Array<string> {
        return this._productTypes;
    }

    get sourceUrl(): string | undefined {
        return this._sourceUrl;
    }

    equals(obj: Material): boolean {
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

export default Material;
