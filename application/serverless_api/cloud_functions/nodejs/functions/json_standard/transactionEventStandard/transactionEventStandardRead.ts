import { HttpFunction } from '@google-cloud/functions-framework';
import { JsonStandardService, TransactionEvent } from '@blockchain-lib/supply-chain-mgmt';
import { buildTransactionStandardService } from '../../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../../utils/utils';

export const transactionEventStandardRead: HttpFunction = async (req, res) => {
  validateRequest(req.query, ["eventID"])
  res.set("Access-Control-Allow-Origin", "*");

  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const transactionEventStandardService: JsonStandardService<TransactionEvent> = await buildTransactionStandardService(privateKey);

    try {
      const transactionEventSerialized = await transactionEventStandardService.read(req.query.eventID as string);
      res.send(transactionEventSerialized);
    }
    catch (e) {
      console.log(`TransactionEvent read error: ${e}`);
      res.status(500).send({ message: `An error during TransactionEvent read occurs: ${e}` });
    }

  }

}