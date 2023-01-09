package ch.supsi.service;

import ch.supsi.model.SustainabilityCriterion;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.repository.processing_standard.ProcessingStandardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcessingStandardService {

    private final ProcessingStandardRepository processingStandardRepository;

    public ProcessingStandardService(ProcessingStandardRepository processingStandardRepository) {
        this.processingStandardRepository = processingStandardRepository;
    }

    public ProcessingStandard getProcessingStandardByName(String name){
        return processingStandardRepository.findByName(name);
    }

    public List<ProcessingStandard> getProcessingStandardsBySustainabilityCriterion(String sustainabilityCriterion) {
        return processingStandardRepository.findAll().stream().filter(ps -> {
            SustainabilityCriterion sustainabilityCriterion1 = ps.getSustainabilityCriterion();
            if(sustainabilityCriterion1 != null)
                return sustainabilityCriterion1.getName().equals(sustainabilityCriterion);
            return false;
        }).collect(Collectors.toList());
    }
}
