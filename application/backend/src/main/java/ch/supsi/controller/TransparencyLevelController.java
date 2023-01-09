package ch.supsi.controller;

import ch.supsi.presentable.TransparencyLevelPresentable;
import ch.supsi.service.TransparencyLevelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/transparencyLevel")
public class TransparencyLevelController {
    private final TransparencyLevelService transparencyLevelService;

    public TransparencyLevelController(TransparencyLevelService transparencyLevelService) {
        this.transparencyLevelService = transparencyLevelService;
    }

    @GetMapping("")
    @Operation(summary = "Get all Transparency Level", security = @SecurityRequirement(name = "bearerAuth"))
    public List<TransparencyLevelPresentable> getAllTransparencyLevel() {
        return transparencyLevelService.getAllTransparencyLevel().stream().map(TransparencyLevelPresentable::new).collect(Collectors.toList());
    }
}
