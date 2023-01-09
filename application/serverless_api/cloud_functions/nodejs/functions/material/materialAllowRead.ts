import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Material } from '@blockchain-lib/supply-chain-mgmt';
import { buildMaterialService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../utils/utils';

export const materialAllowRead: HttpFunction = async (req, res) => {
  validateRequest(req.query, ["id", "publicKey", "ethAddress"]);
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const materialService: EntityService<Material> = await buildMaterialService(privateKey);

    const materialId: string = req.query.id as string,
          publicKey: string = req.query.publicKey as string,
          ethAddress: string = req.query.ethAddress as string;

    try {
      await materialService.allowRead(materialId, publicKey, ethAddress);
      res.send(`Resource index for ${ethAddress} saved on chain!`);
    }
    catch (e) {
      console.log(`materialAllowRead error: ${e}`);
      res.status(500).send({message: `An error during materialAllowRead operation occurs: ${e}`});
    }
  }
}