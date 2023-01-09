import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Material, MaterialJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildMaterialService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../utils/utils';

export const materialRetrieve: HttpFunction = async (req, res) => {
  validateRequest(req.query, ["id"]);
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const materialService: EntityService<Material> = await buildMaterialService(privateKey);
    try {
      const material = await materialService.retrieve(req.query.id as string);
      const materialJsonSerializer = new MaterialJsonSerializer();    

      res.send(materialJsonSerializer.serialize(material));
    }
    catch (e) {
      console.log(`materialRetrieve error: ${e}`);
      res.status(500).send({message: `An error during material retrieve occurs: ${e}`});
    }
  }


}