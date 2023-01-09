package ch.supsi.service;

import ch.supsi.exception.UneceException;
import ch.supsi.model.User;
import ch.supsi.model.company.Company;
import ch.supsi.repository.UserRepository;
import ch.supsi.request.onboarding.OnboardingRequest;
import ch.supsi.util.UneceServer;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CompanyService companyService;

    public UserService(UserRepository userRepository, CompanyService companyService) {
        this.userRepository = userRepository;
        this.companyService = companyService;
    }

    public User getUserFromEmailAddress(String email){
        return userRepository.findByEmail(email);
    }

    public User save(User user){
        return userRepository.save(user);
    }

    public User createUserFromOnboardingRequest(OnboardingRequest onboardingRequest) {
        if (!userRepository.existsById(onboardingRequest.getUserEmailAddress())) {
            User user = new User(onboardingRequest.getUserEmailAddress(), onboardingRequest.getUserFirstName(), onboardingRequest.getUserLastName(), companyService.getCompanyFromName(onboardingRequest.getCompanyName()));
            user.setState(onboardingRequest.getUserState());
            user.setCity(onboardingRequest.getUserCity());
            user.setZip(onboardingRequest.getUserZipCode());
            user.setPhone(onboardingRequest.getUserPhoneNumber());
            user.setAddress1(onboardingRequest.getUserAddress1());

            return userRepository.save(user);
        }
        return null;
    }

}
