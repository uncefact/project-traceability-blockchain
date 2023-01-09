package ch.supsi.core.controller;

import ch.supsi.model.CustodialWalletCredentials;
import ch.supsi.model.Role;
import ch.supsi.model.Token;
import ch.supsi.model.User;
import ch.supsi.model.company.Company;
import ch.supsi.model.company.CompanyKnowsCompany;
import ch.supsi.model.login.Login;
import ch.supsi.presentable.CompanyPresentable;
import ch.supsi.presentable.TradePresentable;
import ch.supsi.repository.*;
import ch.supsi.repository.company.CompanyKnowsCompanyRepository;
import ch.supsi.repository.company.CompanyRepository;
import ch.supsi.request.CompanyRequest;
import ch.supsi.request.CustodialWalletCredentialsRequest;
import ch.supsi.request.UserRequest;
import ch.supsi.request.onboarding.TotalOnboardingRequest;
import ch.supsi.service.MailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class CompanyControllerTest extends UneceControllerTestTemplate {

    @MockBean
    private MailService mailService;

    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private CompanyKnowsCompanyRepository companyKnowsCompanyRepository;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private CustodialWalletCredentialsRepository custodialWalletCredentialsRepository;

    private final String PATH = "/companies";

    private User user;
    private List<Company> companies = new ArrayList<>();
    private List<CompanyKnowsCompany> companyKnowsCompanies = new ArrayList<>();
    private Company company2, certifier, invitedCompany;
    private Login userLogin;
    private Role roleCertifier, roleSpinner;
    private Token registrationToken;

    @Before
    public void init() {
        this.roleSpinner = new Role("spinner", null);
        this.roleCertifier = new Role("certifier", null);
        certifier = new Company("0x11111111","companyCert", roleCertifier, "code");
        Company company = new Company("0x222222222","company", roleSpinner, "code1");
        this.company2 = new Company("0x333333333","company2", roleSpinner, "code2");
        this.invitedCompany = new Company("0x4444444", "invitedCompany", roleSpinner, "invitedCompanyCode");

        this.company2 = this.companyRepository.save(this.company2);
        this.certifier = this.companyRepository.save(this.certifier);
        company = this.companyRepository.save(company);
        this.invitedCompany = this.companyRepository.save(this.invitedCompany);

        this.companies.addAll(Arrays.asList(certifier, this.company2, company));

        this.user= new User();
        this.user.setEmail("emailTest2");
        this.user.setCompany(this.company2);
        this.user = this.userRepository.save(this.user);
        this.userLogin = this.loginRepository.save(new Login()
                .setUsername("usernametest2")
                .setPassword(new BCryptPasswordEncoder().encode("usernametest2"))
                .setUser(this.user));

        for (Company c : this.companies)
            this.companyKnowsCompanies.add(companyKnowsCompanyRepository.save(new CompanyKnowsCompany(userLogin.getUser().getCompany(), c)));

        this.registrationToken = tokenRepository.save(new Token("token-code", userLogin.getUser().getCompany(), invitedCompany));

        doNothing().when(mailService).sendMail(isA(String[].class), isA(String.class), isA(String.class));
    }

    @Test
    public void getCompanyTradersTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/traders", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                // these are the known companies of the logged company
                .andExpect(jsonPath("$", hasSize(companies.size()-1)))
                .andExpect(jsonPath("$.[*].companyName", hasItems(companies.stream().filter(c -> !roleCertifier.getName().equals(c.getPartnerType().getName())).map(Company::getCompanyName).toArray(String[]::new))));
    }

    @Test
    public void getCompanyEmailsTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/emailAddresses?companyName=Albini Group", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasItems(any(String.class))))
                .andExpect(jsonPath("$.[0]", containsString("@")));
    }

    @Test
    public void getTradersAndCertifierApproversTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/approvers/self_certification", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(companyKnowsCompanies.size())))
                .andExpect(jsonPath("$.[*].companyName",
                        hasItems(companyKnowsCompanies.stream().map(c -> new CompanyPresentable(c.getCompanyB()).getCompanyName()).toArray(String[]::new))));
    }

    @Test
    public void getCompanyApproversTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/approvers", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$.[0].companyName", is(certifier.getCompanyName())));
    }

    @Test
    public void getFacilityCustodialWalletCredentialsTest() throws Exception {
        String getPath = PATH + "/custodialWalletCredentials";

        //NOT_FOUND
        this.mock().perform(get(userLogin.getUsername(), getPath, true))
                .andExpect(status().isNotFound());

        //OK
        CustodialWalletCredentialsRequest custodialWalletCredentialsRequest = new CustodialWalletCredentialsRequest();
        custodialWalletCredentialsRequest.setPrivateKey("privateKeyTest");
        custodialWalletCredentialsRequest.setPublicKey("companyPublicKeyTest");
        this.mock().perform(put(userLogin.getUsername(), getPath, true, new ObjectMapper().writeValueAsString(custodialWalletCredentialsRequest)))
                .andExpect(status().isOk());
        this.mock().perform(get(userLogin.getUsername(), getPath, true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.privateKey", is("privateKeyTest")))
                .andExpect(jsonPath("$.publicKey", is("companyPublicKeyTest")));
    }

    @Test
    public void putFacilityCustodialWalletCredentialsTest() throws Exception {
        String putPath = PATH + "/custodialWalletCredentials";

        CustodialWalletCredentialsRequest custodialWalletCredentialsRequest = new CustodialWalletCredentialsRequest();
        custodialWalletCredentialsRequest.setPrivateKey("privateKeyTest");
        custodialWalletCredentialsRequest.setPublicKey("companyPublicKeyTest");

        //OK
        this.mock().perform(put(userLogin.getUsername(), putPath, true, new ObjectMapper().writeValueAsString(custodialWalletCredentialsRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.privateKey", is("privateKeyTest")))
                .andExpect(jsonPath("$.publicKey", is("companyPublicKeyTest")));
    }

    @Test
    public void putFacilityCustodialWalletCredentialsEthAddressAlreadyExistTest() throws Exception {
        String putPath = PATH + "/custodialWalletCredentials";

        CustodialWalletCredentialsRequest custodialWalletCredentialsRequest = new CustodialWalletCredentialsRequest();
        custodialWalletCredentialsRequest.setPrivateKey("privateKeyTest");
        custodialWalletCredentialsRequest.setPublicKey("companyPublicKeyTest");

        //OK
        this.mock().perform(put(userLogin.getUsername(), putPath, true, new ObjectMapper().writeValueAsString(custodialWalletCredentialsRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.privateKey", is("privateKeyTest")))
                .andExpect(jsonPath("$.publicKey", is("companyPublicKeyTest")));

        CustodialWalletCredentialsRequest custodialWalletCredentialsRequest2 = new CustodialWalletCredentialsRequest();
        custodialWalletCredentialsRequest2.setPrivateKey("privateKeyTest2");
        custodialWalletCredentialsRequest2.setPublicKey("newPublicKey");

        this.mock().perform(put(this.userLogin.getUsername(), putPath, true, new ObjectMapper().writeValueAsString(custodialWalletCredentialsRequest2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.privateKey", is("privateKeyTest2")))
                .andExpect(jsonPath("$.publicKey", is("newPublicKey")));

        this.mock().perform(put(userLogin.getUsername(), putPath, true, new ObjectMapper().writeValueAsString(custodialWalletCredentialsRequest)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void getCompanyFromTokenTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/" + registrationToken.getTokenCode() + "/onboarding", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.companyName", is(invitedCompany.getCompanyName())))
                .andExpect(jsonPath("$.ethAddress", is(invitedCompany.getEthAddress())));
    }

    @Test
    public void getCompanyFromTokenTestFailed() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/wrong-token-code/onboarding", true))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertEquals(HttpStatus.BAD_REQUEST + " \"The token code is not correct!\"", result.getResolvedException().getMessage()));
    }

    @Test
    public void postCompanyOnboardingTest() throws Exception {
        TotalOnboardingRequest totalOnboardingRequest = new TotalOnboardingRequest("userFirstName", "userLastName",
                "newUser@mail.ch", null, "", "", null, "", "username", "password",
                "newCompany", "codeNewCompany", roleSpinner, "", countryRepository.findAll().get(0),
                null, "cityTest", "", null, 2.17403);
        this.mock().perform(post(userLogin.getUsername(), PATH + "/" + registrationToken.getTokenCode() + "/onboarding", true, new ObjectMapper().writeValueAsString(totalOnboardingRequest)))
                .andExpect(status().isOk());

        Company updatedCompany = companyRepository.findByCompanyName("newCompany");
        // the company is the same, but updated with new values
        assertEquals(invitedCompany.getEthAddress(), updatedCompany.getEthAddress());
        assertEquals(countryRepository.findAll().get(0).getCode(), updatedCompany.getCountry().getCode());
        assertEquals(2.17403, invitedCompany.getLongitude(), 0);

        User newUser = userRepository.findByEmail(totalOnboardingRequest.getUserEmailAddress());
        assertNotNull(newUser);
        assertEquals(totalOnboardingRequest.getUserFirstName(), newUser.getFirstname());
        assertEquals(updatedCompany, newUser.getCompany());

        Login newLogin = loginRepository.findLoginByUsernameAndExpiredIsNull(totalOnboardingRequest.getUsername());
        assertNotNull(newLogin);
        assertEquals(newUser, newLogin.getUser());

        Optional<Token> oldToken = tokenRepository.findById(registrationToken.getTokenCode());
        assertFalse(oldToken.isPresent());
    }

    @Test
    public void postSupplierInvitationTest() throws Exception {
        TotalOnboardingRequest onboardingRequest = new TotalOnboardingRequest(
                null, "", "newUser@mail.ch", null, "", "", null, "", "", "",
                "newCompany", null, null, "", null,
                null, null,"", 0d, null
        );
        this.mock().perform(post(userLogin.getUsername(), PATH + "/supplier/invite", true, new ObjectMapper().writeValueAsString(onboardingRequest)))
                .andExpect(status().isOk());

        // the company has been invited, so a Company is created with the primary key of its new custodial wallet and also a relation from company a to company b
        List<CompanyKnowsCompany> companyKnowsCompanies = companyKnowsCompanyRepository.findAllByCompanyACompanyName("newCompany");
        Company companyAdded = companyRepository.findByCompanyName("newCompany");
        Optional<CustodialWalletCredentials> companyAddedWallet = custodialWalletCredentialsRepository.findById(companyAdded.getCustodialWalletCredentials().getId());
        assertNotNull(companyAdded);
        assertTrue(companyAddedWallet.isPresent());
        assertEquals(companyAddedWallet.get().getPublicKey(), companyAdded.getEthAddress());
        assertEquals(1, companyKnowsCompanies.size());
        assertEquals(userLogin.getUser().getCompany(), companyKnowsCompanies.get(0).getCompanyB());
        assertEquals(companyAdded, companyKnowsCompanies.get(0).getCompanyA());
        // a token to finish the onboarding process has been created
        Optional<Token> companyAddedToken = tokenRepository.findAll().stream().filter(t -> t.getCompany().equals(companyAdded)).findFirst();
        assertTrue(companyAddedToken.isPresent());
        assertEquals(companyAddedToken.get().getGeneratedBy(), userLogin.getUser().getCompany());
    }

    @Test
    public void updateCompanyTest() throws Exception {
        CompanyRequest companyRequest = new CompanyRequest(
                "Company name", "code 1", "LU", null, null, "address 1", "address 2", 0.58d, null, "https://test.ch", "CH"
        );

        assertNotEquals(userLogin.getUser().getCompany().getCompanyName(), companyRequest.getName());

        MvcResult result = this.mock().perform(put(userLogin.getUsername(), PATH + "/update", true, new ObjectMapper().writeValueAsString(companyRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName", is(companyRequest.getName())))
                .andReturn();
        Company updatedCompany = new ObjectMapper().readValue(result.getResponse().getContentAsString(), Company.class);

        assertEquals(userLogin.getUser().getCompany().getCompanyName(), updatedCompany.getCompanyName());
        assertNotEquals(userLogin.getUser().getCompany().getCountry(), updatedCompany.getCountry());
    }

}
