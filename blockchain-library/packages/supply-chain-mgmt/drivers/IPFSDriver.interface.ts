// TODO: pensare ad un layer ExternalStorageDriver per rendere il tutto più generico
export interface IPFSDriver {
    store(content: string): Promise<string>;

    retrieve(cid: string): Promise<string>;

    delete(cid: string): Promise<void>;

}
export default IPFSDriver;
