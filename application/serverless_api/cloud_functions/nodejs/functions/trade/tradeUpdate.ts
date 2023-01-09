import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Trade, TradeJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildTradeService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../utils/utils';

export const tradeUpdate: HttpFunction = async (req, res) => {
  validateRequest(req.body, ["id", "materialsIds", "name", "processTypes", "processingStds"]);
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const tradeService: EntityService<Trade> = await buildTradeService(privateKey);
    const tradeJsonSerializer = new TradeJsonSerializer();

    const trade = tradeJsonSerializer.deserialize(JSON.stringify(req.body));
    
    try {
      await tradeService.update(trade);
      res.send(`Trade ${trade.id} update completed!`);
    }
    catch (e) {
      console.log(`tradeUpdate error: ${e}`);
      res.status(500).send({message: `An error during trade update occurs: ${e}`});
    }
  }


}