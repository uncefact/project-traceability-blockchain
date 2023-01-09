package ch.supsi.core.controller;

import ch.supsi.model.Role;
import ch.supsi.model.User;
import ch.supsi.model.company.Company;
import ch.supsi.model.login.Login;
import ch.supsi.model.ProcessType;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.ProcessTypeRepository;
import ch.supsi.repository.RoleRepository;
import ch.supsi.repository.UserRepository;
import ch.supsi.repository.company.CompanyRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ProcessTypeControllerTest extends UneceControllerTestTemplate {
    @Autowired
    private ProcessTypeRepository processTypeRepository;
    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private UserRepository userRepository;

    private final String PATH = "/processTypes";
    private List<ProcessType> processTypeList;
    private Login userLogin;
    private List<Role> roles;

    @Before
    public void init() {
        roles = roleRepository.saveAll(Arrays.asList(
                new Role("ginner", null),
                new Role("spinner", null)
        ));
        processTypeList = processTypeRepository.saveAll(Arrays.asList(
                new ProcessType("PR1", "Process1Test", new HashSet<>(Arrays.asList(roles.get(0), roles.get(1)))),
                new ProcessType("PR2", "Process2Test", new HashSet<>(Arrays.asList(roles.get(0), roles.get(1)))),
                new ProcessType("PR3", "Process3Test", new HashSet<>(Collections.singletonList(roles.get(0))))
        ));
        Company company = new Company("0x1111", "companyTest", "code", null);
        company.setPartnerType(roles.get(0));
        company = companyRepository.save(company);
        User user = userRepository.save(new User("usertest@mail.ch", "Mario", "Rossi", company));
        userLogin = loginRepository.save(new Login("usertest", new BCryptPasswordEncoder().encode("usertest"), 0L, user));

    }

    @Test
    public void getFilteredProcessTypesTest() throws Exception {
        Company loggedCompany = userLogin.getUser().getCompany();
        loggedCompany.setPartnerType(roles.get(0));
        this.mock().perform(get(userLogin.getUsername(), PATH, true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(9)))
                .andExpect(jsonPath("$.[*].name",
                        hasItems(processTypeRepository.findProcessTypesByRolesContains(userLogin.getUser().getCompany().getPartnerType()).stream().map(ProcessType::getName).toArray(String[]::new)))
                );
    }
}
