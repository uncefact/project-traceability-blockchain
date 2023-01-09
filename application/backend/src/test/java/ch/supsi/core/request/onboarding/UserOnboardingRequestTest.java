package ch.supsi.core.request.onboarding;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.onboarding.UserOnboardingRequest;

import static org.junit.Assert.assertEquals;

public class UserOnboardingRequestTest extends UneceRequestTestTemplate {
    
    private UserOnboardingRequest userOnboardingRequest;
    
    @Override
    public void init() {
        userOnboardingRequest = new UserOnboardingRequest(
                "newCompany",
                "userFirstName",
                "userLastName",
                "newUser@mail.ch",
                "123456789",
                "stateTest",
                "cityTest",
                "12345",
                "address1",
                "username",
                "password");
    }

    @Override
    public void testGetters() {
        assertEquals("newCompany", userOnboardingRequest.getCompanyName());
        assertEquals("userFirstName", userOnboardingRequest.getUserFirstName());
        assertEquals("userLastName", userOnboardingRequest.getUserLastName());
        assertEquals("newUser@mail.ch", userOnboardingRequest.getUserEmailAddress());
        assertEquals("123456789", userOnboardingRequest.getUserPhoneNumber());
        assertEquals("stateTest", userOnboardingRequest.getUserState());
        assertEquals("cityTest", userOnboardingRequest.getUserCity());
        assertEquals("12345", userOnboardingRequest.getUserZipCode());
        assertEquals("address1", userOnboardingRequest.getUserAddress1());
        assertEquals("username", userOnboardingRequest.getUsername());
        assertEquals("password", userOnboardingRequest.getPassword());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        userOnboardingRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        userOnboardingRequest.setUserEmailAddress(null);
        try {
            userOnboardingRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
