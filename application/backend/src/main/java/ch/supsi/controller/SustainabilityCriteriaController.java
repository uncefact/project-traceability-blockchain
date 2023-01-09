package ch.supsi.controller;

import ch.supsi.exception.UneceException;
import ch.supsi.presentable.SustainabilityCriterionPresentable;
import ch.supsi.service.SustainabilityCriterionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sustainabilityCriteria")
public class SustainabilityCriteriaController {

    private final SustainabilityCriterionService sustainabilityCriterionService;

    public SustainabilityCriteriaController(SustainabilityCriterionService sustainabilityCriterionService) {
        this.sustainabilityCriterionService = sustainabilityCriterionService;
    }

    @GetMapping("")
    @Operation(summary = "Get the sustainability criteria filtered by the company industrial sector", security = @SecurityRequirement(name = "bearerAuth"))
    public List<SustainabilityCriterionPresentable> getSustainabilityCriteria() throws UneceException {
        return sustainabilityCriterionService.getSustainabilityCriteria();
    }
}
