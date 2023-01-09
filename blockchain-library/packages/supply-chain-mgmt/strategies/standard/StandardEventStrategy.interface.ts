/* eslint-disable no-unused-vars */
import { StandardType } from '../../types/StandardType.type';

export interface StandardEventStrategy<T extends StandardType> {
    store(t: T, ipfsHash: string, externalId?: string, extDataIpfsHash?: string): Promise<string | undefined>;

    update(t: T, eventId: string, ipfsHash: string): Promise<string>;

    readSourceURL(eventID: string): Promise<string>;

    readSourcesURL(): Promise<string[]>;
}

export default StandardEventStrategy;
