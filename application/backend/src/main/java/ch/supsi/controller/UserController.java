package ch.supsi.controller;

import ch.supsi.exception.UneceException;
import ch.supsi.model.Token;
import ch.supsi.model.User;
import ch.supsi.model.company.Company;
import ch.supsi.model.login.Login;
import ch.supsi.presentable.UserPresentable;
import ch.supsi.request.onboarding.OnboardingRequest;
import ch.supsi.request.onboarding.TotalOnboardingRequest;
import ch.supsi.request.UserRequest;
import ch.supsi.request.onboarding.UserOnboardingRequest;
import ch.supsi.service.LoginService;
import ch.supsi.service.MailService;
import ch.supsi.service.TokenService;
import ch.supsi.service.UserService;
import ch.supsi.util.UneceServer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final LoginService loginService;
    private final TokenService tokenService;
    private final MailService mailService;

    public UserController(UserService userService, LoginService loginService, TokenService tokenService, MailService mailService) {
        this.userService = userService;
        this.loginService = loginService;
        this.tokenService = tokenService;
        this.mailService = mailService;
    }

    @GetMapping("")
    public UserPresentable getUserFromEmailAddress(@RequestParam (name = "email") String email){
        return new UserPresentable(userService.getUserFromEmailAddress(email));
    }

    @GetMapping("/checkPassword")
    public String checkPassword(@RequestParam (name = "value") String password) throws UneceException {
        Login login = loginService.get(UneceServer.getLoggedUsername());
        return String.valueOf(loginService.checkPassword(login.getPassword(), password));
    }

    @PutMapping("/update")
    @Operation(summary = "Update an existing user", security = @SecurityRequirement(name = "bearerAuth"))
    public String updateUser(@RequestBody UserRequest userRequest) throws UneceException {
        userRequest.validate();
        Login login = loginService.get(UneceServer.getLoggedUsername());
        User loggedUser = login.getUser();

        loggedUser.setFirstname(userRequest.getFirstname());
        loggedUser.setLastname(userRequest.getLastname());
        loggedUser.setAddress1(userRequest.getAddress1());
        loggedUser.setZip(userRequest.getZip());
        loggedUser.setCity(userRequest.getCity());
        loggedUser.setPhone(userRequest.getPhone());
        loggedUser.setState(userRequest.getState());
        userService.save(loggedUser);

        if (userRequest.getPassword() != null && !userRequest.getPassword().trim().equals("")){
            login.setPassword(userRequest.getPassword());
            loginService.update(login);
        }

        return "User and login information update successfully!";
    }

    @PostMapping("/invite")
    public void userInvitation(@RequestBody UserOnboardingRequest userOnboardingRequest) throws UneceException {
        Company loggedCompany = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();

        Token registrationToken = tokenService.save(new Token(loggedCompany, loggedCompany));
        mailService.sendColleagueInvitationEmailFromRequest(userOnboardingRequest, registrationToken.getTokenCode());
    }

    @GetMapping("/{token}/onboarding")
    public boolean checkUserTokenExists(@PathVariable String token){
        return tokenService.get(token) != null;
    }

    @PostMapping("/{token}/onboarding")
    @Operation(summary = "Finish the on-boarding phase of an invited user")
    public void postUserOnboarding(@PathVariable String token, @RequestBody UserOnboardingRequest userOnboardingRequest) throws UneceException {
        userOnboardingRequest.validate();
        userOnboardingRequest.setCompanyName(tokenService.getCompanyFromRegistrationToken(token).getCompanyName());
        User savedUser = userService.createUserFromOnboardingRequest(userOnboardingRequest);

        loginService.post(savedUser, userOnboardingRequest.getUsername(), userOnboardingRequest.getPassword());
        if (savedUser != null)
            tokenService.removeTokenFromCode(token);
    }

//    @PostMapping(value = "/create")
//    public User userRegister(User user) {
//        User userSaved = coreService.saveUser(user);
//
//        TODO: in teoria questa parte si può cancellare ora
//        UserDetails userDetails = cuds.loadUserByUsername(userSaved.getEmail());
//
//        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        return userSaved;
//    }
}
