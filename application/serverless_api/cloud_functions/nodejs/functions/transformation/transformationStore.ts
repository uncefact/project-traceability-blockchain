import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Transformation, TransformationJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransformationService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../utils/utils';

export const transformationStore: HttpFunction = async (req, res) => {
  validateRequest(req.body, ["materialsInIds", "materialOutId", "name", "startDate", "endDate", "processTypes", "processingStds"]);
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const transformationService: EntityService<Transformation> = await buildTransformationService(privateKey);
    const transformationJsonSerializer = new TransformationJsonSerializer();

    const transformation: Transformation = transformationJsonSerializer.deserialize(JSON.stringify(req.body));

    try {
      await transformationService.store(transformation);
      res.send(`Transformation ${transformation.id} store completed!`);
    }
    catch (e) {
      console.log(`transformationStore error: ${e}`);
      res.status(500).send({message: `An error during transformation store occurs: ${e}`});
    }
  }

}