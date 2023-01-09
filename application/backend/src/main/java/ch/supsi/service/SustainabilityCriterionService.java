package ch.supsi.service;

import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.presentable.SustainabilityCriterionPresentable;
import ch.supsi.repository.SustainabilityCriterionRepository;
import ch.supsi.util.UneceServer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SustainabilityCriterionService {

    private final SustainabilityCriterionRepository sustainabilityCriterionRepository;
    private final ProcessingStandardService processingStandardService;
    private final LoginService loginService;

    public SustainabilityCriterionService(SustainabilityCriterionRepository sustainabilityCriterionRepository, ProcessingStandardService processingStandardService, LoginService loginService) {
        this.loginService = loginService;
        this.sustainabilityCriterionRepository = sustainabilityCriterionRepository;
        this.processingStandardService = processingStandardService;
    }

    public List<SustainabilityCriterionPresentable> getSustainabilityCriteria() throws UneceException {
        Company loggedCompany = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        return sustainabilityCriterionRepository
                .findSustainabilityCriterionByCompanyIndustriesContains(loggedCompany.getCompanyIndustry())
                .stream()
                .map(sc -> {
                    List<String> processingStandardNames = processingStandardService.getProcessingStandardsBySustainabilityCriterion(sc.getName()).stream().map(ProcessingStandard::getName).collect(Collectors.toList());
                    return new SustainabilityCriterionPresentable(sc, processingStandardNames);
                })
                .collect(Collectors.toList());
    }
}
