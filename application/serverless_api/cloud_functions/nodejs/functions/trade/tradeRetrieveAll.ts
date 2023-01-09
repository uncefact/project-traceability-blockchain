import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Trade, TradeJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildTradeService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest } from '../../utils/utils';

export const tradeRetrieveAll: HttpFunction = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    
    const tradeService: EntityService<Trade> = await buildTradeService(privateKey);
    const trades = await tradeService.retrieveAll();
    const tradeJsonSerializer = new TradeJsonSerializer()
    
    try {
      res.send(trades.map(t => tradeJsonSerializer.serialize(t)));
    }
    catch (e) {
      console.log(`tradeRetrieveAll error: ${e}`);
      res.status(500).send({message: `An error during trade retrieve all occurs: ${e}`});
    }
  }


}