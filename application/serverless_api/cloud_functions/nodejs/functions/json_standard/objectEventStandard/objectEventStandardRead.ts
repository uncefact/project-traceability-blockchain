import { HttpFunction } from '@google-cloud/functions-framework';
import { JsonStandardService, ObjectEvent } from '@blockchain-lib/supply-chain-mgmt';
import { buildObjectEventStandardService } from '../../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../../utils/utils';

export const objectEventStandardRead: HttpFunction = async (req, res) => {
  validateRequest(req.query, ["eventID"])
  res.set("Access-Control-Allow-Origin", "*");

  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const objectEventStandardService: JsonStandardService<ObjectEvent> = await buildObjectEventStandardService(privateKey);

    try {
      const objectEventSerialized = await objectEventStandardService.read(req.query.eventID as string);
      res.send(objectEventSerialized);
    }
    catch (e) {
      console.log(`TransformationEvent read error: ${e}`);
      res.status(500).send({ message: `An error during TransformationEvent read occurs: ${e}` });
    }

  }

}