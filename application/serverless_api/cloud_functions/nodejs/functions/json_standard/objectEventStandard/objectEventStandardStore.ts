import { HttpFunction } from '@google-cloud/functions-framework';
import { JsonStandardService, ObjectEvent, ObjectEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildObjectEventStandardService } from '../../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../../utils/utils';

export const objectEventStandardStore: HttpFunction = async (req, res) => {
  validateRequest(req.body, ["itemList", "quantityList", "eventTime", "businessStepCode", "certifications"])
  res.set("Access-Control-Allow-Origin", "*");

  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const objectEventStandardService: JsonStandardService<ObjectEvent> = await buildObjectEventStandardService(privateKey);
    const objectEventJsonSerializer = new ObjectEventJsonStandardSerializer();

    const objectEventStandard = objectEventJsonSerializer.deserialize(JSON.stringify(req.body));

    try {
      const eventId = await objectEventStandardService.store(objectEventStandard);
      if (!eventId){
        throw new Error("No ID generated for the certifications!");
      }
      console.error(`Information inside objectEvent are successfully stored!`);
      res.send(eventId);
    }
    catch (e) {
      console.log(`ObjectEvent store error: ${e}`);
      res.status(500).send({ message: `An error during ObjectEvent store occurs: ${e}` });
    }

  }

}