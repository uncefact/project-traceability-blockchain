package ch.supsi.controller;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.ProcessType;
import ch.supsi.model.transaction.Transaction;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.model.transaction.certification.*;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.model.transaction.trade.Trade;
import ch.supsi.presentable.AssessmentTypePresentable;
import ch.supsi.presentable.confirmation.ConfirmationCertificationPresentable;
import ch.supsi.presentable.ProcessingStandardPresentable;
import ch.supsi.presentable.table.TableCertificationPresentable;
import ch.supsi.request.transaction.certification.CertificationRequest;
import ch.supsi.service.*;
import ch.supsi.util.UneceServer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/certifications")
public class CertificationController {

    private final CompanyService companyService;
    private final LoginService loginService;
    private final DocumentService documentService;
    private final CertificationService certificationService;
    private final MailService mailService;
    private final TradeService tradeService;
    private final TransactionService transactionService;
    private final MaterialService materialService;
    private final RoleService roleService;


    public CertificationController(CompanyService companyService, LoginService loginService, DocumentService documentService, CertificationService certificationService, MailService mailService, TradeService tradeService, MaterialService materialService, TransactionService transactionService, RoleService roleService) {
        this.companyService = companyService;
        this.loginService = loginService;
        this.documentService = documentService;
        this.certificationService = certificationService;
        this.mailService = mailService;
        this.tradeService = tradeService;
        this.materialService = materialService;
        this.transactionService = transactionService;
        this.roleService = roleService;
    }

    @GetMapping("")
    public List<TableCertificationPresentable> getMyCertifications() throws UneceException {
        Company loggedCompany = loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();
        Set<CertificationTransaction> certifications = new HashSet<>(certificationService.getCertificationsByConsigneeCompanyName(loggedCompany.getCompanyName()));
        certifications.addAll(certificationService.getCertificationsByContractorCompanyName(loggedCompany.getCompanyName()));

        return certifications.stream().map(TableCertificationPresentable::new).collect(Collectors.toList());
    }

    @GetMapping("/assessments/types")
    public List<AssessmentTypePresentable> getAssessmentTypes(@RequestParam(name = "type", required = false) String certificationType){
        if (certificationType != null && certificationType.equals(CertificationSubject.SELF.name().toLowerCase()))
            return certificationService.getSelfCertificationAssessmentTypes().stream().map(AssessmentTypePresentable::new).collect(Collectors.toList());
        return certificationService.getThirdPartyAssessmentTypes().stream().map(AssessmentTypePresentable::new).collect(Collectors.toList());
    }

    @GetMapping("/processingStandards")
    public List<ProcessingStandardPresentable> getCertificationProcessingStandards(@RequestParam(name = "type", required = false) String certificationType) throws UneceException {
        Company loggedCompany = this.loginService.get(UneceServer.getLoggedUsername()).getUser().getCompany();

        if (certificationType != null){
            if (certificationType.equals(CertificationSubject.SELF.name().toLowerCase()))
                return certificationService.getSelfCertificationProprietaryStandards(loggedCompany.getCompanyIndustry()).stream().map(ProcessingStandardPresentable::new).collect(Collectors.toList());
            else if (certificationType.equals(CertificationSubject.MATERIAL.name().toLowerCase()))
                return certificationService.getMaterialCertificationReferencedStandards(loggedCompany.getCompanyIndustry()).stream().map(ProcessingStandardPresentable::new).collect(Collectors.toList());
            else if (certificationType.equals(CertificationSubject.TRANSACTION.name().toLowerCase()))
                return certificationService.getTransactionCertificationReferencedStandards(loggedCompany.getCompanyIndustry()).stream().map(ProcessingStandardPresentable::new).collect(Collectors.toList());
        }
        return certificationService.getReferencedStandards(loggedCompany.getCompanyIndustry()).stream().map(ProcessingStandardPresentable::new).collect(Collectors.toList());
    }

    @GetMapping("/productCategories")
    public List<ProductCategory> getAllProductCategories(){
        return certificationService.getAllProductCategories();
    }

    @GetMapping("/{id}")
    public ConfirmationCertificationPresentable getCertification(@PathVariable Long id) throws UneceException {
        CertificationTransaction certificationTransaction = certificationService.getCertificateFromId(id);
        if (certificationTransaction == null)
            throw new UneceException(UneceError.TRANSACTION_NOT_FOUND);
        Trade certificateTradeSubject = tradeService.getTradeByCertification(certificationTransaction);//If null, the certificate is related to a transformation
        //I can access to certificate if I'm the certifier, subject under certification or trade consignee
        if(!(transactionService.isLoggedUserConsigneeOrContractor(certificationTransaction) || (certificateTradeSubject!=null && transactionService.isLoggedUserConsigneeOrContractor(certificateTradeSubject))))
            throw new UneceException(UneceError.FORBIDDEN);
        ConfirmationCertificationPresentable confirmationCertificationPresentable = new ConfirmationCertificationPresentable(certificationTransaction);
        if(certificationTransaction.getSubject().equals(CertificationSubject.TRANSACTION)){
            confirmationCertificationPresentable.setShippingReferenceNumbers(
                    this.tradeService.getAllShippingByCertification(certificationTransaction)
                            .stream()
                            .map(Transaction::getContractorReferenceNumber)
                            .collect(Collectors.toList())
            );

        }
        return confirmationCertificationPresentable;
    }

    @PostMapping()
    @Operation(summary = "Create a certification", security = @SecurityRequirement(name = "bearerAuth"))
    public ConfirmationCertificationPresentable createCertification(@RequestBody CertificationRequest certificationRequest) throws UneceException {
        certificationRequest.validate();
        User loggedUser = this.loginService.get(UneceServer.getLoggedUsername()).getUser();
        String certifierRoleName = this.roleService.getRoleByName("certifier").getName();

        if (certificationRequest.isInvitation()) {
            Company newCompany = companyService.inviteCompanyFromTransactionRequest(certificationRequest, !certifierRoleName.equals(loggedUser.getCompany().getPartnerType().getName()));
            if (certifierRoleName.equals(loggedUser.getCompany().getPartnerType().getName()))
                companyService.saveCompanyKnowsCompany(newCompany, loggedUser.getCompany());
        }

        Company requestContractor = certificationRequest.getContractorCompanyName() != null ? companyService.getCompanyFromName(certificationRequest.getContractorCompanyName()) : loggedUser.getCompany();
        String requestContractorEmail = certificationRequest.getContractorEmail() != null ? certificationRequest.getContractorEmail() : loggedUser.getEmail();
        Company requestConsignee = certificationRequest.getConsigneeCompanyName() != null ? companyService.getCompanyFromName(certificationRequest.getConsigneeCompanyName()) : loggedUser.getCompany();
        String requestConsigneeEmail = certificationRequest.getConsigneeEmail() != null ? certificationRequest.getConsigneeEmail() : loggedUser.getEmail();

        CertificationTransaction.CertificationTransactionBuilder certificationTransactionBuilder = CertificationTransaction.builder();

        if(certificationRequest.getSubject().equals(CertificationSubject.SCOPE) || certificationRequest.getSubject().equals(CertificationSubject.MATERIAL)){
            if(!certifierRoleName.equals(requestContractor.getPartnerType().getName()) && !certifierRoleName.equals(requestConsignee.getPartnerType().getName())){
                throw new UneceException(UneceError.INVALID_VALUE, "No certifier company");
            }
            if(certifierRoleName.equals(requestContractor.getPartnerType().getName()) && (requestConsignee.getPartnerType() != null && certifierRoleName.equals(requestConsignee.getPartnerType().getName()))){
                throw new UneceException(UneceError.INVALID_VALUE, "No business partner");
            }
//            Contractor is always the certifier, Consignee is always the business partner
            Company certifier = certifierRoleName.equals(requestContractor.getPartnerType().getName()) ? requestContractor : requestConsignee;
            String certifierEmail = certifierRoleName.equals(requestContractor.getPartnerType().getName()) ? requestContractorEmail : requestConsigneeEmail;
//            if the requestConsignee has a null partnerType means that it has been just invited
            Company businessParty = requestConsignee.getPartnerType() == null || !certifierRoleName.equals(requestConsignee.getPartnerType().getName()) ? requestConsignee : requestContractor;
            String businessPartyEmail = requestConsignee.getPartnerType() == null || !certifierRoleName.equals(requestConsignee.getPartnerType().getName()) ? requestConsigneeEmail : requestContractorEmail;

//            Approver is always the requestConsignee
            Company approver = requestConsignee;

            certificationTransactionBuilder
                    .contractor(certifier)
                    .consignee(businessParty)
                    .approver(approver)
                    .contractorEmail(certifierEmail)
                    .consigneeEmail(businessPartyEmail);

        }
        else {
            certificationTransactionBuilder
                    .contractor(requestContractor)
                    .consignee(requestConsignee)
                    .approver(requestConsignee)
                    .contractorEmail(requestContractorEmail)
                    .consigneeEmail(requestConsigneeEmail);
        }

        CertificationTransaction certificationTransaction = certificationTransactionBuilder
                .documentType(documentService.getDocumentTypeFromCode(certificationRequest.getDocumentTypeCode()))
                .document(certificationRequest.getDocumentUpload().getContent() != null ? documentService.saveDocumentFromRequest(certificationRequest.getDocumentUpload()) : null)
                .processingStandard(certificationRequest.getProcessingStandardName() != null ? certificationService.getProcessingStandardByName(certificationRequest.getProcessingStandardName()) : null)
                .assessmentType(certificationService.getAssessmentTypeByName(certificationRequest.getAssessmentName()))
                .validFrom(certificationRequest.getValidFrom())
                .validUntil(certificationRequest.getValidUntil())
                .contractorDate(new Date())
                .certificateReferenceNumber(certificationRequest.getCertificateReferenceNumber())
                .notes(certificationRequest.getNotes())
                .subject(certificationRequest.getSubject())
                .status(TransactionStatus.PENDING)
                .material(certificationRequest.getMaterial() != null ? this.materialService.getMaterialById(certificationRequest.getMaterial().getId()) : null)
                .certificatePageUrl(certificationRequest.getCertificatePageUrl())
                .build();

        this.certificationService.saveCertificateTransaction(certificationTransaction);

        // add certification_transaction_material entries if the certification is scope and there are output materials specified for it
        if (certificationRequest.getSubject().equals(CertificationSubject.SCOPE))
            this.certificationService.saveCertificationOutputMaterials(certificationRequest, certificationTransaction);

        if(certificationRequest.getShippingReferenceNumbers() != null){
            for (String shippingReferenceNumber : certificationRequest.getShippingReferenceNumbers()){
                ShippingTrade shippingTrade = this.tradeService.getShippingByContractorReferenceNumber(shippingReferenceNumber);
                shippingTrade.setCertificationTransaction(certificationTransaction);
                this.tradeService.saveShipping(shippingTrade);
            }
        }
        List<String> productCategoryCodeList = certificationRequest.getProductCategoryCodeList();
        if(productCategoryCodeList != null) {
            productCategoryCodeList.forEach(code ->
                            this.certificationService.saveCertificationTransactionProductCategory(
                                    new CertificationTransactionProductCategory(
                                            certificationTransaction,
                                            certificationService.getProductCategoryByCode(code)
                                    )
                            )
                    );
        }

        List<ProcessType> processTypes = certificationRequest.getProcessTypes();
        if(processTypes != null) {
            processTypes
                    .forEach(processType ->
                            this.certificationService.saveCertificationTransactionProcessType(
                                    new CertificationTransactionProcessType(
                                            certificationTransaction,
                                            certificationService.getProcessTypeByCode(processType.getCode())
                                    )
                            )
                    );
        }

        if (certificationTransaction.getSubject().equals(CertificationSubject.SELF) && certificationRequest.getConsigneeCompanyName() != null)
            this.mailService.sendConfirmationCertificationEmail(certificationTransaction, certificationTransaction.getConsigneeEmail(), certificationRequest.getSubject().name());
        //Independently from who is the real contractor and consignee, the one that will receive the email will always be the consignee specified in the request.
        else if (!certificationTransaction.getSubject().equals(CertificationSubject.SELF))
            this.mailService.sendConfirmationCertificationEmail(certificationTransaction, requestConsigneeEmail, certificationRequest.getSubject().name());

        return new ConfirmationCertificationPresentable(certificationTransaction);
    }

    @GetMapping("/{transactionType}/{id}")
    @Operation(summary = "Get Certification Ids By Transaction Id and Type", security = @SecurityRequirement(name = "bearerAuth"))
    public List<ConfirmationCertificationPresentable> getCertificationsByTransactionId(@PathVariable String transactionType, @PathVariable Long id) throws UneceException {
        return this.certificationService.getCertificationsByTransactionId(transactionType, id).stream().map(ConfirmationCertificationPresentable::new).collect(Collectors.toList());
    }
}
