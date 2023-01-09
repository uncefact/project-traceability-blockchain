package ch.supsi.core.controller;

import ch.supsi.model.Country;
import ch.supsi.model.Role;
import ch.supsi.model.company.Company;
import ch.supsi.model.login.Login;
import ch.supsi.repository.CountryRepository;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.RoleRepository;
import ch.supsi.repository.company.CompanyRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.stream.Collectors;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class InfoControllerTest extends UneceControllerTestTemplate {

    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private CountryRepository countryRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private RoleRepository roleRepository;

    private final String PATH = "/info";

    private Login userLogin;

    @Before
    public void init(){
        userLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("user");
    }

    @Test
    public void getInfoTest() throws Exception {
        this.mock().perform(get(this.userLogin.getUsername(), PATH + "/info", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(userLogin.getUser().getEmail()));
    }

    @Test
    public void getCompanyRolesTest() throws Exception {
        Company invitedCompany = companyRepository.save(new Company("0x1111", "newCompanyName", "", this.userLogin.getUser().getCompany().getCompanyIndustry()));
        this.mock().perform(get(this.userLogin.getUsername(), PATH + "/roles?invitedCompanyName=" + invitedCompany.getCompanyName(), true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[*].name")
                        .value(roleRepository.findRolesByCompanyIndustriesContains(this.userLogin.getUser().getCompany().getCompanyIndustry())
                        .stream().map(Role::getName).filter(r -> !r.equals("certifier")).collect(Collectors.toList()))
                );
    }

    @Test
    public void getAllCountries() throws Exception {
        this.mock().perform(get(this.userLogin.getUsername(), PATH + "/countries", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[*].name").value(countryRepository.findAll().stream().map(Country::getName).collect(Collectors.toList())));
    }
}
