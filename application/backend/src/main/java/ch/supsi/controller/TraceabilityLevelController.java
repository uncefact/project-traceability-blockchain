package ch.supsi.controller;

import ch.supsi.presentable.TraceabilityLevelPresentable;
import ch.supsi.service.TraceabilityLevelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/traceabilityLevel")
public class TraceabilityLevelController {
    private final TraceabilityLevelService traceabilityLevelService;

    public TraceabilityLevelController(TraceabilityLevelService traceabilityLevelService) {
        this.traceabilityLevelService = traceabilityLevelService;
    }

    @GetMapping("")
    @Operation(summary = "Get all Traceability Level", security = @SecurityRequirement(name = "bearerAuth"))
    public List<TraceabilityLevelPresentable> getAllTraceabilityLevel() {
        return traceabilityLevelService.getAllTraceabilityLevel().stream().map(TraceabilityLevelPresentable::new).collect(Collectors.toList());
    }
}
