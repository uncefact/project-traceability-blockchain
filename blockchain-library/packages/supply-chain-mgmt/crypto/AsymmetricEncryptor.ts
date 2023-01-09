import EthCrypto, { Encrypted } from 'eth-crypto';

export class AsymmetricEncryptor {
    /**
     * It takes a public key and a string, and returns an encrypted object.
     * @param {string} publicKey - The public key of the person you want to encrypt the data for.
     * @param {string} data - The data you want to encrypt.
     * @returns Encrypted data
     */
    static async encrypt(publicKey: string, data: string): Promise<Encrypted> {
        return EthCrypto.encryptWithPublicKey(
            publicKey,
            data,
        );
    }

    /**
     * Decrypts the encrypted data using the private key.
     * @param {string} privateKey - The private key of the user who is decrypting the data.
     * @param {Encrypted} encryptedData - This is the encrypted data that you want to decrypt.
     * @returns The decrypted data.
     */
    static async decrypt(privateKey: string, encryptedData: Encrypted): Promise<string> {
        return EthCrypto.decryptWithPrivateKey(
            privateKey,
            encryptedData,
        );
    }
}

export default AsymmetricEncryptor;
