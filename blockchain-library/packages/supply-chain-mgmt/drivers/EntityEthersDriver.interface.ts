/* eslint-disable no-unused-vars */
import SymmetricKey from '../crypto/SymmetricKey';
import { SupplyChainManagementType } from '../types/SupplyChainManagementType.type';

export interface EntityEthersDriver<T extends SupplyChainManagementType> {
    store(t: T): Promise<SymmetricKey>;

    update(t: T): Promise<void>;

    allowRead(tId: string | undefined, readerPublicKey?: string, readerAddress?: string, symmetricKey?: SymmetricKey): Promise<void>;

    retrieveAll(): Promise<Array<T>>;

    retrieve(tId: string): Promise<T>;
}
