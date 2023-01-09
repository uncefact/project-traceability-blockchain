package ch.supsi.service;

import ch.supsi.exception.UneceException;
import ch.supsi.model.Token;
import ch.supsi.model.company.Company;
import ch.supsi.model.User;
import ch.supsi.model.CustodialWalletCredentials;
import ch.supsi.model.company.CompanyKnowsCompany;
import ch.supsi.presentable.CustodialWalletCredentialsPresentable;
import ch.supsi.repository.company.CompanyKnowsCompanyRepository;
import ch.supsi.repository.company.CompanyRepository;
import ch.supsi.repository.UserRepository;
import ch.supsi.repository.CustodialWalletCredentialsRepository;
import ch.supsi.request.onboarding.TotalOnboardingRequest;
import ch.supsi.request.onboarding.UserOnboardingRequest;
import ch.supsi.request.transaction.TransactionRequest;
import ch.supsi.util.UneceServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.*;

import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CompanyService {


    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final CustodialWalletCredentialsRepository custodialWalletCredentialsRepository;
    private final CompanyKnowsCompanyRepository companyKnowsCompanyRepository;
    private final MailService mailService;
    private final LoginService loginService;
    private final TokenService tokenService;
    private final RoleService roleService;

    @Autowired
    public CompanyService(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            CustodialWalletCredentialsRepository custodialWalletCredentialsRepository, CompanyKnowsCompanyRepository companyKnowsCompanyRepository, MailService mailService, LoginService loginService, TokenService tokenService, RoleService roleService) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.custodialWalletCredentialsRepository = custodialWalletCredentialsRepository;
        this.companyKnowsCompanyRepository = companyKnowsCompanyRepository;
        this.mailService = mailService;
        this.loginService = loginService;
        this.tokenService = tokenService;
        this.roleService = roleService;
    }


//    public Company saveCompany(Company company) {
//        Company fetchedCompany = this.companyRepository.findByCompanyCode(company.getCompanyCode());
//        if(fetchedCompany != null)
//            return fetchedCompany;
//
//        Date currentDate = new Date();
//        company.setCompanyCode(company.getCompanyCode());
//        company.setRegistrationDate(currentDate);
//        company.setLastEditDate(currentDate);
//        return this.companyRepository.save(company);
//    }
//
//    public Company updateCompanyHead(Company oldCompany, Company companyHead){
//        oldCompany.setCompanyHead(companyHead);
//        return this.companyRepository.save(oldCompany);
//    }

//    public Company saveCompany(Company company, Long sonId) {
//        company.setCompanyCode(company.getCompanyCode());
//        Company sonCompany = this.companyRepository.findById(sonId).get();
//        Company holdingCompany;
//        Company fetchedCompany = this.companyRepository.findByCompanyCode(company.getCompanyCode());
////        TODO: capire dove e come inserire le date di registrazione e ultima modifica
//        if(fetchedCompany != null)
//            holdingCompany = fetchedCompany;
//        else
//            holdingCompany = this.companyRepository.save(company);
//
//        sonCompany.setCompanyHead(holdingCompany);
//        this.companyRepository.save(sonCompany);
//        return sonCompany;
//    }
//
//    public List<String> getCompaniesCode(Boolean isPartner){
//        //if partner is not set it returns all companies code
//        if (isPartner == null)
//            return companyRepository.findAll().stream().map(Company::getCompanyCode).collect(Collectors.toList());
//        else if (!isPartner)
//            return companyRepository.findAll().stream().filter(company -> company.getCompanyHead() != null).map(Company::getCompanyCode).collect(Collectors.toList());
//        return companyRepository.findAll().stream().filter(company -> company.getCompanyHead() == null).map(Company::getCompanyCode).collect(Collectors.toList());
//    }

    public Company save(Company company){
        company.setLastEditDate(new Date());
        return companyRepository.save(company);
    }

    public Company getCompanyFromCode(String code){
        return companyRepository.findByCompanyCode(code);
    }

    public Company getCompanyFromName(String companyName){
        return companyRepository.findByCompanyName(companyName);
    }

    public Company updateInvitedCompany(Company invitedCompany, TotalOnboardingRequest totalOnboardingRequest){
        invitedCompany.setCompanyName(totalOnboardingRequest.getCompanyName());
        invitedCompany.setCompanyCode(totalOnboardingRequest.getCompanyCode());
        invitedCompany.setPartnerType(totalOnboardingRequest.getCompanyRole());
        invitedCompany.setWebsite(totalOnboardingRequest.getCompanyWebsite());
        invitedCompany.setCountry(totalOnboardingRequest.getCompanyCountry());
        invitedCompany.setState(totalOnboardingRequest.getCompanyState());
        invitedCompany.setCity(totalOnboardingRequest.getCompanyCity());
        invitedCompany.setAddress1(totalOnboardingRequest.getCompanyAddress());
        invitedCompany.setLatitude(totalOnboardingRequest.getCompanyLatitude());
        invitedCompany.setLongitude(totalOnboardingRequest.getCompanyLongitude());

        return companyRepository.save(invitedCompany);
    }


//    public Map<Long, String> getAllFacilitiesNameAndId(){
//        return companyRepository.findAll().parallelStream().filter(c -> c.getCompanyHead() != null).collect(Collectors.toMap(Company::getId, Company::getCompanyName));
//    }

    public List<String> getEmailsFromCompanyName(String companyName){
        Company company = this.companyRepository.findByCompanyName(companyName);
        List<User> users = this.userRepository.findAll();
        return users.parallelStream().filter(u -> u.getCompany().equals(company)).map(User::getEmail).collect(Collectors.toList());
    }

    public Company inviteCompanyFromTransactionRequest(TransactionRequest transactionRequest, boolean isCertifier) {
        try {
            return companyInvitation(transactionRequest.getConsigneeCompanyName(), transactionRequest.getConsigneeEmail(), false, isCertifier);
        }
        catch (UneceException e){
            e.printStackTrace();
        }
        return null;
    }

    public void inviteSupplier(String companyName, String userEmail){
        try {
            companyInvitation(companyName, userEmail, true, false);
        } catch (UneceException e) {
            e.printStackTrace();
        }
    }

    public Optional<CustodialWalletCredentialsPresentable> getCompanyCustodialWalletCredentials(String companyId) {
        Company company = companyRepository.getOne(companyId);
        CustodialWalletCredentials custodialWalletCredentials = company.getCustodialWalletCredentials();
        if(custodialWalletCredentials==null)
            return Optional.empty();
        return Optional.of(new CustodialWalletCredentialsPresentable(custodialWalletCredentials));
    }

    public CustodialWalletCredentialsPresentable putCompanyCustodialWalletCredentials(String companyId, String privateKey, String publicKey){
        Company company = companyRepository.findById(companyId).get();
        CustodialWalletCredentials custodialWalletCredentials = new CustodialWalletCredentials();
        custodialWalletCredentials.setPrivateKey(privateKey);
        custodialWalletCredentials.setPublicKey(publicKey);
        custodialWalletCredentialsRepository.save(custodialWalletCredentials);
        company.setCustodialWalletCredentials(custodialWalletCredentials);
        companyRepository.save(company);
        return new CustodialWalletCredentialsPresentable(custodialWalletCredentials);
    }

    public String getPublicKeyByEthAddress(String ethAddress) {
        Company company = this.companyRepository.findByEthAddress(ethAddress);
        return company.getCustodialWalletCredentials().getPublicKey();
    }

    private Company companyInvitation(String newCompanyName, String newUserEmail, boolean isSupplier, boolean isCertifier) throws UneceException {
        List<Company> allCompanies = companyRepository.findAll();
        Company newCompany = companyRepository.findByCompanyName(newCompanyName);
        Company loggedCompany = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();

        // if the company from the trade request is not present it means that it has been invited by the logged user
        if (allCompanies.stream().noneMatch(c -> c.getCompanyName().toLowerCase().trim().equals(newCompanyName.toLowerCase().trim()))){
            Map<String, String> walletKeys = createWalletKeyPair();
            CustodialWalletCredentials companyWalletCredentials = new CustodialWalletCredentials(walletKeys.get("privateKey"), walletKeys.get("publicKey"));
            custodialWalletCredentialsRepository.save(companyWalletCredentials);

            // the company code will be the same as the company name until the on-boarding process is finished (then it will be overridden by the correct one)
            // the ID of the company will be the eth address (public key with 0x at the beginning)
            if (isCertifier)
                newCompany = companyRepository.save(new Company(companyWalletCredentials.getPublicKey(), newCompanyName, newCompanyName, loggedCompany.getCompanyIndustry(), companyWalletCredentials, roleService.getRoleByName("certifier")));
            else
                newCompany = companyRepository.save(new Company(companyWalletCredentials.getPublicKey(), newCompanyName, newCompanyName, loggedCompany.getCompanyIndustry(), companyWalletCredentials));

            Token registrationToken = tokenService.save(new Token(loggedCompany, newCompany));
            mailService.sendCompanyInvitationEmail(newUserEmail, registrationToken.getTokenCode(), isSupplier);
            // let's notify the UNECE secretary that a new company has been invited
            mailService.sendCompanyInvitationNotificationEmail(newCompany);
        }
        else {
            if (!userRepository.existsById(newUserEmail)) {
                Token registrationToken = tokenService.save(new Token(loggedCompany, newCompany));
                mailService.sendColleagueInvitationEmailFromRequest(new UserOnboardingRequest(newUserEmail), registrationToken.getTokenCode());
            }
        }

        try {
            if (isSupplier)
                companyKnowsCompanyRepository.save(new CompanyKnowsCompany(newCompany, loggedCompany));
            else
                companyKnowsCompanyRepository.save(new CompanyKnowsCompany(loggedCompany, newCompany));
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return null;
        }

        return newCompany;
    }

    public CompanyKnowsCompany saveCompanyKnowsCompany(Company companyA, Company companyB) {
        return companyKnowsCompanyRepository.save(new CompanyKnowsCompany(companyA, companyB));
    }

    private Map<String, String> createWalletKeyPair(){
        Map<String, String> keys = new HashMap<>();
        try {
            ECKeyPair ecKeyPair = Keys.createEcKeyPair();
            BigInteger privateKeyDec = ecKeyPair.getPrivateKey();
            WalletFile wallet = Wallet.createLight(UUID.randomUUID().toString(), ecKeyPair);


            keys.put("privateKey", "0x" + privateKeyDec.toString(16));
            keys.put("publicKey", "0x" + wallet.getAddress());


        } catch (InvalidAlgorithmParameterException | NoSuchAlgorithmException | NoSuchProviderException | CipherException e) {
            e.printStackTrace();
        }
        return keys;
    }

}
