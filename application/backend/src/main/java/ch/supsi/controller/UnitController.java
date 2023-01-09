package ch.supsi.controller;

import ch.supsi.model.Unit;
import ch.supsi.service.UnitService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/units")
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping()
    public List<Unit> getAllUnits(){
        return unitService.getAllUnits();
    }
}
