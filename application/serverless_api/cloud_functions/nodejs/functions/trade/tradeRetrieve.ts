import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Trade, TradeJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildTradeService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../utils/utils';

export const tradeRetrieve: HttpFunction = async (req, res) => {
  validateRequest(req.query, ["id"]);
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const tradeService: EntityService<Trade> = await buildTradeService(privateKey);
    const trade = await tradeService.retrieve(req.query.id as string);
    const tradeJsonSerializer = new TradeJsonSerializer();
    
    try {
      res.send(tradeJsonSerializer.serialize(trade));
    }
    catch (e) {
      console.log(`tradeRetrieve error: ${e}`);
      res.status(500).send({message: `An error during trade retrieve occurs: ${e}`});
    }

  }


}