/* eslint-disable camelcase */
import { JsonRpcProvider, UrlJsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Transaction } from 'mongodb';
import { Quantity } from '../entities/standard/TransformationEvent';
import {
    IdentityEthersDriver,
    MaterialJsonSerializer,
    MaterialEthersDriver,
    AssessmentAssuranceLevel,
    CertificateStatusType,
    Certificate,
    CustomCheck,
    Transformation,
    Material,
    Trade,
    SupplyChainService,
    // EntityService,
    TransformationJsonSerializer,
    TransformationEthersDriver,
    TradeJsonSerializer,
    TradeEthersDriver,
    CertificateEthersDriver,
    JsonStandardService,
    PinataIPFSDriver,
    TransformationEvent,
    TransformationEventStrategy,
    TransformationEventJsonStandardSerializer,
    ObjectEventJsonStandardSerializer,
    SupplyChainUtils,
    EntityService,
    ObjectEvent,
    CertificateJsonSerializer,
    ObjectEventStrategy,
    TransactionEvent,
    TransactionEventJsonStandardSerializer,
    // TransactionEventStandardStrategy,
} from '..';

const NETWORK = 'goerli';
const INFURA_API_KEY = 'a8b015ecd4e3454ba7a7ea5d6ceffe0a';

const IPFS_SECRET_API_KEY = '68d23948f98881261ce7dcc44f436e15e1b53b26fdde2d2d3e682965f74d4ed9';
const IPFS_API_KEY = '7d1ae004f0c35edbc1ac';

const providers = {
    goerli: new ethers.providers.InfuraProvider('goerli', INFURA_API_KEY),
    localhost: new ethers.providers.JsonRpcProvider(),
};
// const PRIVATE_KEY_COMPANY_1 = '0x5117ca8049490b3265518caf157fa51b9ffaf5b539dd045da7117979e53199f3';
// const ADDRESS_COMPANY_1 = '0xa984939D86e473D53B38A2202D9510F3c50fFfa2';
// const PRIVATE_KEY_COMPANY_2 = '0x39f28568511e3a5c83f9e3d22b30f0367edbc6b48ce2e7610174d4cbe8b9afd5';
// const ADDRESS_COMPANY_2 = '0x33e8A3900641852A359fe26a9fCcDe605EcCD9c8';
// const PRIVATE_KEY_COMPANY_3 = '0xa3c3e5a5416eb9c3237b6ff6e6fdbbd7a1c9c913ba5eb66097a6b9908fd8cecd';
// const ADDRESS_COMPANY_3 = '0xEb6a9E11F84967599B6285c5dE187c065EC5CA68';
const PRIVATE_KEY_COMPANY_4 = '30ec96491a4d18e68652a994d3ec3f175abb67d8c446762e450ecd71f39cd5fd';
// const ADDRESS_COMPANY_4 = '0xA2bFa954581395bb9D45dd79b0a8c3370eCf9cB8';
const SMART_CONTRACT_ADDRESS = '0x1DC8BF75bd7c66d6915045B32A09838e47fe3af1';

// const transformationEvent = new TransformationEvent(
//     [],
//     [],
//     [
//         { productClass: 'materialIn1', quantity: '', uom: '' },
//         { productClass: 'materialIn2', quantity: '', uom: '' },
//     ],
//     [{ productClass: 'materialOut1', quantity: '', uom: '' }],
//     'eventID_uuid',
//     '',
//     '2020-07-10 15:00:00.000',
//     '',
//     '',
//     'processType1',
//     '',
//     '',
//     [{
//         referenceStandard: 'processingStandard1',
//         certificateID: '',
//         evidenceURL: '',
//         assessmentLevel: '',
//         criteriaList: [],
//         responsibleAgency: { partyID: '', name: '' },
//     }],
// );

const getConfiguration = async (writerPrivateKey: string) => {
    const provider = providers[NETWORK];

    if (writerPrivateKey === undefined || SMART_CONTRACT_ADDRESS === undefined) { throw new Error('no private key specified'); }

    const identityDriver = new IdentityEthersDriver(writerPrivateKey, provider);

    return {
        provider,
        identityDriver,
    };
};

// export const retrieveAllResourcesFromChain = async <T extends SupplyChainManagementType>(entityService: EntityService<T>) => {
//     const retrievedData = await entityService.retrieveAll();
//     return retrievedData;
// };

// export const storeResourceOnChain = async <T extends SupplyChainManagementType>(entityService: EntityService<T>, data: T) => {
//     try {
//         await entityService.store(data);
//         console.log(`Resource saved on chain! ${data}`);
//     } catch (e) {
//         console.error(`Error while saving resource. Original error: ${e}`);
//     }
// };

// export const addResourceReaderOnChain = async <T extends SupplyChainManagementType>(entityService: EntityService<T>, resourceId: number, readerPublicKey: string, readerAddress: string) => {
//     await entityService.allowRead(resourceId, readerPublicKey, readerAddress);
//     console.log(`Resource index for ${readerAddress} saved on chain!`);
// };

// const getServices = (writerPrivateKey: string) => {
//     const provider = new ethers.providers.InfuraProvider(NETWORK, INFURA_API_KEY);

//     if (writerPrivateKey === undefined || SMART_CONTRACT_ADRESS === undefined) { throw new Error('no private key in .env'); }

//     const identityDriver = new IdentityEthersDriver(writerPrivateKey, provider);

//     const materialSerializer = new MaterialJsonSerializer();
//     const materialDriver = new MaterialEthersDriver(
//         identityDriver,
//         materialSerializer,
//         provider,
//         SMART_CONTRACT_ADRESS,
//     );
//     const materialService = new EntityService<Material>(materialDriver);

//     const transformationSerializer = new TransformationJsonSerializer();
//     const transformationDriver = new TransformationEthersDriver(
//         identityDriver,
//         transformationSerializer,
//         provider,
//         SMART_CONTRACT_ADRESS,
//     );
//     const transformationService = new EntityService<Transformation>(transformationDriver);

//     const tradeSerializer = new TradeJsonSerializer();
//     const tradeDriver = new TradeEthersDriver(
//         identityDriver,
//         tradeSerializer,
//         provider,
//         SMART_CONTRACT_ADRESS,
//     );
//     const tradeService = new EntityService<Trade>(tradeDriver);

//     return {
//         materialService,
//         transformationService,
//         tradeService,
//     };
// };

// const testObjectEvent = async (provider: JsonRpcProvider, identityDriver: IdentityEthersDriver) => {
//     const mockObjectEvent = new ObjectEvent(
//         [],
//         [{ productClass: 'material_product' } as Quantity],
//         'event_type',
//         'event_time',
//         'action_code',
//         'dispositionCode',
//         'businessStepCode',
//         'readPointId',
//         'locationId',
//         [{
//             certificateID: 'certificateId',
//             referenceStandard: 'refStandard',
//             evidenceURL: 'evidenceURL',
//             criteriaList: [],
//             assessmentLevel: 'self-assessed',
//             responsibleAgency: {
//                 partyID: 'partyId',
//                 name: 'name',
//             },
//         }],
//     );
//
//     const mockObjectEventUpdated = new ObjectEvent(
//         [],
//         [{ productClass: 'material_product' } as Quantity],
//         'event_type',
//         'event_time',
//         'action_code',
//         'dispositionCode',
//         'businessStepCode',
//         'readPointId',
//         'locationId',
//         [{
//             certificateID: 'certificateId',
//             referenceStandard: 'refStandardUpdated',
//             evidenceURL: 'evidenceURL',
//             criteriaList: [],
//             assessmentLevel: 'self-assessed',
//             responsibleAgency: {
//                 partyID: 'partyId',
//                 name: 'name',
//             },
//         },
//         {
//             certificateID: 'certificateId2',
//             referenceStandard: 'refStandardNew',
//             evidenceURL: 'evidenceURL',
//             criteriaList: [],
//             assessmentLevel: 'third-party',
//             responsibleAgency: {
//                 partyID: 'partyId',
//                 name: 'name',
//             },
//         }],
//     );
//     const objectEventStandardSerializer = new ObjectEventJsonStandardSerializer();
//     const pinataDriver = new PinataIPFSDriver(
//         API_KEY,
//         API_SECRET,
//         objectEventStandardSerializer,
//     );
//     const certificateSerializer = new CertificateJsonSerializer();
//
//     const certificateDriver = new CertificateEthersDriver(
//         identityDriver,
//         certificateSerializer,
//         provider,
//         SMART_CONTRACT_ADDRESS,
//     );
//     const objectEventStrategy = new ObjectEventStrategy(
//         identityDriver,
//         certificateDriver,
//     );
//     const service = new JsonStandardService<ObjectEvent>(pinataDriver, objectEventStrategy);
//
//     const eventID = await service.store(mockObjectEvent) as string;
//
//     const objectEvent = await service.read(eventID);
//
//     console.log('Object Event before Update', JSON.stringify(objectEvent));
//
//     // TODO: l'eventID dovrebbe essere il valore di ritorno dello store, in modo tale che poi possa venir passato nell'update direttamente come query string
//     await service.update(mockObjectEventUpdated, eventID);
//
//     const objectEventUpdated = await service.read(eventID);
//
//     console.log('Object Event after Update', JSON.stringify(objectEventUpdated));
// };
//
// const testCertificateOnchain = async (provider: UrlJsonRpcProvider, identityDriver: IdentityEthersDriver) => {
//     const mockCertificate = new Certificate(
//         'event_test_id',
//         'certificate ext ID',
//         new Date(),
//         new Date(),
//         ['processingTypes'],
//         'processingStd',
//         ['productTypes'],
//         AssessmentAssuranceLevel.PEER_REVIEW,
//         'reportId',
//         'documentType',
//         'companyID',
//         CertificateStatusType.UNVERFIED,
//         'sourceUrl',
//         'certID',
//     );
//
//     const certificateSerializer = new CertificateJsonSerializer();
//
//     const certificateDriver = new CertificateEthersDriver(
//         identityDriver,
//         certificateSerializer,
//         provider,
//         SMART_CONTRACT_ADDRESS,
//     );
//
//     const entityService = new EntityService<Certificate>(certificateDriver);
//
//     // await entityService.store(mockCertificate);
//
//     console.log('New certificate stored');
//
//     const certificates = await entityService.retrieveAll();
//
//     console.log('All certificates', certificates);
//
//     if (certificates[1].id) {
//         const certificate = await entityService.retrieve(certificates[1].id);
//         console.log('Single Read', certificate);
//
//         if (certificate.id) {
//             const updateCertificate = new Certificate(
//                 'event_test_id',
//                 'certificate ext ID',
//                 new Date(),
//                 new Date(),
//                 ['processingTypes'],
//                 'processingStd',
//                 ['productTypes'],
//                 AssessmentAssuranceLevel.PEER_REVIEW,
//                 'reportId',
//                 'new DocumentType',
//                 'companyID',
//                 CertificateStatusType.UNVERFIED,
//                 'sourceUrl',
//                 certificate.id,
//
//             );
//             await entityService.update(updateCertificate);
//
//             console.log('Certificate Updated');
//
//             const updatedCertificates = await entityService.retrieveAll();
//
//             console.log('All certificates after update', updatedCertificates);
//         }
//     }
// };
//
// const testTransactionEvent = async (provider: JsonRpcProvider, identityDriver: IdentityEthersDriver) => {
//     const mockTransactionEvent = new TransactionEvent(
//         { partyID: 'sourceID', name: 'agency name 1' },
//         { partyID: 'destinationID', name: 'agency name 2' },
//         { type: 'tr', identifier: 'idTrans', documentURL: 'url' },
//         [],
//         [{ productClass: 'material1', quantity: '', uom: '' }, { productClass: 'material2', quantity: '', uom: '' }],
//         '',
//         '2020-07-10 15:00:00.000',
//         '',
//         '',
//         'processType1',
//         '',
//         '',
//         [{
//             certificateID: 'certificateId',
//             referenceStandard: 'refStandard',
//             evidenceURL: 'evidenceURL',
//             criteriaList: [],
//             assessmentLevel: 'self-assessed',
//             responsibleAgency: {
//                 partyID: 'partyId',
//                 name: 'name',
//             },
//         }],
//     );
//
//     const mockTransactionEventUpdated = new TransactionEvent(
//         { partyID: 'sourceID2', name: 'agency name 1' },
//         { partyID: 'destinationID2', name: 'agency name 2' },
//         { type: 'tr', identifier: 'idTrans', documentURL: 'url' },
//         [],
//         [{ productClass: 'material1 updated', quantity: '', uom: '' }, { productClass: 'material2', quantity: '', uom: '' }],
//         '',
//         '2020-07-10 15:00:00.000',
//         '',
//         '',
//         'processType1',
//         '',
//         '',
//         [{
//             certificateID: 'certificateId',
//             referenceStandard: 'refStandard new',
//             evidenceURL: 'evidenceURL',
//             criteriaList: [],
//             assessmentLevel: 'self-assessed',
//             responsibleAgency: {
//                 partyID: 'partyId',
//                 name: 'name',
//             },
//         }],
//     );
//
//     const pinataDriver = new PinataIPFSDriver(
//         API_KEY,
//         API_SECRET,
//     );
//     const tradeSerializer = new TradeJsonSerializer();
//     const tradeDriver = new TradeEthersDriver(
//         identityDriver,
//         tradeSerializer,
//         provider,
//         SMART_CONTRACT_ADDRESS,
//     );
//
//     const materialsSerializer = new MaterialJsonSerializer();
//     const materialDriver = new MaterialEthersDriver(
//         identityDriver,
//         materialsSerializer,
//         provider,
//         SMART_CONTRACT_ADDRESS,
//     );
//
//     const transactionEventStrategy = new TransactionEventStandardStrategy(
//         identityDriver,
//         materialDriver,
//         tradeDriver,
//     );
//     const service = new JsonStandardService<TransactionEvent>(pinataDriver, transactionEventStrategy);
//
//     const eventID = await service.store(mockTransactionEvent) as string;
//     console.log('EventID: ', eventID);
//
//     const transactionEvent = await service.read(eventID);
//
//     console.log('Transaction Event before Update', JSON.stringify(transactionEvent));
//
//     await service.update(mockTransactionEventUpdated, eventID);
//
//     const transactionEventUpdated = await service.read(eventID);
//
//     console.log('Transaction Event after Update', JSON.stringify(transactionEventUpdated));
// };

(async () => {
    // const {
    //     provider,
    //     identityDriver,
    // } = await getConfiguration(PRIVATE_KEY_COMPANY_4);
    //
    const transformationEvent = new TransformationEvent(
        [], [], [{productClass: "inMaterialName"}],
        [{productClass: "outMaterialName"}], "Daily",
        "10-10-2022", "", "", "processType",
        "", "", []
    );

    const provider = providers.goerli;

    const identityDriver = new IdentityEthersDriver(PRIVATE_KEY_COMPANY_4, provider);

    const transformationSerializer = new TransformationJsonSerializer();
    const transformationDriver = new TransformationEthersDriver(
        identityDriver,
        transformationSerializer,
        provider,
        SMART_CONTRACT_ADDRESS,
    );

    const materialSerializer = new MaterialJsonSerializer();
    const materialDriver = new MaterialEthersDriver(
        identityDriver,
        materialSerializer,
        provider,
        SMART_CONTRACT_ADDRESS,
    );

    const pinataDriver = new PinataIPFSDriver(IPFS_API_KEY, IPFS_SECRET_API_KEY);
    const transformationEventStrategy = new TransformationEventStrategy(
        identityDriver,
        materialDriver,
        transformationDriver,
    );

    const transformationEventService = new JsonStandardService<TransformationEvent>(
        pinataDriver,
        transformationEventStrategy,
    );

    let events = await transformationEventService.read();
    console.log("events: ", events)

    console.log("store on chain...")
    await transformationEventService.store(transformationEvent, 'QmTSvHRn8WPv9KnNAABiPrzCvynkz44VrQ1W9nTYy6c5BE', 'Produzione di latte del 12-11-2022');

    events = await transformationEventService.read();
    console.log("events: ", events)

    // await testCertificateOnchain(provider, identityDriver);
    // await testObjectEvent(provider, identityDriver);
    // await testTransactionEvent(provider, identityDriver);

    // const event = '{ "outputItemList": [ { "itemID": "http://example.com", "name": "string" } ], "inputItemList": [ { "itemID": "http://example.com", "name": "string" } ], "inputQuantityList": [ { "productClass": "materiale in input 10", "quantity": "30", "uom": "m" }, { "productClass": "materiale in input 11", "quantity": "30", "uom": "m" } ], "outputQuantityList": [ { "productClass": "materiale di output 1", "quantity": "string", "uom": "string" } ], "eventID": "eventID_uuid6", "eventType": "string", "eventTime": "2022-07-13 15:06:44", "actionCode": "string", "dispositionCode": "string", "businessStepCode": "process type 1", "readPointId": "string", "locationId": "string", "certification": [ { "certificateID": "http://example.com", "referenceStandard": "referenced standard 1 del certificato", "evidenceURL": "http://example.com", "criteriaList": [ "http://example.com" ], "assessmentLevel": "string", "responsibleAgency": { "partyID": "http://example.com", "name": "string" } } ] }';
    // const eventUpdated = '{ "outputItemList": [ { "itemID": "http://example.com", "name": "string" } ], "inputItemList": [ { "itemID": "http://example.com", "name": "string" } ], "inputQuantityList": [ { "productClass": "materiale in input 10 aggiornato", "quantity": "30", "uom": "m" }, { "productClass": "materiale in input 11", "quantity": "30", "uom": "m" } ], "outputQuantityList": [ { "productClass": "materiale di output 1 aggiornato", "quantity": "string", "uom": "string" } ], "eventID": "eventID_uuid6", "eventType": "string", "eventTime": "2022-07-20 20:06:44", "actionCode": "string", "dispositionCode": "string", "businessStepCode": "process type 1", "readPointId": "string", "locationId": "string", "certification": [ { "certificateID": "http://example.com", "referenceStandard": "referenced standard 1 aggiornato del certificato", "evidenceURL": "http://example.com", "criteriaList": [ "http://example.com" ], "assessmentLevel": "string", "responsibleAgency": { "partyID": "http://example.com", "name": "string" } } ] }';

    // const tradeSerializer = new TradeJsonSerializer();
    // const tradeDriver = new TradeEthersDriver(
    //     identityDriver,
    //     tradeSerializer,
    //     provider,
    //     SMART_CONTRACT_ADDRESS,
    // );

    // const transformationSerializer = new TransformationJsonSerializer();
    // const transformationDriver = new TransformationEthersDriver(
    //     identityDriver,
    //     transformationSerializer,
    //     provider,
    //     SMART_CONTRACT_ADDRESS,
    // );

    // const materialSerializer = new MaterialJsonSerializer();
    // const materialDriver = new MaterialEthersDriver(
    //     identityDriver,
    //     materialSerializer,
    //     provider,
    //     SMART_CONTRACT_ADDRESS,
    // );
    // let mats = await materialDriver.retrieveAll();
    // mats.forEach((m) => console.log('Material: ', m));
    // let trans = await transformationDriver.retrieveAll();
    // trans.forEach((t) => console.log('Transformation: ', t));

    // // const newTrasformationEvent = transformationEventStandardSerializer.deserialize(event);
    // const pinataDriver = new PinataIPFSDriver(
    //     API_KEY,
    //     API_SECRET,
    // );

    // const transformationEventStrategy = new TransformationEventStrategy(
    //     identityDriver,
    //     materialDriver,
    //     transformationDriver,
    // );

    // const transformationEventStandardService = new JsonStandardService<TransformationEvent>(
    //     pinataDriver,
    //     transformationEventStrategy,
    // );

    // await transformationEventStandardService.store(newTrasformationEvent);

    // console.log('After TransformationEvent store...');
    // mats = await materialDriver.retrieveAll();
    // mats.forEach((m) => console.log('Material: ', m));
    // trans = await transformationDriver.retrieveAll();
    // trans.forEach((t) => console.log('Transformation: ', t));

    // const trasformationEvent : TransformationEvent = await transformationEventStandardService.read('eventID_uuid6');
    // console.log('TrasformationEvent - Read: ', trasformationEvent.eventID);

    // const serializedTUpdatedEvent = transformationEventStandardSerializer.deserialize(eventUpdated);
    // await transformationEventStandardService.update(serializedTUpdatedEvent);
    // console.log('After TransformationEvent update...');
    // mats = await materialDriver.retrieveAll();
    // mats.forEach((m) => console.log('Material: ', m));
    // trans = await transformationDriver.retrieveAll();
    // trans.forEach((t) => console.log('Transformation: ', t));

    // const material1 = new Material(1, ADDRESS_COMPANY_1, 'material1');
    // const material2 = new Material(2, ADDRESS_COMPANY_1, 'material2');
    // const material3 = new Material(3, ADDRESS_COMPANY_2, 'material3');
    // const material4 = new Material(4, ADDRESS_COMPANY_2, 'material4');
    // const material5 = new Material(5, ADDRESS_COMPANY_3, 'material5');
    // const material6 = new Material(6, ADDRESS_COMPANY_3, 'material6');
    // const material7 = new Material(7, ADDRESS_COMPANY_3, 'material7');
    // const material8 = new Material(8, ADDRESS_COMPANY_4, 'material8');
    // const material9 = new Material(9, ADDRESS_COMPANY_4, 'material9');

    // const transformation1 = new Transformation(1, ADDRESS_COMPANY_1, [material1.id], material2.id, 'transformation1');
    // const transformation2 = new Transformation(2, ADDRESS_COMPANY_2, [material3.id], material4.id, 'transformation2');
    // const transformation3 = new Transformation(3, ADDRESS_COMPANY_3, [material5.id, material6.id], material7.id, 'transformation3');
    // const transformation4 = new Transformation(4, ADDRESS_COMPANY_4, [material8.id], material9.id, 'transformation4');

    // const trade1 = new Trade(1, ADDRESS_COMPANY_1, [[material2.id, material5.id]], 'trade1');
    // const trade2 = new Trade(2, ADDRESS_COMPANY_2, [[material4.id, material6.id]], 'trade2');
    // const trade3 = new Trade(3, ADDRESS_COMPANY_3, [[material7.id, material8.id]], 'trade3');

    // const processingStd0 = 'processingStd0';
    // const processingStd1 = 'processingStd1';
    // const processingStd2 = 'processingStd2';
    // const material0 = new Material(0, 'owner', 'material0', [], '', 0);
    // const material1 = new Material(1, 'owner', 'material1', [], '', 0);
    // const material2 = new Material(2, 'owner', 'material2', [], '', 2);
    // const material3 = new Material(3, 'owner', 'material3', [], '', 1);
    // const material4 = new Material(4, 'owner', 'material4', [], '', 1);
    // const material5 = new Material(5, 'owner', 'material5', [], '', 2);
    // const material6 = new Material(6, 'owner', 'material6', [], '', 2);
    // const material7 = new Material(7, 'owner', 'material7', [], '', 3);
    // const material8 = new Material(8, 'owner', 'material8', [], '', 3);

    // const transformation0 = new Transformation(0, 'event1', 'owner', [0], 1, 'transformation0', new Date(), new Date(), [], [processingStd0], '', 0);
    // const transformation1 = new Transformation(1, 'event2', 'owner', [3], 4, 'transformation1', new Date(), new Date(), [], [], '', 1);
    // const transformation2 = new Transformation(2, 'event3', 'owner', [2, 5], 6, 'transformation2', new Date(), new Date(), [], [], '', 2);
    // const transformation3 = new Transformation(3, 'event4', 'owner', [7], 8, 'transformation3', new Date(), new Date(), [], [processingStd0], '', 3);

    // const trade0 = new Trade(0, 'owner', [[1, 2]], 'trade0', [], [], 0);
    // const trade1 = new Trade(1, 'owner', [[4, 5]], 'trade1', [], [], 1);
    // const trade2 = new Trade(2, 'owner', [[6, 7]], 'trade2', [], [processingStd1], 2);
    // const trade3 = new Trade(3, 'owner', [[6, 7]], 'trade3', [], [processingStd2], 2);

    // const certificate0 = new Certificate(0, new Date(), new Date(), [], processingStd0, [], AssessmentAssuranceLevel.PEER_REVIEW, '0', '', 0, CertificateStatusType.ACCEPTED, '');

    // const certificate1 = new Certificate(1, new Date(), new Date(), [], processingStd0, [], AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION, 'grem', '17', 3, CertificateStatusType.ACCEPTED, '');

    // const certificate2 = new Certificate(2, new Date(), new Date(), [], processingStd0, [], AssessmentAssuranceLevel.UNVERIFIED_SELF_DECLARATION, 'grem', '17', 0, CertificateStatusType.ACCEPTED, '');

    // const certificate3 = new Certificate(3, new Date(), new Date(), [], processingStd1, [], AssessmentAssuranceLevel.UNVERIFIED_SELF_DECLARATION, '0', '', 2, CertificateStatusType.ACCEPTED, '', 2);

    // const certificate4 = new Certificate(4, new Date(), new Date(), [], processingStd2, [], AssessmentAssuranceLevel.UNVERIFIED_SELF_DECLARATION, '0', '', 2, CertificateStatusType.ACCEPTED, '', 3);

    // const CUSTOM_DATA = {
    //     materials: [
    //         material0,
    //         material1,
    //         material2,
    //         material3,
    //         material4,
    //         material5,
    //         material6,
    //         material7,
    //         material8,
    //     ],
    //     transformations: [
    //         transformation0,
    //         transformation1,
    //         transformation2,
    //         transformation3,
    //     ],
    //     trades: [
    //         trade0,
    //         trade1,
    //         trade2,
    //         trade3,
    //     ],
    //     certificates: [
    //         certificate0,
    //         certificate1,
    //         certificate2,
    //         certificate3,
    //         certificate4,
    //     ],
    // };
    // const supplyChainService = new SupplyChainService(materialDriver, transformationDriver, tradeDriver);

    // const HAELIXA_DOCUMENT_TYPE = '17';

    // // FIXME: project-specific logic, should be delegated to the code using the library
    // const isHaelixaCertificate = (certificate: Certificate) => certificate.documentType === HAELIXA_DOCUMENT_TYPE
    // /* Checking if the certificate is a third party certification. */
    // && certificate.assessmentAssuranceLevel === AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION;

    // // FIXME: project-specific logic, should be delegated to the code using the library
    // const verifyHaelixaCompliancy: CustomCheck = (
    //     processingStd: string,
    //     currentTransformation: Transformation,
    //     preivousTransformations: Transformation[],
    //     certificates: Certificate[],
    // ) => {
    //     const transformationCertificates = SupplyChainUtils.filterCurrentTransformationCertificates(currentTransformation, certificates);
    //     const preivousTransformationsCertificates = preivousTransformations.flatMap((t: Transformation) => SupplyChainUtils.filterCurrentTransformationCertificates(t, certificates));

    //     const haelixaCertificates = transformationCertificates.filter((certificate: Certificate) => certificate.processingStd === processingStd
    //     && isHaelixaCertificate(certificate));

    //     return haelixaCertificates.every((certificate: Certificate) => preivousTransformationsCertificates.some((preivousTransformationsCertificate: Certificate) => preivousTransformationsCertificate.assessmentAssuranceLevel !== AssessmentAssuranceLevel.THIRD_PARTY_CERTIFICATION
    //     && preivousTransformationsCertificate.documentType === HAELIXA_DOCUMENT_TYPE
    //     && preivousTransformationsCertificate.reportId === certificate.reportId));
    // };

    // // export const retrieveAllResourcesFromChain = async <T extends UneceType>(entityService: EntityService<T>) => {
    // //     const retrievedData = await entityService.retrieveAll();
    // //     return retrievedData;
    // // };

    // // export const storeResourceOnChain = async <T extends UneceType>(entityService: EntityService<T>, data: T) => {
    // //     try {
    // //         await entityService.store(data);
    // //         console.log(`Resource saved on chain! ${data}`);
    // //     } catch (e) {
    // //         console.error(`Error while saving resource. Original error: ${e}`);
    // //     }
    // // };

    // // export const addResourceReaderOnChain = async <T extends UneceType>(entityService: EntityService<T>, resourceId: number, readerPublicKey: string, readerAddress: string) => {
    // //     await entityService.allowRead(resourceId, readerPublicKey, readerAddress);
    // //     console.log(`Resource index for ${readerAddress} saved on chain!`);
    // // };

    // // const getServices = (writerPrivateKey: string) => {
    // //     const provider = new ethers.providers.InfuraProvider(NETWORK, INFURA_API_KEY);

    // //     if (writerPrivateKey === undefined || SMART_CONTRACT_ADDRESS === undefined) { throw new Error('no private key in .env'); }

    // //     const identityDriver = new IdentityEthersDriver(writerPrivateKey, provider);

    // //     const materialSerializer = new MaterialJsonSerializer();
    // //     const materialDriver = new MaterialEthersDriver(
    // //         identityDriver,
    // //         materialSerializer,
    // //         provider,
    // //         SMART_CONTRACT_ADDRESS,
    // //     );
    // //     const materialService = new EntityService<Material>(materialDriver);

    // //     const transformationSerializer = new TransformationJsonSerializer();
    // //     const transformationDriver = new TransformationEthersDriver(
    // //         identityDriver,
    // //         transformationSerializer,
    // //         provider,
    // //         SMART_CONTRACT_ADDRESS,
    // //     );
    // //     const transformationService = new EntityService<Transformation>(transformationDriver);

    // //     const tradeSerializer = new TradeJsonSerializer();
    // //     const tradeDriver = new TradeEthersDriver(
    // //         identityDriver,
    // //         tradeSerializer,
    // //         provider,
    // //         SMART_CONTRACT_ADDRESS,
    // //     );
    // //     const tradeService = new EntityService<Trade>(tradeDriver);

    // //     return {
    // //         materialService,
    // //         transformationService,
    // //         tradeService,
    // //     };
    // // };

    // const {
    //     materialService,
    //     transformationService,
    //     tradeService,
    // } = getServices(PRIVATE_KEY_COMPANY_1);
    // // // const material1 = new Material(31, 'material1');
    // // // await storeResourceOnChain(materialService, materialAdapter, material1);
    // // // await addResourceReaderOnChain(materialService, materialAdapter, material1.id, getPublicKey(PRIVATE_KEY_COMPANY_3));
    // // // await addResourceReaderOnChain(materialService, materialAdapter, material1.id, getPublicKey(PRIVATE_KEY_COMPANY_2));

    // // const provider = new ethers.providers.InfuraProvider(NETWORK, INFURA_API_KEY);
    // // const readerIdentity = new IdentityEthersDriver(PRIVATE_KEY_COMPANY_3, provider);

    // // await storeResourceOnChain(materialService, material1);
    // // await storeResourceOnChain(materialService, material2);

    // // await storeResourceOnChain(transformationService, transformation1);

    // // await storeResourceOnChain(materialService, material5);
    // // await addResourceReaderOnChain(materialService, material1.id, readerIdentity.publicKey, readerIdentity.address);
    // // await addResourceReaderOnChain(materialService, material2.id, readerIdentity.publicKey, readerIdentity.address);
    // // await addResourceReaderOnChain(materialService, material5.id, readerIdentity.publicKey, readerIdentity.address);

    // // await addResourceReaderOnChain(transformationService, transformation1.id, readerIdentity.publicKey, readerIdentity.address);

    // // await storeResourceOnChain(tradeService, trade1);
    // // await addResourceReaderOnChain(tradeService, trade1.id, readerIdentity.publicKey, readerIdentity.address);

    // // const input = {
    // //     materials: [
    // //         material1,
    // //         material2,
    // //         material3,
    // //         material4,
    // //         material5,
    // //         material6,
    // //         material7,
    // //         material8,
    // //         material9,
    // //     ] as Array<NewMaterial>,
    // //     transformations: [
    // //         transformation1,
    // //         transformation2,
    // //         transformation3,
    // //         transformation4,
    // //     ] as Array<NewTransformation>,
    // //     trades: [
    // //         trade1,
    // //         trade2,
    // //         trade3,
    // //     ] as Array<NewTrade>,
    // //     certificates: [],
    // // };
    // // const resp = SupplyChainGraphPresenter.present(
    // //     input,
    // //     material9.id
    // // );
    // supplyChainService.setSupplyChainData(
    //     CUSTOM_DATA.materials,
    //     CUSTOM_DATA.transformations,
    //     CUSTOM_DATA.trades,
    //     CUSTOM_DATA.certificates,
    // );
    // const generatedGraph = supplyChainService.computeGraphData(
    //     8,
    //     [processingStd0, processingStd1, processingStd2],
    //     [verifyHaelixaCompliancy],
    // );

    // console.log(generatedGraph);
})();
