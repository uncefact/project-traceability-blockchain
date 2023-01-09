package ch.supsi.controller;

import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.ProcessType;
import ch.supsi.service.LoginService;
import ch.supsi.service.ProcessTypeService;
import ch.supsi.util.UneceServer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/processTypes")
public class ProcessTypeController {
    private final ProcessTypeService processTypeService;
    private final LoginService loginService;

    public ProcessTypeController(ProcessTypeService processTypeService, LoginService loginService) {
        this.processTypeService = processTypeService;
        this.loginService = loginService;
    }

    @GetMapping("")
    @Operation(summary = "Get filtered process types, depending on role", security = @SecurityRequirement(name = "bearerAuth"))
    public List<ProcessType> getProcessTypes() throws UneceException {
        Company loggedCompany = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();

        return processTypeService.getAllProcessTypeRolesByRole(loggedCompany.getPartnerType());
    }
}
