import {
    EntityService,
    MaterialEthersDriver,
    MaterialJsonSerializer,
    IdentityEthersDriver,
    Material,
    Transformation,
    TransformationJsonSerializer,
    TransformationEthersDriver,
    TradeJsonSerializer,
    Trade,
    TradeEthersDriver,
    JsonStandardService,
    TransformationEvent,
    PinataIPFSDriver,
    TransformationEventStrategy,
    CertificateJsonSerializer,
    CertificateEthersDriver,
    ObjectEventStrategy,
    ObjectEvent,
    TransactionEvent,
    TransactionEventStrategy
} from '@blockchain-lib/supply-chain-mgmt';
import { ethers } from 'ethers';
import { retrieveConfigurationSecrets, retrieveIPFSSecrets } from './secretUtils';


export const buildIdentityDriver = async (writerPrivateKey: string): Promise<IdentityEthersDriver> => {
    const {
        provider,
        identityDriver,
        CONTRACT_ADDRESS
    } = await getConfiguration(writerPrivateKey);
    return identityDriver;
}


export const buildMaterialService = async (writerPrivateKey: string): Promise<EntityService<Material>> => {
    const {
        provider,
        identityDriver,
        CONTRACT_ADDRESS
    } = await getConfiguration(writerPrivateKey);

    const materialSerializer = new MaterialJsonSerializer();
    const materialDriver = new MaterialEthersDriver(
        identityDriver,
        materialSerializer,
        provider,
        CONTRACT_ADDRESS
    );
    return new EntityService<Material>(materialDriver);
}

export const buildTransformationService = async (writerPrivateKey: string): Promise<EntityService<Transformation>> => {
    const {
        provider,
        identityDriver,
        CONTRACT_ADDRESS
    } = await getConfiguration(writerPrivateKey);

    const transformationSerializer = new TransformationJsonSerializer();
    const transformationDriver = new TransformationEthersDriver(
        identityDriver,
        transformationSerializer,
        provider,
        CONTRACT_ADDRESS
    );
    return new EntityService<Transformation>(transformationDriver);

}

export const buildTradeService = async (writerPrivateKey: string): Promise<EntityService<Trade>> => {
    const {
        provider,
        identityDriver,
        CONTRACT_ADDRESS
    } = await getConfiguration(writerPrivateKey);

    const tradeSerializer = new TradeJsonSerializer();
    const tradeDriver = new TradeEthersDriver(
        identityDriver,
        tradeSerializer,
        provider,
        CONTRACT_ADDRESS
    );
    return new EntityService<Trade>(tradeDriver);
}

export const buildTransformationStandardService = async (writerPrivateKey: string): Promise<JsonStandardService<TransformationEvent>> => {
    const {
        provider,
        identityDriver,
        CONTRACT_ADDRESS
    } = await getConfiguration(writerPrivateKey);
    const {
        API_KEY,
        SECRET_API_KEY
    } = await retrieveIPFSSecrets();

    const transformationSerializer = new TransformationJsonSerializer();
    const transformationDriver = new TransformationEthersDriver(
        identityDriver,
        transformationSerializer,
        provider,
        CONTRACT_ADDRESS
    );

    const materialSerializer = new MaterialJsonSerializer();
    const materialDriver = new MaterialEthersDriver(
        identityDriver,
        materialSerializer,
        provider,
        CONTRACT_ADDRESS
    );
    if (!API_KEY || !SECRET_API_KEY)
        throw new Error("Api keys are not setted in Google Secret");

    const pinataDriver = new PinataIPFSDriver(API_KEY, SECRET_API_KEY);

    const transformationEventStrategy = new TransformationEventStrategy(
        identityDriver,
        materialDriver,
        transformationDriver,
    );

    return new JsonStandardService<TransformationEvent>(
        pinataDriver,
        transformationEventStrategy
    );
}

export const buildTransactionStandardService = async (writerPrivateKey: string): Promise<JsonStandardService<TransactionEvent>> => {
    const {
        provider,
        identityDriver,
        CONTRACT_ADDRESS
    } = await getConfiguration(writerPrivateKey);
    const {
        API_KEY,
        SECRET_API_KEY
    } = await retrieveIPFSSecrets();

    const tradeSerializer = new TradeJsonSerializer();
    const tradeDriver = new TradeEthersDriver(
        identityDriver,
        tradeSerializer,
        provider,
        CONTRACT_ADDRESS
    );

    const materialSerializer = new MaterialJsonSerializer();
    const materialDriver = new MaterialEthersDriver(
        identityDriver,
        materialSerializer,
        provider,
        CONTRACT_ADDRESS
    );
    if (!API_KEY || !SECRET_API_KEY)
        throw new Error("Api keys are not setted in Google Secret");

    const pinataDriver = new PinataIPFSDriver(API_KEY, SECRET_API_KEY);

    const transactionEventStrategy = new TransactionEventStrategy(
        identityDriver,
        materialDriver,
        tradeDriver,
    );

    return new JsonStandardService<TransactionEvent>(
        pinataDriver,
        transactionEventStrategy
    );
}


export const buildObjectEventStandardService = async (writerPrivateKey: string): Promise<JsonStandardService<ObjectEvent>> => {
    const {
        provider,
        identityDriver,
        CONTRACT_ADDRESS
    } = await getConfiguration(writerPrivateKey);
    const {
        API_KEY,
        SECRET_API_KEY
    } = await retrieveIPFSSecrets();

    if (!API_KEY || !SECRET_API_KEY)
        throw new Error("Api keys are not set in Google Secret");

    const pinataDriver = new PinataIPFSDriver(API_KEY, SECRET_API_KEY);

    const certificateSerializer = new CertificateJsonSerializer();

    const certificateDriver = new CertificateEthersDriver(
        identityDriver,
        certificateSerializer,
        provider,
        CONTRACT_ADDRESS,
    );
    const objectEventStrategy = new ObjectEventStrategy(
        identityDriver,
        certificateDriver,
    );
    return new JsonStandardService<ObjectEvent>(pinataDriver, objectEventStrategy);
}

const getConfiguration = async (writerPrivateKey: string) => {
    let {
        ENDPOINT,
        INFURA_API_KEY,
        CONTRACT_ADDRESS
    } = await retrieveConfigurationSecrets();

    let provider;

    if (process.env.ENV_IS_LOCAL)
    //     it doesn't work without a url as parameter (that can be for example retrieved with ngrok)
        provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    else
        provider = new ethers.providers.InfuraProvider(ENDPOINT, INFURA_API_KEY);

    if (writerPrivateKey === undefined || CONTRACT_ADDRESS === undefined) { throw new Error('no private key specified'); }

    const identityDriver = new IdentityEthersDriver(writerPrivateKey, provider);

    return {
        provider,
        identityDriver,
        CONTRACT_ADDRESS
    }
}