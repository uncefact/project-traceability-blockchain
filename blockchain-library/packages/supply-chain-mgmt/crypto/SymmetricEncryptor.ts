import { createCipheriv, createDecipheriv } from 'crypto';
import SymmetricKey from './SymmetricKey';

export class SymmetricEncryptor {
    /**
     * Generate a new symmetric key.
     * @returns A new instance of the SymmetricKey class.
     */
    static generateSymmetricKey(): SymmetricKey {
        return new SymmetricKey();
    }

    /**
     * It takes a SymmetricKey object and a string, and returns an encrypted string
     * @param {SymmetricKey} symmetricKey - SymmetricKey
     * @param {string} data - The data to be encrypted.
     * @returns The encrypted data.
     */
    static encrypt(symmetricKey: SymmetricKey, data: string): string {
        const cipher = createCipheriv(symmetricKey.algorithm, symmetricKey.key, symmetricKey.iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return encrypted.toString('hex');
    }

    /**
     * Decrypts the encrypted data using the symmetric key.
     * @param {SymmetricKey} symmetricKey - SymmetricKey
     * @param {string} encryptedData - The encrypted data that you want to decrypt.
     * @returns The decrypted data.
     */
    static decrypt(symmetricKey: SymmetricKey, encryptedData: string): string {
        const decipher = createDecipheriv(symmetricKey.algorithm, symmetricKey.key, symmetricKey.iv);

        let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
}

export default SymmetricEncryptor;
