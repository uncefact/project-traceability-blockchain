import { randomBytes } from 'crypto';

/* It's a class that represents a symmetric key */
export class SymmetricKey {
    private _algorithm: string;

    private _iv: Buffer;

    private _key: Buffer;

    constructor() {
        this._algorithm = 'aes-256-cbc';
        this._iv = randomBytes(16);
        this._key = randomBytes(32);
    }

    public get algorithm(): string {
        return this._algorithm;
    }

    public get iv(): Buffer {
        return this._iv;
    }

    public get key(): Buffer {
        return this._key;
    }

    /**
     * It returns a JSON string representation of the object
     * @returns A stringified JSON object containing the algorithm, iv, and key.
     */
    toJson(): string {
        return JSON.stringify({ algorithm: this.algorithm, iv: this.iv, key: this.key });
    }

    /**
     * It takes a JSON string, parses it, and returns a SymmetricKey object
     * @param {string} json - The JSON string to parse.
     * @returns A SymmetricKey object
     */
    static fromJson(json: string): SymmetricKey {
        const key = new SymmetricKey();

        const plainObject = JSON.parse(json);
        key._iv = Buffer.from(plainObject.iv);
        key._key = Buffer.from(plainObject.key);

        return key;
    }
}

export default SymmetricKey;
