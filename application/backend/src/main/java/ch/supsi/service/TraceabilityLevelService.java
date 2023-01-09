package ch.supsi.service;

import ch.supsi.model.TraceabilityLevel;
import ch.supsi.repository.TraceabilityLevelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TraceabilityLevelService {
    private final TraceabilityLevelRepository traceabilityLevelRepository;

    public TraceabilityLevelService(TraceabilityLevelRepository traceabilityLevelRepository) {
        this.traceabilityLevelRepository = traceabilityLevelRepository;
    }

    public TraceabilityLevel getTraceabilityLevelByName(String name){
        return traceabilityLevelRepository.findById(name).get();
    }

    public List<TraceabilityLevel> getAllTraceabilityLevel(){
        return traceabilityLevelRepository.findAll();
    }

}
