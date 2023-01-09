package ch.supsi.core.controller;

import ch.supsi.model.company.CompanyIndustry;
import ch.supsi.model.SustainabilityCriterion;
import ch.supsi.model.login.Login;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.SustainabilityCriterionRepository;
import ch.supsi.repository.company.CompanyIndustryRepository;
import ch.supsi.repository.processing_standard.ProcessingStandardRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Transactional
public class SustainabilityCriteriaControllerTest extends UneceControllerTestTemplate {

    @Autowired
    private SustainabilityCriterionRepository sustainabilityCriterionRepository;
    @Autowired
    private ProcessingStandardRepository processingStandardRepository;
    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private CompanyIndustryRepository companyIndustryRepository;

    private final String PATH = "/sustainabilityCriteria";

    private Login userLogin;

    @Before
    public void init(){
        userLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("user");
        CompanyIndustry otherIndustrialSector = companyIndustryRepository.save(new CompanyIndustry("companyIndustry1"));
        CompanyIndustry otherIndustrialSector2 = companyIndustryRepository.save(new CompanyIndustry("companyIndustry2"));

        companyIndustryRepository.save(otherIndustrialSector);
        companyIndustryRepository.save(otherIndustrialSector2);

        userLogin.getUser().getCompany().setCompanyIndustry(otherIndustrialSector);

        loginRepository.save(userLogin);

        SustainabilityCriterion sustainabilityCriterion = new SustainabilityCriterion("sustTest1",Collections.singleton(otherIndustrialSector));
        SustainabilityCriterion sustainabilityCriterion2 = new SustainabilityCriterion("sustTest2",Collections.singleton(otherIndustrialSector2));


        ProcessingStandard processingStandard1 = new ProcessingStandard("name1_test", "logo1_test", "site1_test", sustainabilityCriterion);
        ProcessingStandard processingStandard2 = new ProcessingStandard("name2_test", "logo2_test", "site2_test", sustainabilityCriterion2);

        sustainabilityCriterionRepository.saveAll(Arrays.asList(sustainabilityCriterion, sustainabilityCriterion2));

        processingStandardRepository.saveAll(Arrays.asList(processingStandard1, processingStandard2));


    }

    @Test
    public void getSustainabilityCriteriaTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH, true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$.[*].name",
                        is(sustainabilityCriterionRepository.findSustainabilityCriterionByCompanyIndustriesContains(userLogin.getUser().getCompany().getCompanyIndustry()).stream().map(SustainabilityCriterion::getName).collect(Collectors.toList()))))
                .andExpect(jsonPath("$.[0].processingStandardNames", is(Collections.singletonList("name1_test"))));
    }
}
