import SymmetricEncryptor from './SymmetricEncryptor';
import SymmetricKey from './SymmetricKey';

describe('SymmetricEncryptor', () => {
    let testSymmetricKey: SymmetricKey;

    beforeAll(() => {
        testSymmetricKey = SymmetricEncryptor.generateSymmetricKey();
    });

    it('should correctly generate an ecryption key', () => {
        const symmetricKey = SymmetricEncryptor.generateSymmetricKey();

        expect(symmetricKey.algorithm).toEqual('aes-256-cbc');
        expect(symmetricKey.iv).toBeDefined();
        expect(symmetricKey.key).toBeDefined();

        expect(symmetricKey.iv.length).toEqual(16);
        expect(symmetricKey.key.length).toEqual(32);
    });

    it('should correctly encrypt and decrypt a message', () => {
        const message = 'Hello World!';
        const encryptedMessage = SymmetricEncryptor.encrypt(testSymmetricKey, message);
        const decryptedMessage = SymmetricEncryptor.decrypt(testSymmetricKey, encryptedMessage);

        expect(decryptedMessage).toEqual(message);
    });
});
