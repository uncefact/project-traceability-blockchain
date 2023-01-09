package ch.supsi.core.request;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.UserRequest;

import static org.junit.Assert.assertEquals;

public class UserRequestTest extends UneceRequestTestTemplate {

    private UserRequest userRequest;

    @Override
    public void init() {
        userRequest = new UserRequest(
                "psw",
                "firstname",
                "lastname",
                "addr1",
                "addr2",
                "zipcode",
                "mycity",
                "1234",
                "switzerland"
        );
    }

    @Override
    public void testGetters() {
        assertEquals("psw", userRequest.getPassword());
        assertEquals("firstname", userRequest.getFirstname());
        assertEquals("lastname", userRequest.getLastname());
        assertEquals("addr1", userRequest.getAddress1());
        assertEquals("addr2", userRequest.getAddress2());
        assertEquals("zipcode", userRequest.getZip());
        assertEquals("mycity", userRequest.getCity());
        assertEquals("1234", userRequest.getPhone());
        assertEquals("switzerland", userRequest.getState());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        userRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        userRequest.setFirstname(null);
        try {
            userRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
