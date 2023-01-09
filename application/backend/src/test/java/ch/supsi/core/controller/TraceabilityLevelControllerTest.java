package ch.supsi.core.controller;

import ch.supsi.model.TraceabilityLevel;
import ch.supsi.model.login.Login;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.TraceabilityLevelRepository;
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

public class TraceabilityLevelControllerTest extends UneceControllerTestTemplate{
    @Autowired
    private TraceabilityLevelRepository traceabilityLevelRepository;

    @Autowired
    private LoginRepository loginRepository;

    private final String PATH = "/traceabilityLevel";

    private List<TraceabilityLevel> traceabilityLevels;
    private Login userLogin;

    @Before
    public void init() {
        userLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("user");
        traceabilityLevels = new ArrayList<>();
        traceabilityLevels.addAll(Arrays.asList(
                new TraceabilityLevel("TraceabilityLevel1"),
                new TraceabilityLevel("TraceabilityLevel2")
        ));
        traceabilityLevelRepository.deleteAll();
        traceabilityLevelRepository.saveAll(traceabilityLevels);
    }

    @Test
    public void getAllTraceabilityLevelTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[*].name", is(traceabilityLevels.stream().map(TraceabilityLevel::getName).collect(Collectors.toList()))));
    }
}
