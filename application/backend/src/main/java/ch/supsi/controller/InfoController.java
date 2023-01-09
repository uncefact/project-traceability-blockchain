package ch.supsi.controller;

import ch.supsi.model.*;
//import ch.supsi.model.contract.Contract;
import ch.supsi.model.login.Login;
import ch.supsi.model.Role;
import ch.supsi.service.CountryService;
import ch.supsi.service.LoginService;
import ch.supsi.service.RoleService;
import ch.supsi.util.UneceServer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/info")
public class InfoController {
    private final LoginService loginService;
    private final RoleService roleService;
    private final CountryService countryService;

    @Autowired
    public InfoController(
            LoginService loginService,
            RoleService roleService, CountryService countryService) {
        this.loginService = loginService;
        this.roleService = roleService;
        this.countryService = countryService;
    }

    @GetMapping("/info")
    @Operation(summary = "getInfo", security = @SecurityRequirement(name = "bearerAuth"))
    public User getInfo() throws Exception {
        Login login = this.loginService.get(UneceServer.getLoggedUsername());
        return login.getUser();
    }

    @PostMapping("/authenticate")
    public JwtToken login(@RequestParam String username, @RequestParam String password) {
        throw new IllegalStateException("This method shouldn't be called. It's implemented by Spring Security filters.");
    }

    @PostMapping("/logout")
    public void logout() {
        throw new IllegalStateException("This method shouldn't be called. It's implemented by Spring Security filters.");
    }

    @GetMapping("/roles")
    public List<Role> getCompanyRoles(@RequestParam String invitedCompanyName) {
        return roleService.getAllRoles(invitedCompanyName).stream().filter(r -> !r.getName().equals("certifier")).collect(Collectors.toList());
    }

    @GetMapping("/countries")
    public List<Country> getAllCountries() {
        return countryService.getAllCountries();
    }

}
