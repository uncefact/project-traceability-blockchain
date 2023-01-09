import { HttpFunction } from '@google-cloud/functions-framework';
import { JsonStandardService, TransformationEvent, TransformationEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransformationStandardService } from '../../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../../utils/utils';


export const transformationEventStandardUpdate: HttpFunction = async (req, res) => {
  validateRequest(req.body, ["inputQuantityList", "outputQuantityList", "eventTime", "businessStepCode", "certifications"]);
  validateRequest(req.query, ["eventID"]);
  res.set("Access-Control-Allow-Origin", "*");

  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const transformationEventStandardService: JsonStandardService<TransformationEvent> = await buildTransformationStandardService(privateKey);
    const transformationEventJsonSerializer = new TransformationEventJsonStandardSerializer();

    const transformationEventStandard = transformationEventJsonSerializer.deserialize(JSON.stringify(req.body));

    try {
      await transformationEventStandardService.update(transformationEventStandard, req.query.eventID as string);
      res.send(`Information inside transformationEvent are successfully updated!`);
    }
    catch (e) {
      console.log(`TransformationEvent update error: ${e}`);
      res.status(500).send({ message: `An error during TransformationEvent update occurs: ${e}` });
    }

  }

}