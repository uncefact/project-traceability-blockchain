package ch.supsi.request.onboarding;

import ch.supsi.exception.UneceException;
import ch.supsi.model.Country;
import ch.supsi.model.Role;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TotalOnboardingRequest extends OnboardingRequest {

    private String companyCode;
    private Role companyRole;
    private String companyWebsite;
    private Country companyCountry;
    private String companyState;
    private String companyCity;
    private String companyAddress;
    private Double companyLatitude;
    private Double companyLongitude;

    public TotalOnboardingRequest(String userFirstName, String userLastName, String userEmailAddress, String userPhoneNumber, String userState, String userCity, String userZipCode, String userAddress1, String username, String password, String companyName, String companyCode, Role companyRole, String companyWebsite, Country companyCountry, String companyState, String companyCity, String companyAddress, Double companyLatitude, Double companyLongitude) {
        super(companyName, userFirstName, userLastName, userEmailAddress, userPhoneNumber, userState, userCity, userZipCode, userAddress1, username, password);
        this.companyCode = companyCode;
        this.companyRole = companyRole;
        this.companyWebsite = companyWebsite;
        this.companyCountry = companyCountry;
        this.companyState = companyState;
        this.companyCity = companyCity;
        this.companyAddress = companyAddress;
        this.companyLatitude = companyLatitude;
        this.companyLongitude = companyLongitude;
    }

    @Override
    public void validate() throws UneceException {
        notNull(super.getCompanyName(), "companyName");
        notNull(companyCode, "companyCode");
        notNull(companyRole, "companyRole");
        notNull(companyCountry, "companyCountry");
        notNull(companyCity, "companyCity");

        notNull(super.getUserFirstName(), "userFirstName");
        notNull(super.getUserLastName(), "userLastName");
        notNull(super.getUserEmailAddress(), "userEmailAddress");

        notNull(super.getUsername(), "username");
        notNull(super.getPassword(), "password");
    }
}
