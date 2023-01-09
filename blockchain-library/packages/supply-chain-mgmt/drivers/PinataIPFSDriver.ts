import pinataSDK, { PinataClient } from '@pinata/sdk';
import fetch from 'node-fetch';
import { StandardType } from '../types/StandardType.type';
import IPFSDriver from './IPFSDriver.interface';

export class PinataIPFSDriver<T extends StandardType> implements IPFSDriver {
    private _client: PinataClient;

    constructor(
        apiKey: string,
        secretApiKey: string,
    ) {
        this._client = pinataSDK(apiKey, secretApiKey);
    }

    /**
     * This function takes a string content that will be saved on ipfs and returns its hash as a string
     * @param {string} content - The content of the file to save
     * @returns The hash of the saved content.
     */
    async store(content: string): Promise<string> {
        // serialize before store to be sure that JSON object has correct structure
        const response = await this._client.pinJSONToIPFS(JSON.parse(content));
        return response.IpfsHash;
    }

    /**
     * This function takes a cid identifier of a resource and it from ipfs
     * @param {string} cid - The identifier of the object in ipfs
     * @returns The content of the retrieved object.
     */
    // eslint-disable-next-line class-methods-use-this
    async retrieve(cid: string): Promise<string> {
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
        if (!response.ok) { throw new Error(`Error while get data from IPFS, status: ${response.status}`); }
        return response.json();
    }

    /**
     * This function delete a file from ipfs by its cid
     * @param {string} cid - The identifier of the object in ipfs
     */
    async delete(cid: string): Promise<void> {
        try {
            await this._client.unpin(cid);
        } catch (e) {
            console.error(`Cannot delete file with cid ${cid}, reason: ${e}`);
        }
    }
}
export default PinataIPFSDriver;
