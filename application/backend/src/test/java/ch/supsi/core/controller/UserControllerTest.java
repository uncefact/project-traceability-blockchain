package ch.supsi.core.controller;

import ch.supsi.model.Token;
import ch.supsi.model.User;
import ch.supsi.model.login.Login;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.TokenRepository;
import ch.supsi.repository.UserRepository;
import ch.supsi.request.UserRequest;
import ch.supsi.request.onboarding.UserOnboardingRequest;
import ch.supsi.service.MailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.util.NestedServletException;

import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class UserControllerTest extends UneceControllerTestTemplate {

    @MockBean
    private MailService mailService;

    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenRepository tokenRepository;

    private final String PATH = "/user";

    private Login userLogin;
    private User user;
    private Token registrationToken;


    @Before
    public void init() {
        user = userRepository.findByEmail("user1@mail.ch");
        userLogin = loginRepository.findByUserAndExpiredIsNull(user);

        registrationToken = tokenRepository.save(new Token("token-code", userLogin.getUser().getCompany(), userLogin.getUser().getCompany()));

        doNothing().when(mailService).sendMail(isA(String[].class), isA(String.class), isA(String.class));
    }

    @Test
    public void getUserFromEmailAddress() throws Exception {
        String email = "albini@mail.ch";
        this.mock().perform(get(userLogin.getUsername(), PATH + "?email=" + email, true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.lastName", is(userRepository.findByEmail(email).getLastname())));
    }

    @Test
    public void checkPasswordTest() throws Exception {
        MvcResult mvcResult = this.mock().perform(get(userLogin.getUsername(), PATH + "/checkPassword?value=user", true))
                .andExpect(status().isOk())
                .andReturn();
        assertTrue(Boolean.parseBoolean(mvcResult.getResponse().getContentAsString()));

        // test false
        mvcResult = this.mock().perform(get(userLogin.getUsername(), PATH + "/checkPassword?value=123456", true))
                .andExpect(status().isOk())
                .andReturn();
        assertFalse(Boolean.parseBoolean(mvcResult.getResponse().getContentAsString()));
    }

    @Test
    public void updateUserTest() throws Exception {
        UserRequest userRequest = new UserRequest(
                "123456", "Firstname", "lastname", null, null, null, "City test", null, null
        );
        this.mock().perform(put(userLogin.getUsername(), PATH + "/update", true, new ObjectMapper().writeValueAsString(userRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is("User and login information update successfully!")));

        assertEquals("Firstname", userRepository.findByEmail(user.getEmail()).getFirstname());
        assertEquals(userLogin.getUser().getLastname(), userRepository.findByEmail(user.getEmail()).getLastname());
        assertTrue(passwordEncoder.matches("123456", loginRepository.findLoginByUsernameAndExpiredIsNull(userLogin.getUsername()).getPassword()));
    }

    @Test
    public void userInvitationTest() throws Exception {
        UserOnboardingRequest userOnboardingRequest = new UserOnboardingRequest(null, "firstName",
                "lastName", "mail@mail.ch", "", null, null,
                "", null, null, null);
        this.mock().perform(post(userLogin.getUsername(), PATH + "/invite", true, new ObjectMapper().writeValueAsString(userOnboardingRequest)))
                .andExpect(status().isOk());

        // the first is the one created for test purpose ("registrationToken")
        assertEquals(2, tokenRepository.findAll().size());
        assertEquals(userLogin.getUser().getCompany(), tokenRepository.findAll().get(1).getCompany());
    }

    @Test
    public void postUserOnboarding() throws Exception {
        UserOnboardingRequest userOnboardingRequest = new UserOnboardingRequest(null, "firstName",
                "lastName", "mail@mail.ch", "", null, "city",
                "", null, "username", "password");
        this.mock().perform(post(userLogin.getUsername(), PATH + "/" + registrationToken.getTokenCode() + "/onboarding", true, new ObjectMapper().writeValueAsString(userOnboardingRequest)))
                .andExpect(status().isOk());

        User newUser = userRepository.findByEmail(userOnboardingRequest.getUserEmailAddress());
        assertNotNull(newUser);
        assertEquals(userOnboardingRequest.getUserFirstName(), newUser.getFirstname());

        Login newLogin = loginRepository.findLoginByUsernameAndExpiredIsNull(userOnboardingRequest.getUsername());
        assertNotNull(newLogin);
        assertEquals(newUser, newLogin.getUser());

        Optional<Token> oldToken = tokenRepository.findById(registrationToken.getTokenCode());
        assertFalse(oldToken.isPresent());
    }

    @Test(expected = NestedServletException.class)
    public void postUserOnboardingUserAlreadyExists() throws Exception {
        User oldUser = userRepository.save(new User("oldmail@mail.ch", "firstnameTest", "lastnameTest", userLogin.getUser().getCompany()));
        UserOnboardingRequest userOnboardingRequest = new UserOnboardingRequest(null, "firstName",
                "lastName", oldUser.getEmail(), "", null, "city",
                "", null, "username", "password");
        this.mock().perform(post(userLogin.getUsername(), PATH + "/" + registrationToken.getTokenCode() + "/onboarding", true, new ObjectMapper().writeValueAsString(userOnboardingRequest)))
                .andExpect(status().isBadRequest());

        User newUser = userRepository.findByEmail(userOnboardingRequest.getUserEmailAddress());
        assertNotNull(newUser);
        // user has not been created, so the information are the ones of the older user already present
        assertNotEquals(userOnboardingRequest.getUserFirstName(), newUser.getFirstname());

        Login newLogin = loginRepository.findLoginByUsernameAndExpiredIsNull(userOnboardingRequest.getUsername());
        assertNull(newLogin);

        Optional<Token> oldToken = tokenRepository.findById(registrationToken.getTokenCode());
        // token has not been removed
        assertTrue(oldToken.isPresent());
    }

    @Test
    public void checkUserTokenExistsTest() throws Exception {
        Token token = tokenRepository.save(new Token("tokenTest", null, null));
        this.mock().perform(get(userLogin.getUsername(), PATH + "/" + token.getTokenCode() + "/onboarding", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isBoolean())
                .andExpect(jsonPath("$", is(true)));

        this.mock().perform(get(userLogin.getUsername(), PATH + "/random-token-code/onboarding", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isBoolean())
                .andExpect(jsonPath("$", is(false)));
    }
}
