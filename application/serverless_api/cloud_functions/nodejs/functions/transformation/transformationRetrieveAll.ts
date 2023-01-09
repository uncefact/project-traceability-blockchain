import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Transformation, TransformationJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransformationService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest } from '../../utils/utils';

export const transformationRetrieveAll: HttpFunction = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    
    const transformationService: EntityService<Transformation> = await buildTransformationService(privateKey);
    const transformations = await transformationService.retrieveAll();
    const transformationJsonSerializer = new TransformationJsonSerializer()
    
    try {
      res.send(transformations.map(t => transformationJsonSerializer.serialize(t)));
    }
    catch (e) {
      console.log(`transformationRetrieveAll error: ${e}`);
      res.status(500).send({message: `An error during transformation retrieve all occurs: ${e}`});
    }
  }


}