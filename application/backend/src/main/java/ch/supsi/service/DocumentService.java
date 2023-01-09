package ch.supsi.service;

import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.Document;
import ch.supsi.model.DocumentType;
import ch.supsi.model.position.TransformationPlanPosition;
import ch.supsi.model.transaction.certification.MaterialCertificationDocumentType;
import ch.supsi.model.transaction.certification.ScopeCertificationDocumentType;
import ch.supsi.model.transaction.certification.SelfCertificationDocumentType;
import ch.supsi.model.transaction.certification.TransactionCertificationDocumentType;
import ch.supsi.model.transaction.trade.ContractDocumentType;
import ch.supsi.model.transaction.trade.OrderDocumentType;
import ch.supsi.model.transaction.trade.ShippingDocumentType;
import ch.supsi.repository.DocumentRepository;
import ch.supsi.repository.DocumentTypeRepository;
import ch.supsi.repository.transaction.certificate.CertificationTransactionRepository;
import ch.supsi.repository.transaction.certificate.MaterialCertificationDocumentTypeRepository;
import ch.supsi.repository.transaction.certificate.ScopeCertificationDocumentTypeRepository;
import ch.supsi.repository.transaction.certificate.SelfCertificationDocumentTypeRepository;
import ch.supsi.repository.transaction.certificate.TransactionCertificationDocumentTypeRepository;
import ch.supsi.repository.transaction.trade.*;
import ch.supsi.request.DocumentRequest;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class DocumentService {

    //    private final DocuTemplateRepository docuTemplateRepository;
    private final DocumentRepository documentRepository;
    private final ContractDocumentTypeRepository contractDocumentTypeRepository;
    private final OrderDocumentTypeRepository orderDocumentTypeRepository;
    private final ShippingDocumentTypeRepository shippingDocumentTypeRepository;
    private final ScopeCertificationDocumentTypeRepository scopeCertificationDocumentTypeRepository;
    private final TransactionCertificationDocumentTypeRepository transactionCertificationDocumentTypeRepository;
    private final MaterialCertificationDocumentTypeRepository materialCertificationDocumentTypeRepository;
    private final SelfCertificationDocumentTypeRepository selfCertificationDocumentTypeRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final ContractTradeRepository contractTradeRepository;
    private final OrderTradeRepository orderTradeRepository;
    private final ShippingTradeRepository shippingTradeRepository;
    private final CertificationTransactionRepository certificationTransactionRepository;
    private final SupplyChainInfoService supplyChainInfoService;
    private final TransactionService transactionService;
    private final LoginService loginService;
    private final TransformationPlanService transformationPlanService;


    public DocumentService(DocumentRepository documentRepository, ContractDocumentTypeRepository contractDocumentTypeRepository, OrderDocumentTypeRepository orderDocumentTypeRepository, ShippingDocumentTypeRepository shippingDocumentTypeRepository, ScopeCertificationDocumentTypeRepository scopeCertificationDocumentTypeRepository, TransactionCertificationDocumentTypeRepository transactionCertificationDocumentTypeRepository, MaterialCertificationDocumentTypeRepository materialCertificationDocumentTypeRepository, SelfCertificationDocumentTypeRepository selfCertificationDocumentTypeRepository, DocumentTypeRepository documentTypeRepository, ContractTradeRepository contractTradeRepository, OrderTradeRepository orderTradeRepository, ShippingTradeRepository shippingTradeRepository, CertificationTransactionRepository certificationTransactionRepository, SupplyChainInfoService supplyChainInfoService, TransactionService transactionService, LoginService loginService, TransformationPlanService transformationPlanService) {
        this.documentRepository = documentRepository;
        this.contractDocumentTypeRepository = contractDocumentTypeRepository;
        this.orderDocumentTypeRepository = orderDocumentTypeRepository;
        this.shippingDocumentTypeRepository = shippingDocumentTypeRepository;
        this.scopeCertificationDocumentTypeRepository = scopeCertificationDocumentTypeRepository;
        this.transactionCertificationDocumentTypeRepository = transactionCertificationDocumentTypeRepository;
        this.materialCertificationDocumentTypeRepository = materialCertificationDocumentTypeRepository;
        this.selfCertificationDocumentTypeRepository = selfCertificationDocumentTypeRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.contractTradeRepository = contractTradeRepository;
        this.orderTradeRepository = orderTradeRepository;
        this.shippingTradeRepository = shippingTradeRepository;
        this.certificationTransactionRepository = certificationTransactionRepository;
        this.supplyChainInfoService = supplyChainInfoService;
        this.transactionService = transactionService;
        this.loginService = loginService;
        this.transformationPlanService = transformationPlanService;
    }

    public List<DocumentType> getContractDocumentTypes() {
        return fromCodesToDocumentTypes(contractDocumentTypeRepository.findAll().stream().map(ContractDocumentType::getCode).collect(Collectors.toList()));
    }

    public List<DocumentType> getOrderDocumentTypes() {
        return fromCodesToDocumentTypes(orderDocumentTypeRepository.findAll().stream().map(OrderDocumentType::getCode).collect(Collectors.toList()));
    }

    public List<DocumentType> getShippingDocumentTypes() {
        return fromCodesToDocumentTypes(shippingDocumentTypeRepository.findAll().stream().map(ShippingDocumentType::getCode).collect(Collectors.toList()));
    }

    public List<DocumentType> getScopeCertificationDocumentTypes() {
        return fromCodesToDocumentTypes(scopeCertificationDocumentTypeRepository.findAll().stream().map(ScopeCertificationDocumentType::getCode).collect(Collectors.toList()));
    }

    public List<DocumentType> getTransactionCertificationDocumentTypes() {
        return fromCodesToDocumentTypes(transactionCertificationDocumentTypeRepository.findAll().stream().map(TransactionCertificationDocumentType::getCode).collect(Collectors.toList()));
    }

    public List<DocumentType> getMaterialCertificationDocumentTypes() {
        return fromCodesToDocumentTypes(materialCertificationDocumentTypeRepository.findAll().stream().map(MaterialCertificationDocumentType::getCode).collect(Collectors.toList()));
    }

    public List<DocumentType> getSelfCertificationDocumentTypes() {
        return fromCodesToDocumentTypes(selfCertificationDocumentTypeRepository.findAll().stream().map(SelfCertificationDocumentType::getCode).collect(Collectors.toList()));
    }

    public DocumentType getDocumentTypeFromCode(String code) {
        return documentTypeRepository.findById(code).get();
    }

    public Document saveDocumentFromRequest(DocumentRequest documentRequest) {
        Document document = new Document(documentRequest.getName(), documentRequest.getContentType(), Base64.getDecoder().decode(documentRequest.getContent()));
        return documentRepository.save(document);
    }

    public Optional<Document> getDocumentById(Long id) {
        return this.documentRepository.getDocumentById(id);
    }

    private List<DocumentType> fromCodesToDocumentTypes(List<String> documentTypeCodes) {
        return documentTypeRepository.findDocumentTypesByCodeIn(documentTypeCodes);
    }

    public boolean isDocumentInvolvedInMyTransactions(Long documentId, Company company) {
        if (shippingTradeRepository.findAllByDocumentIdAndConsigneeOrContractor(documentId, company).size() > 0)
            return true;
        if (contractTradeRepository.findAllByDocumentIdAndConsigneeOrContractor(documentId, company).size() > 0)
            return true;
        if (certificationTransactionRepository.findAllByDocumentIdAndConsigneeOrContractor(documentId, company).size() > 0)
            return true;
        return orderTradeRepository.findAllByDocumentIdAndConsigneeOrContractor(documentId, company).size() > 0;
    }

    public boolean isDocumentDownloadableFromCompany(Company currentCompany, Long documentId){
        //TODO search a better solution
        //1_For all my transformation plans
        //2_For all (OUT) positions
        //3_Calculate the supply chain
        //4_If required document is inside a transformations or trades in one supply chain the user can download it
        long count = transformationPlanService
                .findAllTransformationPlansFromCompanyName(currentCompany.getCompanyName())
                .stream()
                .flatMap(t -> transformationPlanService.findAllPositionByTransformationPlanId(t.getId()).stream())
                .filter(p -> !((TransformationPlanPosition) p).isIn())
                .flatMap(p -> {
                    try {
                        return Stream.of(supplyChainInfoService.getSupplyChainInitial(p.getConsigneeMaterial().getId()));
                    } catch (UneceException | NoSuchAlgorithmException e) {
                        return Stream.empty();
                    }
                })
                .filter(s ->
                        s.getTransformations().stream().anyMatch(t -> t.getCertificates().stream().anyMatch(c -> c.getDocumentId() != null && c.getDocumentId().equals(documentId))) ||
                        s.getTrades().stream().anyMatch(t -> t.getCertificates().stream().anyMatch(c -> c.getDocumentId() != null && c.getDocumentId().equals(documentId))) ||
                        s.getTrades().stream().anyMatch(t -> t.getDocumentId() != null && t.getDocumentId().equals(documentId))
                )
                .count();
        return count > 0;
    }

    //    public Document post(Document document){
//        return documentRepository.save(document);
//    }

//    public List<DocuTemplate> getDocumentsTemplateFromFacilityId(Long id){
//        return docuTemplateRepository.findAllByCompanyId(id);
//    }

}
