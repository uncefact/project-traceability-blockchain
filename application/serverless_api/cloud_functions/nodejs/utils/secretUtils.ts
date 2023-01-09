import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export const retrieveConfigurationSecrets = async () => {
    let ENDPOINT, INFURA_API_KEY, CONTRACT_ADDRESS;

    if (process.env.ENV_IS_LOCAL){
        ENDPOINT = process.env.ENDPOINT;
        INFURA_API_KEY = process.env.INFURA_API_KEY;
        CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    }
    else {
        ENDPOINT = await getSecretByName('bc-endpoint');
        INFURA_API_KEY = await getSecretByName('infura-api-key');
        CONTRACT_ADDRESS = await getSecretByName('contract-address');
    }

    return {
        ENDPOINT,
        INFURA_API_KEY,
        CONTRACT_ADDRESS
    }
}

export const retrieveIPFSSecrets = async () => {
    let API_KEY, SECRET_API_KEY;
    
    if (process.env.ENV_IS_LOCAL){
        API_KEY = process.env.API_KEY;
        SECRET_API_KEY = process.env.SECRET_API_KEY;
    }
    else {
        API_KEY = await getSecretByName('pinata-api-key');
        SECRET_API_KEY = await getSecretByName('pinata-secret-api-key');
    }

    return {
        API_KEY,
        SECRET_API_KEY
    }
}

const getSecretByName = async (secretName: string) => {
    const versionName = `projects/${process.env.PROJECT}/secrets/${secretName}/versions/latest`;

    const [version] = await client.accessSecretVersion({
        name: versionName,
    });

    // Extract the payload as a string.
    return version.payload?.data?.toString();
}