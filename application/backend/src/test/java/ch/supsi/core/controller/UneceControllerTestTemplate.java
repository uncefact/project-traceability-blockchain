package ch.supsi.core.controller;

import ch.supsi.UNECETrackingBackend;
import org.json.JSONObject;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.result.JsonPathResultMatchers;

import javax.transaction.Transactional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("unittest")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK, classes = UNECETrackingBackend.class)
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(locations = "classpath:application-test.properties")
@ContextConfiguration
public abstract class UneceControllerTestTemplate {

    @Autowired
    private MockMvc mockMvc;

    public static JsonPathResultMatchers data(String field) {
        return jsonPath("$.data." + field);
    }

    public static JsonPathResultMatchers data() {
        return jsonPath("$.data");
    }

    public static JsonPathResultMatchers info() {
        return jsonPath("$.message");
    }

    public String authenticate(String username) throws Exception {
        MvcResult result = this.mockMvc.perform(
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post( "/info/authenticate")
                        .param("username", username)
                        .param("password", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists()).andReturn();

        return new JSONObject(result.getResponse().getContentAsString()).get("token").toString();
    }

    public MockMvc mock() {
        return mockMvc;
    }

    public MockHttpServletRequestBuilder get(String username, String path, Boolean authenticated) throws Exception {

        return authenticated ?
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(path).header("Authorization", "Bearer " + authenticate(username))
                :
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(path);
    }

    public MockHttpServletRequestBuilder delete(String username, String path, Boolean authenticated) throws Exception {

        return authenticated ?
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete(path).header("Authorization", "Bearer " + authenticate(username))
                :
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete(path);
    }

    public MockHttpServletRequestBuilder delete(String username, String path, Boolean authenticated, String body) throws Exception {

        return authenticated ?
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete(path).header("Authorization", "Bearer " + authenticate(username)).contentType(MediaType.APPLICATION_JSON).content(body)
                :
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete(path).contentType(MediaType.APPLICATION_JSON).content(body);
    }

    public MockHttpServletRequestBuilder post(String username, String path, Boolean authenticated, String body) throws Exception {
        return authenticated ?
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .post(path)
                        .header("Authorization", "Bearer " + authenticate(username))
                        .contentType(MediaType.APPLICATION_JSON).content(body)
                :
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(path)
                        .contentType(MediaType.APPLICATION_JSON).content(body);
    }

    public MockHttpServletRequestBuilder post(String username, String path, Boolean authenticated) throws Exception {
        return authenticated ?
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .post(path)
                        .header("Authorization", "Bearer " + authenticate(username))
                :
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(path);
    }

    public MockHttpServletRequestBuilder put(String username, String path, Boolean authenticated, String body) throws Exception {
        return authenticated ?
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .put(path)
                        .header("Authorization", "Bearer " + authenticate(username))
                        .contentType(MediaType.APPLICATION_JSON).content(body)
                :
                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .put(path)
                        .contentType(MediaType.APPLICATION_JSON).content(body);
    }
}
