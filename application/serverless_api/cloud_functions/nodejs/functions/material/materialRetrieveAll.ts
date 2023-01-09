import { HttpFunction } from '@google-cloud/functions-framework';
import { EntityService, Material, MaterialJsonSerializer } from '@blockchain-lib/supply-chain-mgmt';
import { buildMaterialService } from '../../utils/blockchainUtils';
import { getWalletPrivateKeyByUsername } from '../../utils/mysqlUtils';
import { getUsernameByRequest } from '../../utils/utils';

export const materialRetrieveAll: HttpFunction = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  
  const subject = getUsernameByRequest(req, res);
  
  if (subject) {
    const privateKey = await getWalletPrivateKeyByUsername(subject);
    
    const materialService: EntityService<Material> = await buildMaterialService(privateKey);
    
    try {
      const materials = await materialService.retrieveAll();
      const materialJsonSerializer = new MaterialJsonSerializer();
  
      res.send(materials.map(m => materialJsonSerializer.serialize(m)));
    }
    catch (e) {
      console.log(`materialRetrieveAll error: ${e}`);
      res.status(500).send({message: `An error during materials retrieve all occurs: ${e}`});
    }
  }


}