package ch.supsi.core.request;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.CustodialWalletCredentialsRequest;

import static org.junit.Assert.assertEquals;

public class CustodialWalletCredentialsRequestTest extends UneceRequestTestTemplate {

    private CustodialWalletCredentialsRequest custodialWalletCredentialsRequest;

    @Override
    public void init() {
        custodialWalletCredentialsRequest = new CustodialWalletCredentialsRequest(
                "privateKey",
                "publicKey"
        );
    }

    @Override
    public void testGetters() {
        assertEquals("privateKey", custodialWalletCredentialsRequest.getPrivateKey());
        assertEquals("publicKey", custodialWalletCredentialsRequest.getPublicKey());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        custodialWalletCredentialsRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        custodialWalletCredentialsRequest.setPrivateKey(null);
        try {
            custodialWalletCredentialsRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
