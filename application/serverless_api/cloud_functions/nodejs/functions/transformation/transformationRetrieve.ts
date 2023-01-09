import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, TransformationJsonSerializer, Transformation } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransformationService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../utils/utils';

export const transformationRetrieve: HttpFunction = async (req, res) => {
  validateRequest(req.query, ["id"]);
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const transformationService: EntityService<Transformation> = await buildTransformationService(privateKey);
    const transformation = await transformationService.retrieve(req.query.id as string);
    const transformationJsonSerializer = new TransformationJsonSerializer();
    
    try {
      res.send(transformationJsonSerializer.serialize(transformation));
    }
    catch (e) {
      console.log(`transformationRetrieve error: ${e}`);
      res.status(500).send({message: `An error during transformation retrieve occurs: ${e}`});
    }

  }


}