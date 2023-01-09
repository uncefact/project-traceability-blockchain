import { HttpFunction } from "@google-cloud/functions-framework";
import { buildIdentityDriver } from "../utils/blockchainUtils";
import { getAllWalletPrivateKeys, updateWalletPublicKeyByPrivateKey } from "../utils/mysqlUtils";

export const fixPublicKeys: HttpFunction = async (req, res) => {
    const privateKeys: string[] = await getAllWalletPrivateKeys();
    let readerIdentityDriver;

    console.log("Public keys update start...");

    const promises = privateKeys.map(async (privateKey, i) => {
        readerIdentityDriver = await buildIdentityDriver(privateKey);
        return updateWalletPublicKeyByPrivateKey(readerIdentityDriver.publicKey, privateKey);
    });

    await Promise.all(promises);

    console.log("Success! All public keys are now updated");
    res.send(`Update of ${privateKeys.length} public keys complete!`)
}