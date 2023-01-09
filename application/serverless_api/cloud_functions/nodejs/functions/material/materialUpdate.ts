import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Material, MaterialJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildMaterialService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest, validateRequest } from '../../utils/utils';

export const materialUpdate: HttpFunction = async (req, res) => {
  validateRequest(req.body, ["id", "name", "productTypes"]);

  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    const materialService: EntityService<Material> = await buildMaterialService(privateKey);
    const materialJsonSerializer = new MaterialJsonSerializer();
    
    const material = materialJsonSerializer.deserialize(JSON.stringify(req.body)); 

    try {
      await materialService.update(material);
      res.send(`Material ${material.id} update completed!`);
    }
    catch (e) {
      console.log(`materialUpdate error: ${e}`);
      res.status(500).send({message: `An error during material update occurs: ${e}`});
    }
  }


}