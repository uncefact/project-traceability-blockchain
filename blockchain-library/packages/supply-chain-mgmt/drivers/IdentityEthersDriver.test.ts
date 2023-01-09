import { UrlJsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import { createMock } from 'ts-auto-mock';
import EthCrypto from 'eth-crypto';
import IdentityEthersDriver from './IdentityEthersDriver';

describe('IdentityEthersDriver', () => {
    let identityDriver: IdentityEthersDriver;

    const testPrivateKey = '0x77d28989707ad7554ab15e1c35859340585e6f786ea05ac0247c1b8b2688c2cc';
    let mockedProvider: UrlJsonRpcProvider;

    beforeAll(() => {
        mockedProvider = createMock<UrlJsonRpcProvider>({
            _isProvider: true,
        });

        identityDriver = new IdentityEthersDriver(
            testPrivateKey,
            mockedProvider,
        );
    });

    it('should correctly inizialize an IdentityEthersDriver', () => {
        const wallet = new Wallet(testPrivateKey, mockedProvider);

        expect(identityDriver.wallet).toBeInstanceOf(Wallet);
        expect(identityDriver.privateKey).toEqual(testPrivateKey);
        expect(identityDriver.publicKey).toEqual(EthCrypto.publicKeyByPrivateKey(testPrivateKey));
        expect(identityDriver.address).toEqual(wallet.address);
    });

    it('should correctly sign a message', async () => {
        const wallet = new Wallet(testPrivateKey, mockedProvider);

        const message = 'This is a sample message';
        const signedMessage = await identityDriver.signMessage(message);
        expect(signedMessage).toEqual(await wallet.signMessage(message));
    });

    it('should correctly verify a signature', async () => {
        const wallet = new Wallet(testPrivateKey, mockedProvider);

        const message = 'This is a sample message';
        const signedMessage = await identityDriver.signMessage(message);
        expect(identityDriver.verifySignature(message, signedMessage, wallet.address)).toBeTruthy();
    });

    it('should correctly verify a signature with no address provided', async () => {
        const message = 'This is a sample message';
        const signedMessage = await identityDriver.signMessage(message);
        expect(identityDriver.verifySignature(message, signedMessage)).toBeTruthy();
    });

    it('should correctly reject a signature', async () => {
        const message = 'This is a sample message';
        const signedMessage = await identityDriver.signMessage('Other message');
        expect(identityDriver.verifySignature(message, signedMessage)).toBeFalsy();
    });
});
