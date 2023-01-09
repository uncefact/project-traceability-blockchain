package ch.supsi.core.request.onboarding;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.Country;
import ch.supsi.model.Role;
import ch.supsi.request.UneceRequest;
import ch.supsi.request.onboarding.TotalOnboardingRequest;

import static org.junit.Assert.assertEquals;

public class TotalOnboardingRequestTest extends UneceRequestTestTemplate {

    private TotalOnboardingRequest totalOnboardingRequest;
    private Role role;
    private Country country;

    @Override
    public void init() {
        role = new Role("roletest", null);
        country = new Country("TEST", "countrytest");
        totalOnboardingRequest = new TotalOnboardingRequest("userFirstName",
                "userLastName",
                "newUser@mail.ch",
                "123456789",
                "stateTest",
                "cityTest",
                "12345",
                "address1",
                "username",
                "password",
                "newCompany",
                "codeNewCompany",
                role,
                "https://www.website.ch",
                country,
                "companyState",
                "cityTest",
                "companyAddress",
                10.58,
                1.97);
    }

    @Override
    public void testGetters() {
        assertEquals("userFirstName", totalOnboardingRequest.getUserFirstName());
        assertEquals("userLastName", totalOnboardingRequest.getUserLastName());
        assertEquals("newUser@mail.ch", totalOnboardingRequest.getUserEmailAddress());
        assertEquals("123456789", totalOnboardingRequest.getUserPhoneNumber());
        assertEquals("stateTest", totalOnboardingRequest.getUserState());
        assertEquals("cityTest", totalOnboardingRequest.getUserCity());
        assertEquals("12345", totalOnboardingRequest.getUserZipCode());
        assertEquals("address1", totalOnboardingRequest.getUserAddress1());
        assertEquals("username", totalOnboardingRequest.getUsername());
        assertEquals("password", totalOnboardingRequest.getPassword());
        assertEquals("newCompany", totalOnboardingRequest.getCompanyName());
        assertEquals("codeNewCompany", totalOnboardingRequest.getCompanyCode());
        assertEquals(role, totalOnboardingRequest.getCompanyRole());
        assertEquals("https://www.website.ch", totalOnboardingRequest.getCompanyWebsite());
        assertEquals(country, totalOnboardingRequest.getCompanyCountry());
        assertEquals("companyState", totalOnboardingRequest.getCompanyState());
        assertEquals("cityTest", totalOnboardingRequest.getCompanyCity());
        assertEquals("companyAddress", totalOnboardingRequest.getCompanyAddress());
        assertEquals(10.58, totalOnboardingRequest.getCompanyLatitude(), 0);
        assertEquals(1.97, totalOnboardingRequest.getCompanyLongitude(), 0);
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        totalOnboardingRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        totalOnboardingRequest.setCompanyName(null);
        try {
            totalOnboardingRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
