package ch.supsi.service;

import ch.supsi.model.TransparencyLevel;
import ch.supsi.repository.TransparencyLevelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransparencyLevelService {
    private final TransparencyLevelRepository transparencyLevelRepository;

    public TransparencyLevelService(TransparencyLevelRepository transparencyLevelRepository) {
        this.transparencyLevelRepository = transparencyLevelRepository;
    }

    public TransparencyLevel getTransparencyLevelByName(String name) {
        return transparencyLevelRepository.findById(name).get();
    }

    public List<TransparencyLevel> getAllTransparencyLevel() {
        return transparencyLevelRepository.findAll();
    }
}
