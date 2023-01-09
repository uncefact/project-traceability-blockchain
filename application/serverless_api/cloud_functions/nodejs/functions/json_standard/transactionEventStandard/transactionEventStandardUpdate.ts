import { HttpFunction } from '@google-cloud/functions-framework';
import { JsonStandardService, TransactionEvent, TransactionEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransactionStandardService } from '../../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../../utils/utils';

export const transactionEventStandardUpdate: HttpFunction = async (req, res) => {
  validateRequest(req.body, ["quantityList", "destinationParty", "eventTime", "businessStepCode", "certifications"]);
  validateRequest(req.query, ["eventID"]);
  res.set("Access-Control-Allow-Origin", "*");

  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const transactionEventStandardService: JsonStandardService<TransactionEvent> = await buildTransactionStandardService(privateKey);
    const transactionEventJsonSerializer = new TransactionEventJsonStandardSerializer();

    const transactionEventStandard = transactionEventJsonSerializer.deserialize(JSON.stringify(req.body));

    try {
      await transactionEventStandardService.update(transactionEventStandard, req.query.eventID as string);
      res.send(`Information inside transactionEvent are successfully updated!`);
    }
    catch (e) {
      console.log(`TransactionEvent update error: ${e}`);
      res.status(500).send({ message: `An error during TransactionEvent update occurs: ${e}` });
    }

  }

}