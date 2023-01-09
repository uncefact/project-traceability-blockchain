package ch.supsi.request;

import ch.supsi.exception.UneceException;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor @NoArgsConstructor
public class CustodialWalletCredentialsRequest extends UneceRequest{
    private String privateKey;
    private String publicKey;

    @Override
    public void validate() throws UneceException {
        notNull(privateKey, "privateKey");
        notNull(publicKey, "publicKey");
    }

    public String getPrivateKey() {
        return privateKey;
    }


    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }
}
