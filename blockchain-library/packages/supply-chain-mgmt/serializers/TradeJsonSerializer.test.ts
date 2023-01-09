import Trade from '../entities/Trade';
import { TradeJsonSerializer } from './TradeJsonSerializer';

describe('TradeJsonSerializer', () => {
    let tradeJsonSerializer: TradeJsonSerializer;

    beforeAll(() => {
        tradeJsonSerializer = new TradeJsonSerializer();
    });

    it('should correctly serialize a Trade', () => {
        const trade = new Trade(
            [['mat1', 'mat2']],
            'testName',
            [],
            [],
            'consigneeID',
            'sourceUrl',
            'trade1',
            'testOwnerAddress',
        );

        const result = tradeJsonSerializer.serialize(trade);

        expect(result).toEqual(JSON.stringify({
            materialsIds: trade.materialsIds,
            name: trade.name,
            processTypes: trade.processTypes,
            processingStds: trade.processingStds,
            consigneeCompanyId: trade.consigneeCompanyId,
            sourceUrl: trade.sourceUrl,
            id: trade.id,
            ownerAddress: trade.ownerAddress,
        }));
    });

    it('should correctly deserialize a Trade', () => {
        const trade = new Trade(
            [['mat1', 'mat2']],
            'testName',
            [],
            [],
            'consigneeID',
            'sourceUrl',
            'trade1',
            'testOwnerAddress',
        );
        const serializedEbEvent = JSON.stringify({
            materialsIds: trade.materialsIds,
            name: trade.name,
            processTypes: trade.processTypes,
            processingStds: trade.processingStds,
            consigneeCompanyId: trade.consigneeCompanyId,
            sourceUrl: trade.sourceUrl,
            id: trade.id,
            ownerAddress: trade.ownerAddress,
        });

        const result = tradeJsonSerializer.deserialize(serializedEbEvent);

        expect(result).toEqual(trade);
    });
});
