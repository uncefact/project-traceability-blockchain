import SymmetricKey from './SymmetricKey';

describe('AsymmetricKey', () => {
    let symmetricKey: SymmetricKey;

    beforeAll(() => {
        symmetricKey = new SymmetricKey();
    });

    it('should correctly inizialize a symmetric key', () => {
        expect(symmetricKey.algorithm).toEqual('aes-256-cbc');
        expect(symmetricKey.iv).toBeDefined();
        expect(symmetricKey.key).toBeDefined();

        expect(symmetricKey.iv.length).toEqual(16);
        expect(symmetricKey.key.length).toEqual(32);
    });

    it('should be possible to serialize and deserialize the key', () => {
        const jsonKey = symmetricKey.toJson();
        const key = SymmetricKey.fromJson(jsonKey);

        expect(symmetricKey).toEqual(key);
    });
});
