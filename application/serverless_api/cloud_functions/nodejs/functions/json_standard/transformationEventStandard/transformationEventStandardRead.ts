import { HttpFunction } from '@google-cloud/functions-framework';
import { JsonStandardService, TransformationEvent } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransformationStandardService } from '../../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../../utils/utils';

export const transformationEventStandardRead: HttpFunction = async (req, res) => {
  validateRequest(req.query, ["eventID"])
  res.set("Access-Control-Allow-Origin", "*");

  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const transformationEventStandardService: JsonStandardService<TransformationEvent> = await buildTransformationStandardService(privateKey);

    try {
      const transformationEventSerialized = await transformationEventStandardService.read(req.query.eventID as string);
      res.send(transformationEventSerialized);
    }
    catch (e) {
      console.log(`TransformationEvent read error: ${e}`);
      res.status(500).send({ message: `An error during TransformationEvent read occurs: ${e}` });
    }

  }

}