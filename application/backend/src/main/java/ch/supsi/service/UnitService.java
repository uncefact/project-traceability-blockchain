package ch.supsi.service;

import ch.supsi.model.Unit;
import ch.supsi.repository.UnitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnitService {

    private final UnitRepository unitRepository;

    public UnitService(UnitRepository unitRepository) {
        this.unitRepository = unitRepository;
    }

    public List<Unit> getAllUnits(){
        return unitRepository.findAll();
    }
}
