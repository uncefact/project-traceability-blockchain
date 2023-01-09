package ch.supsi.presentable;

import ch.supsi.model.CustodialWalletCredentials;

public class CustodialWalletCredentialsPresentable extends UnecePresentable<CustodialWalletCredentials> {
    public CustodialWalletCredentialsPresentable(CustodialWalletCredentials presentable) {
        super(presentable);
    }
    public String getPrivateKey() {
        return this.presentable.getPrivateKey();
    }
    public String getPublicKey() {
        return this.presentable.getPublicKey();
    }
}
