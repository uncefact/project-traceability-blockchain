package ch.supsi.request.onboarding;

import ch.supsi.request.UneceRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public abstract class OnboardingRequest extends UneceRequest {

    private String companyName;

    private String userFirstName;
    private String userLastName;
    private String userEmailAddress;
    private String userPhoneNumber;
    private String userState;
    private String userCity;
    private String userZipCode;
    private String userAddress1;

    private String username;
    private String password;

    public OnboardingRequest(String userEmailAddress){
        this.userEmailAddress = userEmailAddress;
    }

}
