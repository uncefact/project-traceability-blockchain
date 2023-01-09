package ch.supsi.request.onboarding;

import ch.supsi.exception.UneceException;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserOnboardingRequest extends OnboardingRequest {

    public UserOnboardingRequest(String companyName, String userFirstName, String userLastName, String userEmailAddress, String userPhoneNumber, String userState, String userCity, String userZipCode, String userAddress1, String username, String password) {
        super(companyName, userFirstName, userLastName, userEmailAddress, userPhoneNumber, userState, userCity, userZipCode, userAddress1, username, password);
    }

    public UserOnboardingRequest(String userEmailAddress){
        super(userEmailAddress);
    }

    @Override
    public void validate() throws UneceException {
        notNull(super.getUserFirstName(), "userFirstName");
        notNull(super.getUserLastName(), "userLastName");
        notNull(super.getUserEmailAddress(), "userEmailAddress");

        notNull(super.getUsername(), "username");
        notNull(super.getPassword(), "password");
    }
}
