import SymmetricKey from '../crypto/SymmetricKey';

export interface IndexWithDecryptedData {
    symmetricKey: SymmetricKey;
    index: string;
}
