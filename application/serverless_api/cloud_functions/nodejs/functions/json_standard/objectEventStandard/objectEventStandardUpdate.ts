import { HttpFunction } from '@google-cloud/functions-framework';
import { JsonStandardService, ObjectEvent, ObjectEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildObjectEventStandardService } from '../../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../../utils/utils';


export const objectEventStandardUpdate: HttpFunction = async (req, res) => {
  validateRequest(req.body, ["itemList", "quantityList", "eventTime", "businessStepCode", "certifications"]);
  validateRequest(req.query, ["eventID"]);
  res.set("Access-Control-Allow-Origin", "*");

  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const objectEventStandardService: JsonStandardService<ObjectEvent> = await buildObjectEventStandardService(privateKey);
    const objectEventJsonSerializer = new ObjectEventJsonStandardSerializer();

    const objectEventStandard = objectEventJsonSerializer.deserialize(JSON.stringify(req.body));
    try {
      await objectEventStandardService.update(objectEventStandard, req.query.eventID as string);
      res.send(`Information inside objectEvent are successfully updated!`);
    }
    catch (e) {
      console.log(`ObjectEvent update error: ${e}`);
      res.status(500).send({ message: `An error during ObjectEvenet update occurs: ${e}` });
    }

  }

}