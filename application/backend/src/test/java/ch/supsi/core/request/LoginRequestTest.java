package ch.supsi.core.request;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.LoginRequest;

import static org.junit.Assert.assertEquals;

public class LoginRequestTest extends UneceRequestTestTemplate {

    private LoginRequest loginRequest;

    @Override
    public void init() {
        loginRequest = new LoginRequest(
                "username",
                "password"
        );
    }

    @Override
    public void testGetters() {
        assertEquals("username", loginRequest.getUsername());
        assertEquals("password", loginRequest.getPassword());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        loginRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        loginRequest.setPassword(null);
        try {
            loginRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
