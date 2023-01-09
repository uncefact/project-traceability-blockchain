package ch.supsi.core.controller;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.login.Login;
import ch.supsi.model.position.TransformationPlanPosition;
import ch.supsi.model.ProcessType;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.model.processing_standard.ProcessingStandardCompanyIndustry;
import ch.supsi.model.Role;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.model.transformation_plan.TransformationPlanProcessingStandard;
import ch.supsi.repository.*;
import ch.supsi.repository.MaterialRepository;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.TransformationPlanRepository;
import ch.supsi.repository.company.CompanyRepository;
import ch.supsi.repository.position.TransformationPlanPositionRepository;
import ch.supsi.repository.processing_standard.ProcessingStandardCompanyIndustryRepository;
import ch.supsi.repository.processing_standard.ProcessingStandardRepository;
import ch.supsi.request.transformation_plan.TransformationPlanRequest;
import ch.supsi.request.position.TransformationPlanPositionRequest;
import ch.supsi.request.transformation_plan.TransformationPlanUpdateRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.util.NestedServletException;

import java.util.*;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class TransformationPlanControllerTest extends UneceControllerTestTemplate {
    @Value("${unece.documents-storage-path}")
    private String documentsPath;

    @Autowired
    private TransformationPlanRepository transformationPlanRepository;
    @Autowired
    private TransformationPlanPositionRepository transformationPlanPositionRepository;
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private ProcessTypeRepository processTypeRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private TraceabilityLevelRepository traceabilityLevelRepository;
    @Autowired
    private TransparencyLevelRepository transparencyLevelRepository;
    @Autowired
    private ProcessingStandardRepository processingStandardRepository;
    @Autowired
    private TransformationPlanProcessingStandardRepository transformationPlanProcessingStandardRepository;
    @Autowired
    private ProcessingStandardCompanyIndustryRepository processingStandardCompanyIndustryRepository;
    @Autowired
    private ProductCategoryRepository productCategoryRepository;
    @Autowired
    private SustainabilityCriterionRepository sustainabilityCriterionRepository;

    private final String PATH = "/transformationPlans";
    private Login userLogin;
    private Login userCertifierLogin;
    private List<DocumentType> documentTypes = new ArrayList<>();
    private List<TransformationPlan> transformationPlans = new ArrayList<>();
    private List<Company> companies;
    private List<TraceabilityLevel> traceabilityLevels;
    private List<TransparencyLevel> transparencyLevels;
    private List<Material> outputMaterials;
    private List<TransformationPlanPosition> transformationPlanPositions;
    private List<ProcessingStandard> processingStandards;
    private ProductCategory productCategory;

    @Before
    public void init() {
        userLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("user");
        List<SustainabilityCriterion> sustainabilityCriteria = sustainabilityCriterionRepository.findSustainabilityCriterionByCompanyIndustriesContains(userLogin.getUser().getCompany().getCompanyIndustry());
        userCertifierLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("cert");
        companies = companyRepository.findAll();
        productCategory = productCategoryRepository.save(new ProductCategory("pcode1", "prod category test"));
        processTypeRepository.saveAll(Arrays.asList(
                new ProcessType("PR1", "ProcessTest1", null),
                new ProcessType("PR2", "ProcessTest2", null)
        ));

        processingStandards = processingStandardRepository.saveAll(Arrays.asList(
                new ProcessingStandard("Process standard 1", "", "", sustainabilityCriteria.get(0)),
                new ProcessingStandard("Process standard 2", "", "", sustainabilityCriteria.get(1))
        ));


        documentTypes.addAll(Arrays.asList(
                new DocumentType("dt1"),
                new DocumentType("dt2"),
                new DocumentType("dt3")
        ));
        documentTypeRepository.saveAll(documentTypes);

        traceabilityLevels = new ArrayList<>();
        traceabilityLevels.addAll(Arrays.asList(
                new TraceabilityLevel("TraceabilityLevel1"),
                new TraceabilityLevel("TraceabilityLevel2")
        ));
        traceabilityLevelRepository.deleteAll();
        traceabilityLevels = traceabilityLevelRepository.saveAll(traceabilityLevels);

        transparencyLevels = new ArrayList<>();
        transparencyLevels.addAll(Arrays.asList(
                new TransparencyLevel("TransparencyLevel1"),
                new TransparencyLevel("TransparencyLevel2")
        ));
        transparencyLevelRepository.deleteAll();
        transparencyLevels = transparencyLevelRepository.saveAll(transparencyLevels);

        TransformationPlan tp1 = new TransformationPlan("tr1", userLogin.getUser().getCompany(), documentTypes.get(0));
        tp1.setTraceabilityLevel(traceabilityLevels.get(0));
        tp1.setTransparencyLevel(transparencyLevels.get(0));
        TransformationPlan tp2 = new TransformationPlan("tr2", companies.get(0), documentTypes.get(2));
        tp2.setTraceabilityLevel(traceabilityLevels.get(0));
        tp2.setTransparencyLevel(transparencyLevels.get(0));
        TransformationPlan tp3 = new TransformationPlan("tr3", userLogin.getUser().getCompany(), documentTypes.get(1));
        tp3.setTraceabilityLevel(traceabilityLevels.get(0));
        tp3.setTransparencyLevel(transparencyLevels.get(0));
        List<TransformationPlan> transformationPlansSaved = new ArrayList<>(Arrays.asList(
                tp1,
                tp2,
                tp3
        ));
        transformationPlans = transformationPlanRepository.saveAll(transformationPlansSaved);
        transformationPlanProcessingStandardRepository.save(new TransformationPlanProcessingStandard(transformationPlans.get(0), processingStandards.get(0)));
        transformationPlanProcessingStandardRepository.save(new TransformationPlanProcessingStandard(transformationPlans.get(0), processingStandards.get(1)));

        outputMaterials = materialRepository.saveAll(Arrays.asList(
            new Material("material 1", null, false),
            new Material("material 2", null, false)
        ));
        transformationPlanPositions = transformationPlanPositionRepository.saveAll(Arrays.asList(
                new TransformationPlanPosition(outputMaterials.get(0), 15.0, tp1),
                new TransformationPlanPosition(outputMaterials.get(1), 85.0, tp3)
        ));

        processingStandardCompanyIndustryRepository.saveAll(Arrays.asList(
                new ProcessingStandardCompanyIndustry(processingStandards.get(0), userLogin.getUser().getCompany().getCompanyIndustry()),
                new ProcessingStandardCompanyIndustry(processingStandards.get(1), userLogin.getUser().getCompany().getCompanyIndustry())
        ));
    }

    @Test
    public void getAllMyTransformationPlansTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH, true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.[*].name", is(transformationPlans.stream()
                        .filter(tp -> tp.getCompany().getCompanyName().equals(userLogin.getUser().getCompany().getCompanyName()))
                        .map(TransformationPlan::getName).collect(Collectors.toList()))))
                .andExpect(jsonPath("$.[*].outputMaterial.name", is(transformationPlanPositions.stream().map(tp -> tp.getContractorMaterial().getName()).collect(Collectors.toList()))));


    }

    @Test
    public void getTransformationPlanTest() throws Exception {
        assertEquals(userLogin.getUser().getCompany().getCompanyName(), transformationPlans.get(0).getCompany().getCompanyName());
        this.mock().perform(get(userLogin.getUsername(), PATH + "/" + transformationPlans.get(0).getId(), true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(transformationPlans.get(0).getName())));
    }

    @Test(expected = NestedServletException.class)
    public void getTransformationPlanTestFailed() throws Exception {
        assertNotEquals(userLogin.getUser().getCompany().getCompanyName(), transformationPlans.get(1).getCompany().getCompanyName());
        this.mock().perform(get(userLogin.getUsername(), PATH + "/" + transformationPlans.get(1).getId(),true))
                .andExpect(status().isForbidden())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.FORBIDDEN.getMessage(), result.getResolvedException().getMessage()));
    }

    @Test
    public void createTest() throws Exception{
        Date now = new Date();
        Material inputMaterial = materialRepository.findAllByCompanyCompanyNameAndIsInput(userLogin.getUser().getCompany().getCompanyName() ,true).get(0);
        Material outputMaterial = materialRepository.findAllByCompanyCompanyNameAndIsInput(userLogin.getUser().getCompany().getCompanyName() ,false).get(0);
        TransformationPlan transformationPlan = new TransformationPlan(
                "Transformation Plan Test",
                userLogin.getUser().getCompany(),
                now,
                now,
                "notes test",
                new Date()
        );
        List<TransformationPlanPositionRequest> transformationPlanPositionList = Arrays.asList(
                new TransformationPlanPositionRequest(inputMaterial.getId(), 0.8),
                new TransformationPlanPositionRequest(outputMaterial.getId(), 1.0)
        );
        TransformationPlanRequest transformationPlanRequest = new TransformationPlanRequest(
                transformationPlan.getName(),
                transformationPlanPositionList,
                Arrays.asList("PR1", "PR2"),
                Arrays.asList("Process standard 1", "Process standard 2"),
                productCategory.getCode(),
                now,
                now,
                "notes test",
                "TraceabilityLevel1",
                "TransparencyLevel2"
        );

        assertNull(outputMaterial.getProductCategory());
        //OK
        this.mock().perform(post(userLogin.getUsername(), PATH + "/create", true, new ObjectMapper().writeValueAsString(transformationPlanRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.name", is("Transformation Plan Test")))
                .andExpect(jsonPath("$.outputMaterial.id", is(outputMaterial.getId().intValue())))
                .andExpect(jsonPath("$.inputPositions[0].quantity", is(0.8)))
                .andExpect(jsonPath("$.inputPositions[0].contractorMaterialName", is(inputMaterial.getName())))
                .andExpect(jsonPath("$.processTypeList", hasSize(2)))
                .andExpect(jsonPath("$.processTypeList[0].code", is("PR1")))
                .andExpect(jsonPath("$.processTypeList[1].code", is("PR2")))
                .andExpect(jsonPath("$.notes", is("notes test")))
                .andExpect(jsonPath("$.traceabilityLevel", is(traceabilityLevels.get(0).getName())))
                .andExpect(jsonPath("$.transparencyLevel", is(transparencyLevels.get(1).getName())))
                .andExpect(jsonPath("$.productCategory.code", is(productCategory.getCode())))
        ;

        // a material has been updated with the product category reference
        assertEquals(productCategory.getCode(), materialRepository.findById(outputMaterial.getId()).get().getProductCategory().getCode());

    }

    @Test
    public void createTestFailed() throws Exception {
        Date now = new Date();
        Material inputMaterial = materialRepository.findAllByCompanyCompanyNameAndIsInput(userLogin.getUser().getCompany().getCompanyName() ,true).get(0);
        Material outputMaterial = materialRepository.findAllByCompanyCompanyNameAndIsInput(userLogin.getUser().getCompany().getCompanyName() ,false).get(0);
        TransformationPlan transformationPlan = new TransformationPlan(
                "Transformation Plan Test",
                userLogin.getUser().getCompany(),
                now,
                now,
                "notes test",
                new Date()
        );
        List<TransformationPlanPositionRequest> transformationPlanPositionList = Arrays.asList(
                new TransformationPlanPositionRequest(inputMaterial.getId(), 0.8),
                new TransformationPlanPositionRequest(outputMaterial.getId(), 1.0)
        );
        TransformationPlanRequest transformationPlanRequest = new TransformationPlanRequest(
                transformationPlan.getName(),
                transformationPlanPositionList,
                Arrays.asList("PR1", "PR2"),
                Arrays.asList("Process standard 1", "Process standard 2"),
                productCategory.getCode(),
                now,
                now,
                "notes test",
                "TraceabilityLevel1",
                "TransparencyLevel2"
        );

//        this.mock().perform(post(userCertifierLogin.getUsername(), PATH + "/create", true, new ObjectMapper().writeValueAsString(transformationPlanRequest)))
//                .andExpect(status().isForbidden());

        //NOT_FOUND
        List<TransformationPlanPositionRequest> transformationPlanPositionList2 = Collections.singletonList(
                new TransformationPlanPositionRequest(
                        -1L, //Not present
                        0.8
                )
        );
        TransformationPlanRequest transformationPlanRequest2 = new TransformationPlanRequest(
                transformationPlan.getName(),
                transformationPlanPositionList2,
                Arrays.asList("PR1", "PR2"),
                Arrays.asList("Process standard 1", "Process standard 2"),
                productCategory.getCode(),
                now,
                now,
                "notes test",
                "",
                ""
        );
        this.mock().perform(post(userLogin.getUsername(), PATH + "/create", true, new ObjectMapper().writeValueAsString(transformationPlanRequest2)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void getTransformationProcessingStandardsTest() throws Exception {
        List<String> processingStandardNamesFiltered = processingStandardCompanyIndustryRepository.findProcessingStandardNamesByCompanyIndustryName(userLogin.getUser().getCompany().getCompanyIndustry().getName());
        this.mock().perform(get(userLogin.getUsername(), PATH + "/processingStandards", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(13)))
                .andExpect(jsonPath("$.[*].name", is(processingStandardRepository.findByNameIn(processingStandardNamesFiltered)
                        .stream()
                        .map(ProcessingStandard::getName)
                        .collect(Collectors.toList()))));
    }

    @Test
    public void updateTransformationPlanTest() throws Exception {
        // 1 processing standard less and transparency level changed
        TransformationPlanUpdateRequest transformationPlanUpdateRequest = new TransformationPlanUpdateRequest(
                Collections.singletonList(processingStandards.get(0).getName()),
                traceabilityLevels.get(0).getName(),
                transparencyLevels.get(1).getName()
        );

        this.mock().perform(put(userLogin.getUsername(), PATH + "/" + transformationPlans.get(0).getId(), true, new ObjectMapper().writeValueAsString(transformationPlanUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.name", is(transformationPlans.get(0).getName())))
                .andExpect(jsonPath("$.traceabilityLevel", is(transformationPlans.get(0).getTraceabilityLevel().getName())))
                .andExpect(jsonPath("$.transparencyLevel", is(transformationPlanUpdateRequest.getTransparencyLevelName())))
                .andExpect(jsonPath("$.processingStandardList.[*].name", is(transformationPlanUpdateRequest.getProcessingStandardList())));
    }

    @Test
    public void deleteTransformationPlanTest() throws Exception {
        TransformationPlan tp = new TransformationPlan("TransformationPlanTest", userLogin.getUser().getCompany(), documentTypes.get(1));
        tp = transformationPlanRepository.save(tp);
        assertEquals(transformationPlanRepository.findById(tp.getId()), Optional.of(tp));
        this.mock().perform(delete(userLogin.getUsername(), PATH + "/" + tp.getId(), true))
                .andExpect(status().isOk());
        assertEquals(transformationPlanRepository.findById(tp.getId()), Optional.empty());
    }

    @Test(expected = NestedServletException.class)
    public void deleteTransformationPlanTestFail() throws Exception {
        Company otherCompany = companyRepository.save(new Company("0x10101010", "Other Company", "Code", null));
        otherCompany.setPartnerType(new Role("spinner", null));
        TransformationPlan tp = new TransformationPlan("TransformationPlanTest", otherCompany, documentTypes.get(1));
        tp = transformationPlanRepository.save(tp);
        assertEquals(transformationPlanRepository.findById(tp.getId()), Optional.of(tp));
        this.mock().perform(delete(userLogin.getUsername(), PATH + "/" + tp.getId(), true))
                .andExpect(status().isForbidden());
    }

}
