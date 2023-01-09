import { HttpFunction } from '@google-cloud/functions-framework';
import { JsonStandardService, TransformationEvent, TransformationEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransformationStandardService } from '../../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../../utils/utils';

export const transformationEventStandardStore: HttpFunction = async (req, res) => {
  validateRequest(req.body, ["inputQuantityList", "outputQuantityList", "eventTime", "businessStepCode", "certifications"])
  res.set("Access-Control-Allow-Origin", "*");

  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const transformationEventStandardService: JsonStandardService<TransformationEvent> = await buildTransformationStandardService(privateKey);
    const transformationEventJsonSerializer = new TransformationEventJsonStandardSerializer();

    const transformationEventStandard = transformationEventJsonSerializer.deserialize(JSON.stringify(req.body));

    try {
      const eventId = await transformationEventStandardService.store(transformationEventStandard);
      if (!eventId){
        throw new Error("No ID generated for the transformation!");
      }
      console.error(`Information inside transformationEvent are successfully stored!`);
      res.send(eventId);
    }
    catch (e) {
      console.log(`TransformationEvent store error: ${e}`);
      res.status(500).send({ message: `An error during TransformationEvent store occurs: ${e}` });
    }

  }

}