import AsymmetricEncryptor from './AsymmetricEncryptor';

describe('AsymmetricEncryptor', () => {
    const testPrivateKey = '0x77d28989707ad7554ab15e1c35859340585e6f786ea05ac0247c1b8b2688c2cc';
    const testPublicKey = '7d5bf85919b92c5fd0e7a49665a2e9464a36b2762682e97803f20085591991ea9615adc3215747eb796f27ad1db6ee9fbdab1ee78d7de42531eb1aaa4ed87036';

    beforeAll(() => {
    });

    it('should be able to encrypt and decrypt a message', async () => {
        const message = 'Hello World!';
        const encryptedMessage = await AsymmetricEncryptor.encrypt(testPublicKey, message);
        const decryptedMessage = await AsymmetricEncryptor.decrypt(testPrivateKey, encryptedMessage);

        expect(decryptedMessage).toEqual(message);
    });
});
