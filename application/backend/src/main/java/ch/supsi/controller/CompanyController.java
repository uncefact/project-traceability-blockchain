package ch.supsi.controller;

import ch.supsi.exception.UneceException;
import ch.supsi.model.User;
import ch.supsi.model.company.Company;
import ch.supsi.model.Role;
import ch.supsi.presentable.CompanyPresentable;
import ch.supsi.presentable.CustodialWalletCredentialsPresentable;
import ch.supsi.request.CompanyRequest;
import ch.supsi.request.CustodialWalletCredentialsRequest;
import ch.supsi.request.onboarding.TotalOnboardingRequest;
import ch.supsi.service.*;
import ch.supsi.util.UneceServer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;
    private final CompanyKnowsCompanyService companyKnowsCompanyService;
    private final RoleService roleService;
    private final LoginService loginService;
    private final TokenService tokenService;
    private final UserService userService;
    private final CountryService countryService;

    public CompanyController(CompanyService companyService, CompanyKnowsCompanyService companyKnowsCompanyService, RoleService roleService, LoginService loginService, TokenService tokenService, UserService userService, CountryService countryService) {
        this.companyService = companyService;
        this.companyKnowsCompanyService = companyKnowsCompanyService;
        this.roleService = roleService;
        this.loginService = loginService;
        this.tokenService = tokenService;
        this.userService = userService;
        this.countryService = countryService;
    }

    @GetMapping("/traders")
    @Operation(summary = "Get known company traders", security = @SecurityRequirement(name = "bearerAuth"))
    public List<CompanyPresentable> getCompanyTraders() throws UneceException {
        Company currentCompany = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        Role certifierRole = this.roleService.getRoleByName("certifier");
        return this.companyKnowsCompanyService
                .getKnownCompanies(currentCompany)
                .stream()
                .filter(c -> !certifierRole.getName().equals(c.getPartnerType() != null ? c.getPartnerType().getName() : ""))
                .map(CompanyPresentable::new)
                .collect(Collectors.toList());
    }

    @GetMapping("approvers/self_certification")
    @Operation(summary = "Get trader and certifier approvers for self certification (verified by second party)", security = @SecurityRequirement(name = "bearerAuth"))
    public List<CompanyPresentable> getTradersAndCertifierApprovers() throws UneceException {
        Company currentCompany = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        // return all the company knows company rows of the logged company because they are the relation between both traders and certifiers
        return this.companyKnowsCompanyService
                .getKnownCompanies(currentCompany)
                .stream()
                .map(CompanyPresentable::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/approvers")
    @Operation(summary = "Get company approvers", security = @SecurityRequirement(name = "bearerAuth"))
    public List<CompanyPresentable> getCompanyApprovers() throws UneceException {
        Company currentCompany = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        Role certifierRole = this.roleService.getRoleByName("certifier");

        return this.companyKnowsCompanyService
                .getKnownCompanies(currentCompany)
                .stream()
                // here I want to see only business parties when I am a certifier and certifiers when I am business party
                .filter(c ->  certifierRole.getName().equals(currentCompany.getPartnerType().getName()) != certifierRole.equals(c.getPartnerType()))
                .map(CompanyPresentable::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/emailAddresses")
    public List<String> getCompanyEmails(@RequestParam(value = "companyName") String name) {
        return companyService.getEmailsFromCompanyName(name);
    }


    @GetMapping("/custodialWalletCredentials")
    @Operation(summary = "Get wallet credentials of this facility", security = @SecurityRequirement(name = "bearerAuth"))
    public CustodialWalletCredentialsPresentable getFacilityCustodialWalletCredentials() throws UneceException {
        String companyId = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany().getEthAddress();
        Optional<CustodialWalletCredentialsPresentable> optionalCustodialWalletCredentialsPresentable = companyService.getCompanyCustodialWalletCredentials(companyId);
        if(optionalCustodialWalletCredentialsPresentable.isPresent()){
            return optionalCustodialWalletCredentialsPresentable.get();
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found", new Exception());
    }

    @PutMapping("/custodialWalletCredentials")
    @Operation(summary = "Set the wallet credentials for a facility", security = @SecurityRequirement(name = "bearerAuth"))
    public CustodialWalletCredentialsPresentable putFacilityCustodialWalletCredentials(@RequestBody CustodialWalletCredentialsRequest custodialWalletCredentialsRequest) throws Exception {
        String companyId = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany().getEthAddress();
        CustodialWalletCredentialsPresentable newWallet;
        try {
            newWallet = companyService.putCompanyCustodialWalletCredentials(companyId, custodialWalletCredentialsRequest.getPrivateKey(), custodialWalletCredentialsRequest.getPublicKey());
        } catch (Exception exception){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Eth Address Already Exist");
        }
        return newWallet;
    }

    @GetMapping("/publicKey")
    public String getPublicKeyByEthAddress(@RequestParam(value = "ethAddress") String ethAddress) {
        return companyService.getPublicKeyByEthAddress(ethAddress);
    }

    @GetMapping("/{token}/onboarding")
    @Operation(summary = "Get company from its token code (obtained after invitation)")
    public CompanyPresentable getCompanyFromToken(@PathVariable String token){
        Company company = tokenService.getCompanyFromRegistrationToken(token);
        if (company == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The token code is not correct!");
        return new CompanyPresentable(company);
    }

    @PostMapping("/{token}/onboarding")
    @Operation(summary = "Finish the on-boarding phase of an invited company")
    public void postCompanyOnboarding(@PathVariable String token, @RequestBody TotalOnboardingRequest totalOnboardingRequest) throws UneceException {
        totalOnboardingRequest.validate();
        Company companyToUpdate = tokenService.getCompanyFromRegistrationToken(token);
        companyService.updateInvitedCompany(companyToUpdate, totalOnboardingRequest);
        User savedUser = userService.createUserFromOnboardingRequest(totalOnboardingRequest);

        loginService.post(savedUser, totalOnboardingRequest.getUsername(), totalOnboardingRequest.getPassword());
        tokenService.removeTokenFromCode(token);
    }

    @PostMapping("/supplier/invite")
    @Operation(summary = "Invitation of a supplier company")
    public void postSupplierInvitation(@RequestBody TotalOnboardingRequest totalOnboardingRequest){
        companyService.inviteSupplier(totalOnboardingRequest.getCompanyName(), totalOnboardingRequest.getUserEmailAddress());
    }

    @PutMapping("/update")
    @Operation(summary = "Update an existing company", security = @SecurityRequirement(name = "bearerAuth"))
    public Company updateCompany(@RequestBody CompanyRequest companyRequest) throws UneceException {
        companyRequest.validate();
        Company loggedCompany = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();

        loggedCompany.setCompanyName(companyRequest.getName());
        loggedCompany.setCompanyCode(companyRequest.getCode());
        loggedCompany.setState(companyRequest.getState());
        loggedCompany.setCity(companyRequest.getCity());
        loggedCompany.setZip(companyRequest.getZip());
        loggedCompany.setAddress1(companyRequest.getAddress1());
        loggedCompany.setAddress2(companyRequest.getAddress2());
        loggedCompany.setLatitude(companyRequest.getLatitude());
        loggedCompany.setLongitude(companyRequest.getLongitude());
        loggedCompany.setWebsite(companyRequest.getWebsite());
        loggedCompany.setCountry(countryService.findByCode(companyRequest.getCountry()));

        return companyService.save(loggedCompany);
    }


//    @GetMapping("/templates")
//    public Map<Long, String> getFacilitiesDocumentTemplates(@RequestParam(value = "facId") Long id) {
//        List<DocuTemplate> templates = documentService.getDocumentsTemplateFromFacilityId(id);
//        Map<Long, String> returnMap = new HashMap<>();
//        for (DocuTemplate template : templates)
//            returnMap.put(template.getId(), String.format("%s %s %s", template.getDocuId(), template.getInternalProcessName(), template.getDescription()));
//
//        return returnMap;
//    }
//
//    @PostMapping(value = "/partner/create")
//    // se della compagnia viene passato solo il codice allora vuol dire che è stata trovata dal sistema e verrà ritornato l'oggetto stesso, altrimenti ne verrà creata una nuova
//    public Company companyPartnerCreateOrGet(@ModelAttribute Company company) throws Exception {
//        Company postedPartner;
//        if (company.getCompanyName() != null && company.getGS1Id() != null) {
//            postedPartner = companyService.saveCompany(company);
//        } else
//            postedPartner = companyService.getCompanyFromCode(company.getCompanyCode());
//
//        return postedPartner;
//    }

//    @PostMapping("/facility/create")
//    // se della compagnia viene passato solo il codice allora vuol dire che è stata trovata dal sistema e verrà ritornato l'oggetto stesso, altrimenti ne verrà creata una nuova
//    public Company companyFacilityCreateOrGet(@ModelAttribute Company company) throws Exception {
//        Company postedFacility;
//        if (company.getCompanyHead().getCompanyCode().equalsIgnoreCase(company.getCompanyCode()))
//            postedFacility = companyService.updateCompanyHead(company.getCompanyHead(), company.getCompanyHead());
//        else if (company.getCompanyName() != null && company.getGS1Id() != null) {
//            postedFacility = companyService.saveCompany(company);
//        } else
//            postedFacility = companyService.getCompanyFromCode(company.getCompanyCode());
//        User user = loginService.get(UneceServer.getLoggedUsername()).getUser();
//        user.setCompany(postedFacility);
//        coreService.putUser(user);
//
//        return postedFacility;
//    }

//    TODO: in teoria non serve più
//    @PostMapping(value = "/parentcompanyinfo")
//    public String parentCompanyPost(Company company, @RequestParam(value = "son_id", required = true) Long sonId) throws Exception {
//        Company finalCompany = companyService.saveCompany(company, sonId);
//        User user = this.coreService.getUser(utility.getLoggedUsername());
//        user.setCompany(finalCompany);
//        coreService.putUser(user);
//
//        return "redirect:/";
//    }

//    @PostMapping("/checkCode")
//    @CrossOrigin(origins = "http://localhost:3000")
//    public boolean checkCode(@RequestParam(value = "code") String code, @RequestParam(value = "isPartner", required = false) Boolean isPartner) {
//        List<String> companiesCode = companyService.getCompaniesCode(isPartner);
//        companiesCode = companiesCode.parallelStream()
//                .filter(companyCode -> companyCode.equalsIgnoreCase(code))
//                .collect(Collectors.toList());
//        return companiesCode.size() > 0;
//    }


}
