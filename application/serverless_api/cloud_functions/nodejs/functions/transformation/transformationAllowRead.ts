import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Transformation } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransformationService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../utils/utils';

export const transformationAllowRead: HttpFunction = async (req, res) => {
  validateRequest(req.query, ["id", "publicKey", "ethAddress"]);
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const transformationService: EntityService<Transformation> = await buildTransformationService(privateKey);

    const transformationId = req.query.id as string,
          publicKey = req.query.publicKey as string,
          ethAddress = req.query.ethAddress as string;
  
    if (transformationId && publicKey && ethAddress){
      try {
        await transformationService.allowRead(transformationId, publicKey, ethAddress);
        res.send(`Resource index for ${ethAddress} saved on chain!`);
      }
      catch (e) {
        console.log(`transformationAllowRead error: ${e}`);
        res.status(500).send({message: `An error during transformationAllowRead occurs: ${e}`});
      }
    }
    
  }


}