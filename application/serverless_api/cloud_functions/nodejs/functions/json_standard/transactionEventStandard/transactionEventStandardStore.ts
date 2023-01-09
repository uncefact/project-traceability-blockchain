import { HttpFunction } from '@google-cloud/functions-framework';
import { JsonStandardService, TransactionEvent, TransactionEventJsonStandardSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransactionStandardService } from '../../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../../utils/utils';

export const transactionEventStandardStore: HttpFunction = async (req, res) => {
  validateRequest(req.body, ["quantityList", "destinationParty", "eventTime", "businessStepCode", "certifications"])
  res.set("Access-Control-Allow-Origin", "*");

  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const transactionEventStandardService: JsonStandardService<TransactionEvent> = await buildTransactionStandardService(privateKey);
    const transactionEventJsonSerializer = new TransactionEventJsonStandardSerializer();

    const transactionEventStandard = transactionEventJsonSerializer.deserialize(JSON.stringify(req.body));
    try {
      const eventId = await transactionEventStandardService.store(transactionEventStandard);
      if (!eventId){
        throw new Error("No ID generated for the transaction!");
      }
      console.error(`Information inside transactionEvent are successfully stored!`);
      res.send(eventId);
    }
    catch (e) {
      console.log(`TransactionEvent store error: ${e}`);
      res.status(500).send({ message: `An error during TransactionEvent store occurs: ${e}` });
    }

  }

}