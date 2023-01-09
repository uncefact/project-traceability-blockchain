package ch.supsi.service;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.company.CompanyIndustry;
import ch.supsi.model.position.Position;
import ch.supsi.model.ProcessType;
import ch.supsi.model.processing_standard.*;
import ch.supsi.model.transaction.certification.*;
import ch.supsi.model.transaction.certification.CertificationTransactionProcessType;
import ch.supsi.model.transaction.certification.CertificationTransactionProductCategory;
import ch.supsi.model.transaction.certification.assessment_type.AssessmentType;
import ch.supsi.model.transaction.certification.assessment_type.SelfCertificationAssessmentType;
import ch.supsi.model.transaction.certification.assessment_type.ThirdPartyAssessmentType;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.repository.MaterialRepository;
import ch.supsi.repository.ProcessTypeRepository;
import ch.supsi.repository.processing_standard.*;
import ch.supsi.repository.ProductCategoryRepository;
import ch.supsi.repository.transaction.certificate.CertificationTransactionRepository;
import ch.supsi.repository.transaction.certificate.CertificationTransactionProcessTypeRepository;
import ch.supsi.repository.transaction.certificate.CertificationTransactionProductCategoryRepository;
import ch.supsi.repository.transaction.certificate.assessment_type.AssessmentTypeRepository;
import ch.supsi.repository.transaction.certificate.assessment_type.SelfCertificationAssessmentTypeRepository;
import ch.supsi.repository.transaction.certificate.assessment_type.ThirdPartyAssessmentTypeRepository;
import ch.supsi.request.transaction.certification.CertificationRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CertificationService {

    private final ThirdPartyAssessmentTypeRepository thirdPartyAssessmentTypeRepository;
    private final AssessmentTypeRepository assessmentTypeRepository;
    private final SelfCertificationAssessmentTypeRepository selfCertificationAssessmentTypeRepository;
    private final CertificationTransactionRepository certificationTransactionRepository;
    private final ProcessingStandardRepository processingStandardRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProcessTypeRepository processTypeRepository;
    private final CertificationTransactionProcessTypeRepository certificationTransactionProcessTypeRepository;
    private final CertificationTransactionProductCategoryRepository certificationTransactionProductCategoryRepository;
    private final SelfCertificationProprietaryStandardRepository selfCertificationProprietaryStandardRepository;
    private final ReferencedStandardRepository referencedStandardRepository;
    private final MaterialCertificationReferencedStandardRepository materialCertificationReferencedStandardRepository;
    private final TransactionCertificationReferencedStandardRepository transactionCertificationReferencedStandardRepository;
    private final ProcessingStandardCompanyIndustryRepository processingStandardCompanyIndustryRepository;
    private final TradeService tradeService;
    private final TransformationPlanService transformationPlanService;
    private final MaterialRepository materialRepository;

    public CertificationService(ThirdPartyAssessmentTypeRepository thirdPartyAssessmentTypeRepository, AssessmentTypeRepository assessmentTypeRepository, SelfCertificationAssessmentTypeRepository selfCertificationAssessmentTypeRepository, CertificationTransactionRepository certificationTransactionRepository, ProcessingStandardRepository processingStandardRepository, ProductCategoryRepository productCategoryRepository, ProcessTypeRepository processTypeRepository, CertificationTransactionProcessTypeRepository certificationTransactionProcessTypeRepository, CertificationTransactionProductCategoryRepository certificationTransactionProductCategoryRepository, SelfCertificationProprietaryStandardRepository selfCertificationProprietaryStandardRepository, ReferencedStandardRepository referencedStandardRepository, MaterialCertificationReferencedStandardRepository materialCertificationReferencedStandardRepository, TransactionCertificationReferencedStandardRepository transactionCertificationReferencedStandardRepository, ProcessingStandardCompanyIndustryRepository processingStandardCompanyIndustryRepository, TradeService tradeService, TransformationPlanService transformationPlanService, MaterialRepository materialRepository) {
        this.thirdPartyAssessmentTypeRepository = thirdPartyAssessmentTypeRepository;
        this.assessmentTypeRepository = assessmentTypeRepository;
        this.selfCertificationAssessmentTypeRepository = selfCertificationAssessmentTypeRepository;
        this.certificationTransactionRepository = certificationTransactionRepository;
        this.processingStandardRepository = processingStandardRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.processTypeRepository = processTypeRepository;
        this.certificationTransactionProcessTypeRepository = certificationTransactionProcessTypeRepository;
        this.certificationTransactionProductCategoryRepository = certificationTransactionProductCategoryRepository;
        this.selfCertificationProprietaryStandardRepository = selfCertificationProprietaryStandardRepository;
        this.referencedStandardRepository = referencedStandardRepository;
        this.materialCertificationReferencedStandardRepository = materialCertificationReferencedStandardRepository;
        this.transactionCertificationReferencedStandardRepository = transactionCertificationReferencedStandardRepository;
        this.processingStandardCompanyIndustryRepository = processingStandardCompanyIndustryRepository;
        this.tradeService = tradeService;
        this.transformationPlanService = transformationPlanService;
        this.materialRepository = materialRepository;
    }

    public List<ThirdPartyAssessmentType> getThirdPartyAssessmentTypes() {
        return thirdPartyAssessmentTypeRepository.findAll();
    }

    public List<SelfCertificationAssessmentType> getSelfCertificationAssessmentTypes(){
        return selfCertificationAssessmentTypeRepository.findAll();
    }

    public AssessmentType getAssessmentTypeByName(String name) {
        return assessmentTypeRepository.getOne(name);
    }

    public CertificationTransaction saveCertificateTransaction(CertificationTransaction certificationTransaction) {
        return certificationTransactionRepository.save(certificationTransaction);
    }

    public List<ReferencedStandard> getReferencedStandards(CompanyIndustry companyIndustry) {
        List<String> processingStandardNamesFiltered = processingStandardCompanyIndustryRepository.findProcessingStandardNamesByCompanyIndustryName(companyIndustry.getName());
        return referencedStandardRepository.findAllByNameIn(processingStandardNamesFiltered);
    }

    public List<ProcessingStandard> getProcessingStandards(CompanyIndustry companyIndustry) {
        List<String> processingStandardNamesFiltered = processingStandardCompanyIndustryRepository.findProcessingStandardNamesByCompanyIndustryName(companyIndustry.getName());
        return processingStandardRepository.findByNameIn(processingStandardNamesFiltered);
    }

    public List<SelfCertificationProprietaryStandard> getSelfCertificationProprietaryStandards(CompanyIndustry companyIndustry){
        List<String> processingStandardNamesFiltered = processingStandardCompanyIndustryRepository.findProcessingStandardNamesByCompanyIndustryName(companyIndustry.getName());
        return selfCertificationProprietaryStandardRepository.findAllByNameIn(processingStandardNamesFiltered);
    }

    public List<MaterialCertificationReferencedStandard> getMaterialCertificationReferencedStandards(CompanyIndustry companyIndustry){
        List<String> processingStandardNamesFiltered = processingStandardCompanyIndustryRepository.findProcessingStandardNamesByCompanyIndustryName(companyIndustry.getName());
        return materialCertificationReferencedStandardRepository.findAllByNameIn(processingStandardNamesFiltered);
    }

    public List<TransactionCertificationReferencedStandard> getTransactionCertificationReferencedStandards(CompanyIndustry companyIndustry){
        List<String> processingStandardNamesFiltered = processingStandardCompanyIndustryRepository.findProcessingStandardNamesByCompanyIndustryName(companyIndustry.getName());
        return transactionCertificationReferencedStandardRepository.findAllByNameIn(processingStandardNamesFiltered);
    }

    public ProcessingStandard getProcessingStandardByName(String name) {
        return this.processingStandardRepository.getOne(name);
    }

    public ProcessType getProcessTypeByCode(String code) {
        return this.processTypeRepository.getOne(code);
    }

    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    public ProductCategory getProductCategoryByCode(String code) {
        Optional<ProductCategory> productCategory = productCategoryRepository.findById(code);
        return productCategory.orElse(null);
    }

    public CertificationTransaction getCertificateFromId(Long id) {
        return certificationTransactionRepository.getOne(id);
    }

    public void saveCertificationOutputMaterials(CertificationRequest certificationRequest, CertificationTransaction certificationTransaction){
        if (certificationRequest.getOutputMaterials() != null && certificationRequest.getOutputMaterials().size() > 0){
            Set<Material> outputMaterials = new HashSet<>(materialRepository.findAllByIdIn(
                    certificationRequest.getOutputMaterials().stream().map(MaterialPresentable::getId).collect(Collectors.toList())));
            certificationTransaction.setOutputMaterials(outputMaterials);
            certificationTransactionRepository.save(certificationTransaction);
        }
    }

//    public List<CertificationTransaction> getAllCertificateByCompanyWithoutProcessTypeNames(Company company) {
//        List<CertificationTransaction> certificationTransactionWithProcessTypes = this.certificationTransactionProcessTypeRepository
//                .findAll()
//                .stream()
//                .map(CertificationTransactionProcessType::getCertificationTransaction)
//                .collect(Collectors.toList());
//        return certificationTransactionRepository
//                .findAll()
//                .stream()
//                .filter(c -> c.getConsignee().equals(company))
//                .filter(c -> !certificationTransactionWithProcessTypes.contains(c))
//                .filter(c -> c.getSubject().equals(CertificationSubject.SCOPE))
//                .collect(Collectors.toList());
//    }

//    public List<CertificationTransaction> getAllCertificateByCompanyAndProcessTypeNames(Company company, List<String> processNames) {
//        //Return CertificationTransaction of company with the specified processNames or without processType
//        List<CertificationTransactionProcessType> p = this.certificationTransactionProcessTypeRepository
//                .findAll()
//                .stream()
//                .filter(c ->
//                        c.getCertificationTransaction().getSubject().equals(CertificationSubject.SCOPE)
//                                && c.getCertificationTransaction().getConsignee().equals(company)
//                )
//                .collect(Collectors.toList());
//        return certificationTransactionRepository
//                .findAll()
//                .stream()
//                .filter(c ->
//                        c.getSubject().equals(CertificationSubject.SCOPE)
//                        && c.getConsignee().equals(company)
//                        && (
//                                p.stream().anyMatch(x -> x.getCertificationTransaction().equals(c) && processNames.contains(x.getProcessType().getName()))
//                                || p.stream().noneMatch(x -> x.getCertificationTransaction().equals(c))
//                        )
//                )
//                .collect(Collectors.toList());
//
////        Set<CertificationTransaction> certificationTransactions = new HashSet<>();
////        List<CertificationTransactionProcessType> certificationTransactionProcessTypes = this.certificationTransactionProcessTypeRepository.findAll();
////        for (CertificationTransactionProcessType certificationTransactionProcessType : certificationTransactionProcessTypes) {
////            if (certificationTransactionProcessType.getCertificationTransaction().getConsignee().equals(company)) {
////                if (processNames.contains(certificationTransactionProcessType.getProcessType().getName())
////                        && certificationTransactionProcessType.getCertificationTransaction().getSubject().equals(CertificationSubject.SCOPE)
////                ) {
////                    certificationTransactions.add(certificationTransactionProcessType.getCertificationTransaction());
////                }
////            }
////        }
////        return new ArrayList<>(certificationTransactions);
//    }

    public List<CertificationTransaction> getCertificationsByConsigneeCompanyName(String companyName){
        return certificationTransactionRepository.findAllByConsigneeCompanyName(companyName);
    }

    public List<CertificationTransaction> getCertificationsByContractorCompanyName(String companyName){
        return certificationTransactionRepository.findAllByContractorCompanyName(companyName);
    }

    public CertificationTransactionProcessType saveCertificationTransactionProcessType(CertificationTransactionProcessType certificationTransactionProcessType) {
        return certificationTransactionProcessTypeRepository.save(certificationTransactionProcessType);
    }

    public CertificationTransactionProductCategory saveCertificationTransactionProductCategory(CertificationTransactionProductCategory certificationTransactionProductCategory) {
        return certificationTransactionProductCategoryRepository.save(certificationTransactionProductCategory);
    }

    public List<CertificationTransaction> getCompanyCertificationsByTransformationPlan(TransformationPlan transformationPlan) {
        Company company = transformationPlan.getCompany();
        List<String> processTypeNames = transformationPlanService.getProcessTypeNameByTransformationPlan(transformationPlan);
        List<CertificationTransactionProcessType> p = this.certificationTransactionProcessTypeRepository
                .findAll()
                .stream()
                .filter(c ->
                        c.getCertificationTransaction().getSubject().equals(CertificationSubject.SCOPE)
                                && c.getCertificationTransaction().getConsignee().equals(company)
                )
                .collect(Collectors.toList());
        return certificationTransactionRepository
                .findAll()
                .stream()
                .filter(c ->
                        c.getSubject().equals(CertificationSubject.SCOPE)
                                && c.getConsignee().equals(company)
                                && (
                                p.stream().anyMatch(x -> x.getCertificationTransaction().equals(c) && processTypeNames.contains(x.getProcessType().getName()))
                                        || p.stream().noneMatch(x -> x.getCertificationTransaction().equals(c))
                                )
                )
                .collect(Collectors.toList());
    }

    public List<CertificationTransaction> getMaterialCertificationsByTransformationPlan(TransformationPlan transformationPlan) {
        Company company = transformationPlan.getCompany();
        Set<Material> materials = this.transformationPlanService.findAllPositionByTransformationPlanId(transformationPlan.getId())
                .stream()
                .map(Position::getConsigneeMaterial)
                .collect(Collectors.toSet());
        return certificationTransactionRepository
                .findAll()
                .stream()
                .filter(c ->
                        c.getSubject().equals(CertificationSubject.MATERIAL)
                                && c.getConsignee().equals(company)
                                && materials.contains(c.getMaterial())
                )
                .collect(Collectors.toList());
    }
    public List<CertificationTransaction> getSelfCertificationsByTransformationPlan(TransformationPlan transformationPlan) {
        Company company = transformationPlan.getCompany();
        Set<Material> materials = this.transformationPlanService.findAllPositionByTransformationPlanId(transformationPlan.getId())
                .stream()
                .map(Position::getConsigneeMaterial)
                .collect(Collectors.toSet());
        return certificationTransactionRepository
                .findAll()
                .stream()
                .filter(c ->
                        c.getSubject().equals(CertificationSubject.SELF)
                                && c.getConsignee().equals(company)
                                && materials.contains(c.getMaterial())
                )
                .collect(Collectors.toList());
    }

    public List<CertificationTransaction> getCertificationsByTransformationPlanId(Long id) {
        TransformationPlan transformationPlan = this.transformationPlanService.findById(id);

        List<CertificationTransaction> certificationTransactions = new ArrayList<>();
        //Company
        certificationTransactions.addAll(getCompanyCertificationsByTransformationPlan(transformationPlan));
        //Material
        certificationTransactions.addAll(getMaterialCertificationsByTransformationPlan(transformationPlan));
        //Self
        certificationTransactions.addAll(getSelfCertificationsByTransformationPlan(transformationPlan));

        return certificationTransactions;
    }

    public List<CertificationTransaction> getCertificationsByTransactionId(String transactionType, Long id) throws UneceException {
        Set<CertificationTransaction> certificationTransactions = new HashSet<>();
        switch (transactionType){
            case "contract":
                ContractTrade contractTrade = this.tradeService.getContractFromID(id);
                if(contractTrade.getCertificationTransaction() != null)
                    certificationTransactions.add(contractTrade.getCertificationTransaction());
                break;
            case "order":
                OrderTrade orderTrade = this.tradeService.getOrderFromID(id);
                if(orderTrade.getCertificationTransaction() != null)
                    certificationTransactions.add(orderTrade.getCertificationTransaction());
                break;
            case "shipping":
                ShippingTrade shippingTrade = this.tradeService.getShippingFromID(id);
                if(shippingTrade.getCertificationTransaction() != null)
                    certificationTransactions.add(shippingTrade.getCertificationTransaction());
                break;
            case "transformation":
                certificationTransactions.addAll(this.getCertificationsByTransformationPlanId(id));
                break;
            default:
                throw new UneceException(UneceError.INVALID_VALUE, "Wrong transaction type!");
        }
        return new ArrayList<>(certificationTransactions);
    }

}
