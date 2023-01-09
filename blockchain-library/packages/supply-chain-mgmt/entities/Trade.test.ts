import Trade from './Trade';

describe('Trade', () => {
    let trade: Trade;

    beforeAll(() => {
        trade = new Trade(
            [['mat456', 'mat456'], ['mat789', 'mat789']],
            'testName',
            [],
            [],
            'consigneeID',
            'sourceUrl',
            'trade123',
            'testOwnerAddress',
        );
    });

    it('should correctly initialize a new Trade', () => {
        expect(trade.id).toEqual('trade123');
        expect(trade.ownerAddress).toEqual('testOwnerAddress');
        expect(trade.materialsIds).toEqual([['mat456', 'mat456'], ['mat789', 'mat789']]);
        expect(trade.name).toEqual('testName');
        expect(trade.processTypes).toEqual([]);
        expect(trade.processingStds).toEqual([]);
        expect(trade.consigneeCompanyId).toEqual('consigneeID');
        expect(trade.sourceUrl).toEqual('sourceUrl');
    });
});
