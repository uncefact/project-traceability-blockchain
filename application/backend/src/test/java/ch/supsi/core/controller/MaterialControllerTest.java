package ch.supsi.core.controller;

import ch.supsi.model.Material;
import ch.supsi.model.login.Login;
import ch.supsi.model.position.TransformationPlanPosition;
import ch.supsi.repository.MaterialRepository;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.position.TransformationPlanPositionRepository;
import ch.supsi.request.MaterialRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class MaterialControllerTest extends UneceControllerTestTemplate {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private TransformationPlanPositionRepository transformationPlanPositionRepository;

    @Autowired
    private LoginRepository loginRepository;

    private final String PATH = "/materials";
    private List<Material> materials;
    private Login userLogin;

    @Before
    public void init() {
        userLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("user");
        materials = materialRepository.findAllByCompanyCompanyName(userLogin.getUser().getCompany().getCompanyName());
    }

    @Test
    public void getMaterialsFromCompanyTest() throws Exception {
        List<Material> materials = this.materials.stream().filter(m -> !m.isInput()).collect(Collectors.toList());
        this.mock().perform(get(userLogin.getUsername(), PATH, true)
                .param("company", "Egyyarn")
                .param("isInput", "false")
                .param("isForTransformation", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(materials.size())))
                .andExpect(jsonPath("$.[*].name", hasItems(materials.stream().map(Material::getName).toArray(String[]::new))));
    }

    @Test
    public void getNotTransformationResultMaterialsFromCompanyTest() throws Exception {
        List<Material> outputMaterials = this.materials.stream().filter(m -> !m.isInput()).collect(Collectors.toList());
        transformationPlanPositionRepository.save(new TransformationPlanPosition(outputMaterials.get(0), 10.0, null));

        List<Material> notTransformationResultMaterials = outputMaterials.stream()
                .filter(material -> transformationPlanPositionRepository.findByContractorMaterial(material) == null).collect(Collectors.toList());
        this.mock().perform(get(userLogin.getUsername(), PATH, true)
                .param("company", "Egyyarn")
                .param("isInput", "false")
                .param("isForTransformation","true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(notTransformationResultMaterials.size())))
                .andExpect(jsonPath("$.[*].name", hasItems(notTransformationResultMaterials.stream().map(Material::getName).toArray(String[]::new))));
        assertFalse(notTransformationResultMaterials.contains(outputMaterials.get(0)));
    }

    @Test
    public void addInputMaterialsFromCompanyTest() throws Exception {
        MaterialRequest materialRequest = new MaterialRequest("Red wire test 1", "Egyyarn", false);
        this.mock().perform(post(userLogin.getUsername(), PATH + "/create", true,
                new ObjectMapper().writeValueAsString(materialRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.name", is("Red wire test 1")));

//        TODO: to fix with isin filter
        List<Material> materialsByCompanyName = materialRepository.findAllByCompanyCompanyNameAndIsInput("Egyyarn", false);
        assertEquals(materials.stream().filter(cp -> cp.getCompany().getCompanyName().equals("Egyyarn")).count(), 6);
        assertEquals(4, materialsByCompanyName.size());
        assertFalse(materialsByCompanyName.get(2).isInput());
    }
}
