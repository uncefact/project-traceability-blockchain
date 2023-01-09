/* eslint-disable camelcase */
import { UrlJsonRpcProvider } from '@ethersproject/providers';
import { createMock } from 'ts-auto-mock';
import EthCrypto from 'eth-crypto';
import CertificateEthersDriver from './CertificateEthersDriver';
import IdentityEthersDriver from './IdentityEthersDriver';
import { UneceCottonTracking, UneceCottonTracking__factory } from '../smart-contracts';
import EntitySerializer from '../serializers/EntitySerializer.interface';
import SymmetricEncryptor from '../crypto/SymmetricEncryptor';
import SymmetricKey from '../crypto/SymmetricKey';
import AsymmetricEncryptor from '../crypto/AsymmetricEncryptor';
import Certificate, { AssessmentAssuranceLevel, CertificateStatusType } from '../entities/Certificate';

jest.mock('nanoid', () => ({
    nanoid: jest.fn().mockReturnValue('uuid-test'),
}));

describe('CertificateEthersDriver', () => {
    let certificateEthersDriver: CertificateEthersDriver;

    let mockedIdentityDriver: IdentityEthersDriver;
    let mockedSerializer: EntitySerializer<Certificate>;
    let mockedProvider: UrlJsonRpcProvider;

    const testPrivateKey = '0x77d28989707ad7554ab15e1c35859340585e6f786ea05ac0247c1b8b2688c2cc';
    const testPublicKey = EthCrypto.publicKeyByPrivateKey(testPrivateKey);
    const testAddress = EthCrypto.publicKey.toAddress(testPublicKey);
    const testSymmetricKey = new SymmetricKey();

    const mockedContractConnect = jest.fn();

    const mockedWait = jest.fn();
    const mockedStoreCertificate = jest.fn();
    const mockedUpdateCertificate = jest.fn();
    const mockedGetCertificatesIndexes = jest.fn();
    const mockedStoreCertificateIndex = jest.fn();
    const mockedGetCertificate = jest.fn();

    const mockedSerialize = jest.fn();
    const mockedDeserialize = jest.fn();

    let generateSymmetricKeySpy: jest.SpyInstance;

    const now = new Date();
    const inAMinute = new Date(now.getTime() + 60000);

    beforeAll(() => {
        mockedStoreCertificate.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedUpdateCertificate.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedStoreCertificateIndex.mockReturnValue(Promise.resolve({
            wait: mockedWait,
        }));
        mockedContractConnect.mockReturnValue({
            storeCertificate: mockedStoreCertificate,
            updateCertificate: mockedUpdateCertificate,
            getCertificatesIndexes: mockedGetCertificatesIndexes,
            storeCertificateIndex: mockedStoreCertificateIndex,
            getCertificate: mockedGetCertificate,
        });
        const mockedUneceCottonTracking = createMock<UneceCottonTracking>({
            connect: mockedContractConnect,
        });
        jest.spyOn(UneceCottonTracking__factory, 'connect').mockReturnValue(mockedUneceCottonTracking);

        mockedIdentityDriver = createMock<IdentityEthersDriver>({
            privateKey: testPrivateKey,
            publicKey: testPublicKey,
            address: testAddress,
        });
        mockedSerializer = createMock<EntitySerializer<Certificate>>({
            serialize: mockedSerialize,
            deserialize: mockedDeserialize,
        });
        mockedProvider = createMock<UrlJsonRpcProvider>({
            _isProvider: true,
        });

        certificateEthersDriver = new CertificateEthersDriver(
            mockedIdentityDriver,
            mockedSerializer,
            mockedProvider,
            testAddress,
        );

        generateSymmetricKeySpy = jest.spyOn(SymmetricEncryptor, 'generateSymmetricKey');
        generateSymmetricKeySpy.mockImplementation(() => testSymmetricKey);
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should correctly store a certificate using contract methods', async () => {
        const certificate = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert123',
            'ownerAddressTest',
            'trade789',
        );

        mockedSerialize.mockReturnValue('serializedCertificate');

        const testEncryptedCertificate = SymmetricEncryptor.encrypt(
            testSymmetricKey,
            'serializedCertificate',
        );

        const response = await certificateEthersDriver.store(certificate);

        expect(response).toEqual(testSymmetricKey);
        expect(mockedSerialize).toHaveBeenCalledTimes(1);
        expect(mockedSerialize).toHaveBeenNthCalledWith(1, certificate);

        expect(mockedStoreCertificate).toHaveBeenCalledTimes(1);
        expect(mockedStoreCertificate).toHaveBeenNthCalledWith(
            1,
            'cert123',
            'ownerAddressTest',
            testEncryptedCertificate,
        );
        expect(mockedWait).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when smart contract store certificate fails', async () => {
        const certificate = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert789',
            'ownerAddressTest',
        );
        mockedSerialize.mockReturnValue('serializedCertificate');

        mockedWait.mockRejectedValue(new Error());

        const storeFn = () => certificateEthersDriver.store(certificate);

        expect(storeFn).rejects.toThrowError(new Error('Error while creating certificate: Error'));
    });

    it('should correctly update a certificate using contract methods', async () => {
        const certificate = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert123',
            'ownerAddressTest',
            'trade789',
        );
        const certificateIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'cert123')),
            },
        ];
        mockedGetCertificatesIndexes.mockResolvedValue(certificateIndexes);

        mockedSerialize.mockReturnValue('serializedCertificate');

        const testEncryptedCertificate = SymmetricEncryptor.encrypt(
            testSymmetricKey,
            'serializedCertificate',
        );

        mockedWait.mockResolvedValue('test');

        await certificateEthersDriver.update(certificate);

        expect(mockedSerialize).toHaveBeenCalledTimes(1);
        expect(mockedSerialize).toHaveBeenNthCalledWith(1, certificate);

        expect(mockedUpdateCertificate).toHaveBeenCalledTimes(1);
        expect(mockedUpdateCertificate).toHaveBeenNthCalledWith(
            1,
            'cert123',
            testEncryptedCertificate,
        );
        expect(mockedWait).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when smart contract update certificate fails', async () => {
        const certificate = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert123',
            'ownerAddressTest',
            'trade789',
        );
        const certificateIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'cert2')),
            },
        ];
        mockedGetCertificatesIndexes.mockResolvedValue(certificateIndexes);

        mockedSerialize.mockReturnValue('serializedCertificate');

        const updateFn = () => certificateEthersDriver.update(certificate);
        expect(updateFn).rejects.toThrowError(new Error('Error while updating certificate: Error: Certificate with id cert123 not found'));
    });

    it('should store a new index for certificate using adapter', async () => {
        const certificate = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert123',
            'ownerAddressTest',
            'trade789',
        );
        const certificateIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'cert123')),
            },
        ];
        mockedGetCertificatesIndexes.mockResolvedValue(certificateIndexes);

        await certificateEthersDriver.allowRead(
            certificate.id,
        );

        expect(mockedStoreCertificateIndex).toBeCalledTimes(1);
        expect(mockedStoreCertificateIndex).toHaveBeenNthCalledWith(
            1,
            testAddress,
            expect.any(String),
            expect.any(String),
        );

        const obtainedEncryptedSymmetricKey = mockedStoreCertificateIndex.mock.calls[0][1];
        const obtainedEncryptedDataIndex = mockedStoreCertificateIndex.mock.calls[0][2];

        const obtainedSymmetricKey = await AsymmetricEncryptor.decrypt(testPrivateKey, JSON.parse(obtainedEncryptedSymmetricKey));
        const obtainedDataIndex = await AsymmetricEncryptor.decrypt(testPrivateKey, JSON.parse(obtainedEncryptedDataIndex));

        expect(testSymmetricKey.toJson()).toEqual(obtainedSymmetricKey);
        expect(String(certificate.id)).toEqual(obtainedDataIndex);
    });

    it('should throw an error when smart contract storeCertificateIndex fails', async () => {
        const certificate = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert123',
            'ownerAddressTest',
            'trade789',
        );
        const certificateIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'cert2')),
            },
        ];
        mockedGetCertificatesIndexes.mockResolvedValue(certificateIndexes);
        mockedStoreCertificateIndex.mockRejectedValue(new Error());

        mockedSerialize.mockReturnValue('serializedCertificate');

        const allowReadFn = () => certificateEthersDriver.allowRead(
            certificate.id,
            testPublicKey,
            testAddress,
            testSymmetricKey,
        );
        expect(allowReadFn).rejects.toThrowError(new Error('Error while adding new reader: Error'));
    });

    it('should retrieve the list of certificates using using contract methods', async () => {
        const certificate1 = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert123',
            'ownerAddressTest1',
            'trade789',
        );
        const certificate2 = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert456',
            'ownerAddressTest2',
            'trade789',
        );

        const certificateIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'cert42')),
            },
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'cert43')),
            },
        ];
        mockedGetCertificatesIndexes.mockReturnValue(certificateIndexes);

        mockedDeserialize.mockReturnValueOnce(certificate1);
        mockedDeserialize.mockReturnValueOnce(certificate2);

        const encyptedCertificate1 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'foo'),
        };
        const encyptedCertificate2 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'bar'),
        };
        mockedGetCertificate.mockReturnValueOnce(encyptedCertificate1);
        mockedGetCertificate.mockReturnValueOnce(encyptedCertificate2);

        const retrievedCertificate = await certificateEthersDriver.retrieveAll();

        expect(retrievedCertificate).toEqual([certificate1, certificate2]);
    });

    it('should retrieve an empty list of certificates using using contract methods', async () => {
        mockedGetCertificatesIndexes.mockReturnValue([]);

        const retrievedCertificate = await certificateEthersDriver.retrieveAll();

        expect(retrievedCertificate).toEqual([]);
    });

    it('should throw an error when smart contract getCertificatesIndexes fails', async () => {
        mockedGetCertificatesIndexes.mockRejectedValue(new Error());

        mockedSerialize.mockReturnValue('serializedCertificate');

        const retrieveAllFn = () => certificateEthersDriver.retrieveAll();
        expect(retrieveAllFn).rejects.toThrowError(new Error('Error while retrieving certificates: Error'));
    });

    it('should retrieve a certificate using using contract methods', async () => {
        const certificate1 = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert123',
            'ownerAddressTest1',
            'trade789',
        );
        const certificate2 = new Certificate(
            'externalEventIdTest',
            'externalCertificateIdTest',
            now,
            inAMinute,
            ['processTypeTest'],
            'processingStdTest',
            ['productTypeTest'],
            AssessmentAssuranceLevel.PEER_REVIEW,
            'reportIdTest',
            'documentTypeTest',
            'companyID',
            CertificateStatusType.ACCEPTED,
            'sourceUrlTest',
            'cert456',
            'ownerAddressTest2',
            'trade789',
        );

        const certificateIndexes = [
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'cert123')),
            },
            {
                encrypted_symmetric_key: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, testSymmetricKey.toJson())),
                encrypted_id: JSON.stringify(await AsymmetricEncryptor.encrypt(testPublicKey, 'cert456')),
            },
        ];
        mockedGetCertificatesIndexes.mockReturnValue(certificateIndexes);

        mockedDeserialize.mockReturnValueOnce(certificate1);
        mockedDeserialize.mockReturnValueOnce(certificate2);

        const encyptedCertificate1 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'foo'),
        };
        const encyptedCertificate2 = {
            encrypted_data: SymmetricEncryptor.encrypt(testSymmetricKey, 'bar'),
        };
        mockedGetCertificate.mockReturnValueOnce(encyptedCertificate1);
        mockedGetCertificate.mockReturnValueOnce(encyptedCertificate2);

        const retrievedCertificate = await certificateEthersDriver.retrieve('cert123');

        expect(retrievedCertificate).toEqual(certificate1);
    });

    it('should throw an error when resource is not found', async () => {
        mockedGetCertificatesIndexes.mockResolvedValue([]);

        const retrieveFn = () => certificateEthersDriver.retrieve('cert42');
        expect(retrieveFn).rejects.toThrowError(new Error('Error while retrieving certificate: Error: Certificate with id cert42 not found'));
    });

    it('should throw an error when retrieveAll fails', async () => {
        mockedGetCertificatesIndexes.mockRejectedValue(new Error());

        const retrieveFn = () => certificateEthersDriver.retrieve('cert42');
        expect(retrieveFn).rejects.toThrowError(new Error('Error while retrieving certificate: Error: Error while retrieving certificates: Error'));
    });
});
