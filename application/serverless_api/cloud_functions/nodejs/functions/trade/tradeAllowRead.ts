import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Trade } from '@blockchain-lib/supply-chain-mgmt';
import { buildTradeService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../utils/utils';

export const tradeAllowRead: HttpFunction = async (req, res) => {
  validateRequest(req.query, ["id", "publicKey", "ethAddress"]);
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const tradeService: EntityService<Trade> = await buildTradeService(privateKey);

    const tradeId = req.query.id as string,
          publicKey = req.query.publicKey as string,
          ethAddress = req.query.ethAddress as string;
  
    if (tradeId && publicKey && ethAddress){
      try {
        await tradeService.allowRead(tradeId, publicKey, ethAddress);
        res.send(`Resource index for ${ethAddress} saved on chain!`);
      }
      catch (e) {
        console.log(`tradeAllowRead error: ${e}`);
        res.status(500).send({message: `An error during tradeAllowRead occurs: ${e}`});
      }
    }
    
  }


}