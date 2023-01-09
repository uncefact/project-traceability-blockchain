/* eslint-disable class-methods-use-this */
import { JsonRpcProvider } from '@ethersproject/providers';
import { utils, Wallet } from 'ethers';
import EthCrypto from 'eth-crypto';

/* Driver that handles user identity and offers utility functions for message signing
and verifying */
export class IdentityEthersDriver {
    private _privateKey: string;

    private _publicKey: string;

    private _address: string;

    private _wallet: Wallet;

    constructor(
        privateKey: string,
        provider: JsonRpcProvider,
    ) {
        this._wallet = new Wallet(privateKey, provider);
        this._privateKey = privateKey;
        this._publicKey = EthCrypto.publicKeyByPrivateKey(privateKey); // ! this._wallet.publicKey has a different value
        this._address = this._wallet.address;
    }

    get privateKey() {
        return this._privateKey;
    }

    get publicKey() {
        return this._publicKey;
    }

    get address() {
        return this._address;
    }

    get wallet() {
        return this._wallet;
    }

    /**
     * This function takes a message as a string and returns a signature as a string
     * @param {string} message - The message to sign.
     * @returns The signature of the message.
     */
    public async signMessage(message: string) {
        return this._wallet.signMessage(message);
    }

    /**
     * > This function takes a message, a signature, and an optional expected address, and returns true if
     * the signature is valid for the message and the expected address
     * @param {string} message - The message you want to sign.
     * @param {string} signature - The signature returned by the signMessage() function.
     * @param {string} [expectedAddress] - The address you expect the signature to be from. If you don't
     * provide this, it will use the address of the wallet.
     * @returns The resulting address match the expected address.
     */
    public verifySignature(message: string, signature: string, expectedAddress?: string) {
        const expected = expectedAddress || this._address;
        const signer = utils.verifyMessage(message, signature);
        return signer.toUpperCase() === expected.toUpperCase();
    }
}
export default IdentityEthersDriver;
