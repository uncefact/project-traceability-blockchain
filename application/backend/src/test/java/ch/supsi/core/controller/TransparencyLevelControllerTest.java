package ch.supsi.core.controller;

import ch.supsi.model.TransparencyLevel;
import ch.supsi.model.login.Login;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.TransparencyLevelRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TransparencyLevelControllerTest extends UneceControllerTestTemplate{
    @Autowired
    private TransparencyLevelRepository transparencyLevelRepository;

    @Autowired
    private LoginRepository loginRepository;

    private final String PATH = "/transparencyLevel";

    private List<TransparencyLevel> transparencyLevels;
    private Login userLogin;

    @Before
    public void init() {
        userLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("user");
        transparencyLevels = new ArrayList<>();
        transparencyLevels.addAll(Arrays.asList(
                new TransparencyLevel("TransparencyLevel1"),
                new TransparencyLevel("TransparencyLevel2")
        ));
        transparencyLevelRepository.deleteAll();
        transparencyLevelRepository.saveAll(transparencyLevels);
    }

    @Test
    public void getAllTransparencyLevelTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[*].name", is(transparencyLevels.stream().map(TransparencyLevel::getName).collect(Collectors.toList()))));
    }
}
