package ch.supsi.core.controller;

import ch.supsi.model.Unit;
import ch.supsi.model.login.Login;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.UnitRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class UnitControllerTest extends UneceControllerTestTemplate {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private UnitRepository unitRepository;


    private final String PATH = "/units";

    private Login userLogin;
    private List<Unit> units = new ArrayList<>();

    @Before
    public void init() {
        userLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("user");

        units = unitRepository.findAll();
    }

    @Test
    public void getAllUnitsTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH, true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.[*].code", is(units.stream().map(Unit::getCode).collect(Collectors.toList()))));
    }


}
