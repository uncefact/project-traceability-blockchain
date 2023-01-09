package ch.supsi.core.controller;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.*;
import ch.supsi.model.ProcessType;
import ch.supsi.model.company.Company;
import ch.supsi.model.company.CompanyKnowsCompany;
import ch.supsi.model.login.Login;
import ch.supsi.model.processing_standard.*;
import ch.supsi.model.transaction.certification.*;
import ch.supsi.model.transaction.certification.assessment_type.AssessmentType;
import ch.supsi.model.transaction.certification.assessment_type.SelfCertificationAssessmentType;
import ch.supsi.model.transaction.certification.assessment_type.ThirdPartyAssessmentType;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.repository.*;
import ch.supsi.repository.company.CompanyKnowsCompanyRepository;
import ch.supsi.repository.company.CompanyRepository;
import ch.supsi.repository.processing_standard.*;
import ch.supsi.repository.transaction.certificate.*;
import ch.supsi.repository.transaction.certificate.assessment_type.AssessmentTypeRepository;
import ch.supsi.repository.transaction.certificate.assessment_type.SelfCertificationAssessmentTypeRepository;
import ch.supsi.repository.transaction.certificate.assessment_type.ThirdPartyAssessmentTypeRepository;
import ch.supsi.repository.transaction.trade.ContractTradeRepository;
import ch.supsi.repository.transaction.trade.OrderTradeRepository;
import ch.supsi.repository.transaction.trade.ShippingTradeRepository;
import ch.supsi.request.DocumentRequest;
import ch.supsi.request.transaction.certification.CertificationRequest;
import ch.supsi.service.MailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.util.NestedServletException;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class CertificationControllerTest extends UneceControllerTestTemplate {

    @Value("${unece.documents-storage-path}")
    private String documentsPath;

    @MockBean
    private MailService mailService;

    @Autowired
    private AssessmentTypeRepository assessmentTypeRepository;
    @Autowired
    private CertificationTransactionRepository certificationTransactionRepository;
    @Autowired
    private ReferencedStandardRepository referencedStandardRepository;
    @Autowired
    private ProductCategoryRepository productCategoryRepository;
    @Autowired
    private ProcessTypeRepository processTypeRepository;
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private CertificationTransactionProcessTypeRepository certificationTransactionProcessTypeRepository;
    @Autowired
    private CertificationTransactionProductCategoryRepository certificationTransactionProductCategoryRepository;
    @Autowired
    private SelfCertificationProprietaryStandardRepository selfCertificationProprietaryStandardRepository;
    @Autowired
    private ThirdPartyAssessmentTypeRepository thirdPartyAssessmentTypeRepository;
    @Autowired
    private SelfCertificationAssessmentTypeRepository selfCertificationAssessmentTypeRepository;
    @Autowired
    private MaterialCertificationReferencedStandardRepository materialCertificationReferencedStandardRepository;
    @Autowired
    private TransactionCertificationReferencedStandardRepository transactionCertificationReferencedStandardRepository;
    @Autowired
    private ContractTradeRepository contractTradeRepository;
    @Autowired
    private OrderTradeRepository orderTradeRepository;
    @Autowired
    private ShippingTradeRepository shippingTradeRepository;
    @Autowired
    private TransformationPlanRepository transformationPlanRepository;
    @Autowired
    private ProcessingStandardCompanyIndustryRepository processingStandardCompanyIndustryRepository;
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private CompanyKnowsCompanyRepository companyKnowsCompanyRepository;
    @Autowired
    private CustodialWalletCredentialsRepository custodialWalletCredentialsRepository;
    @Autowired
    private TokenRepository tokenRepository;

    private final String PATH = "/certifications";

    private Login user1Login;
    private Login user2Login;
    private List<DocumentRequest> documentRequests = null;
    private List<ThirdPartyAssessmentType> thirdPartyAssessmentTypes;
    private List<SelfCertificationAssessmentType> selfCertificationAssessmentTypes;
    private List<ReferencedStandard> referencedStandards;
    private List<SelfCertificationProprietaryStandard> selfCertificationProprietaryStandards;
    private List<MaterialCertificationReferencedStandard> materialCertificationReferencedStandards;
    private List<TransactionCertificationReferencedStandard> transactionCertificationReferencedStandards;
    private List<ProductCategory> productCategories;
    private List<ProcessType> processTypes;
    private List<Company> companies;
    private List<CertificationTransaction> certificationTransactions = new ArrayList<>();
    private Document document;

    private DocumentType documentType;
    private AssessmentType assessmentType;
    private ProductCategory productCategory;
    private List<Material> outputMaterials;
    private ProcessType processType;

    private Company certifierCompany;
    private Login certifierUser;

    private ContractTrade contractTrade;
    private OrderTrade orderTrade;
    private ShippingTrade shippingTrade;
    private TransformationPlan transformationPlan;
    private CertificationTransaction companyCertification;
    private CertificationTransaction shippingCertificationTransaction;

    @Before
    public void init() {
        user1Login = loginRepository.findLoginByUsernameAndExpiredIsNull("user");
        user2Login = loginRepository.findLoginByUsernameAndExpiredIsNull("albini");

        certifierCompany = companyRepository.findByCompanyCode("12");
        certifierUser = loginRepository.findLoginByUsernameAndExpiredIsNull("cert");

        companies = companyRepository.findAll();

        documentType=new DocumentType("DCT", "DocumentTypeNameTest");
        documentTypeRepository.save(documentType);
        assessmentType=new AssessmentType("AssessmentTypeNameTest");
        assessmentTypeRepository.save(assessmentType);
        productCategory=new ProductCategory("PCT", "ProductCategoryNameTest");
        productCategoryRepository.save(productCategory);
        processType=new ProcessType("PTT", "ProcessTypeNameTest", null);
        processTypeRepository.save(processType);

        thirdPartyAssessmentTypes = thirdPartyAssessmentTypeRepository.findAll();
        selfCertificationAssessmentTypes = selfCertificationAssessmentTypeRepository.findAll();
        referencedStandards = referencedStandardRepository.findAll();
        selfCertificationProprietaryStandards = selfCertificationProprietaryStandardRepository.findAll();
        materialCertificationReferencedStandards = materialCertificationReferencedStandardRepository.findAll();
        transactionCertificationReferencedStandards = transactionCertificationReferencedStandardRepository.findAll();
        productCategories = productCategoryRepository.findAll();
        outputMaterials = Collections.singletonList(materialRepository.save(new Material("materialTest1", user1Login.getUser().getCompany(), false)));
        processTypes = processTypeRepository.findAll();

        try {
            documentRequests = Utils.loadDocumentRequestsFromFiles(documentsPath);
        } catch (IOException e) {
            e.printStackTrace();
        }

        document = documentRepository.save(new Document(documentRequests.get(0).getName(), documentRequests.get(0).getContentType(), java.util.Base64.getDecoder().decode(documentRequests.get(0).getContent())));

        CertificationTransaction certificationTransaction = new CertificationTransaction("12345", companies.get(0), companies.get(7), null, assessmentType, document, CertificationSubject.TRANSACTION);
        CertificationTransaction certificationTransaction1 = new CertificationTransaction("1234567", companies.get(2), companies.get(3), null, assessmentType, document, CertificationSubject.TRANSACTION);
        shippingCertificationTransaction = certificationTransactionRepository.save(certificationTransaction1);

        this.certificationTransactions.add(certificationTransactionRepository.save(certificationTransaction));
        this.certificationTransactions.add(shippingCertificationTransaction);

        ContractTrade c1 = new ContractTrade();
        c1.setCertificationTransaction(certificationTransaction);
        contractTrade = contractTradeRepository.save(c1);

        OrderTrade o1 = new OrderTrade();
        o1.setCertificationTransaction(certificationTransaction);
        orderTrade = orderTradeRepository.save(o1);

        ShippingTrade s1 = new ShippingTrade();
        s1.setCertificationTransaction(shippingCertificationTransaction);
        s1.setConsignee(user1Login.getUser().getCompany());
        shippingTrade = shippingTradeRepository.save(s1);


        this.companyCertification = new CertificationTransaction("12345", companies.get(0), companies.get(7), null, assessmentType, document, CertificationSubject.SCOPE);
        this.companyCertification = this.certificationTransactionRepository.save(this.companyCertification);
        this.certificationTransactions.add(this.companyCertification);
        TransformationPlan tp = new TransformationPlan();
        tp.setCompany(companies.get(0));
        transformationPlan = transformationPlanRepository.save(tp);

        // add max 2 different kind of processing standard to processing_standard_company_industry rows, using the user logged company industry sector
        List<ProcessingStandardCompanyIndustry> processingStandardCompanyIndustries = Arrays.asList(
                new ProcessingStandardCompanyIndustry(referencedStandards.get(0), user1Login.getUser().getCompany().getCompanyIndustry()),
                new ProcessingStandardCompanyIndustry(referencedStandards.get(1), user1Login.getUser().getCompany().getCompanyIndustry()),
                new ProcessingStandardCompanyIndustry(materialCertificationReferencedStandards.get(0), user1Login.getUser().getCompany().getCompanyIndustry()),
                new ProcessingStandardCompanyIndustry(transactionCertificationReferencedStandards.get(0), user1Login.getUser().getCompany().getCompanyIndustry()),
                new ProcessingStandardCompanyIndustry(selfCertificationProprietaryStandards.get(0), user1Login.getUser().getCompany().getCompanyIndustry()),
                new ProcessingStandardCompanyIndustry(selfCertificationProprietaryStandards.get(1), user1Login.getUser().getCompany().getCompanyIndustry())
        );
        processingStandardCompanyIndustryRepository.saveAll(processingStandardCompanyIndustries);

        doNothing().when(mailService).sendMail(isA(String[].class), isA(String.class), isA(String.class));
    }

    @Test
    public void getCertificationsByContractIdTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/contract/"+contractTrade.getId(), true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.[0].id", is(certificationTransactions.get(0).getId().intValue())));
    }
    @Test
    public void getCertificationsByOrderIdTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/order/"+orderTrade.getId(), true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.[0].id", is(certificationTransactions.get(0).getId().intValue())));
    }

    @Test
    public void getCertificationsByShippingIdTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/shipping/"+shippingTrade.getId(), true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.[0].id", is(shippingCertificationTransaction.getId().intValue())));
    }

    @Test
    public void getCertificationsByTransformationIdTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/transformation/"+transformationPlan.getId(), true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.[0].id", is(this.companyCertification.getId().intValue())));
    }

    @Test
    public void getMyCertificationsTest() throws Exception {
        List<CertificationTransaction> certifications = certificationTransactions.stream()
                .filter(c -> c.getContractor().getCompanyName().equals(user1Login.getUser().getCompany().getCompanyName())
                || c.getConsignee().getCompanyName().equals(user1Login.getUser().getCompany().getCompanyName()))
                .collect(Collectors.toList());

        this.mock().perform(get(user1Login.getUsername(), PATH, true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", hasSize(certifications.size())))
                .andExpect(jsonPath("$.[*].id", hasItems(certifications.stream().map(c -> c.getId().intValue()).toArray())));
    }

    @Test
    public void getThirdAssessmentTypesTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/assessments/types", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(thirdPartyAssessmentTypes.size())))
                .andExpect(jsonPath("$.[*].name", is(thirdPartyAssessmentTypes.stream().map(ThirdPartyAssessmentType::getName).collect(Collectors.toList()))));
    }

    @Test
    public void getSelfCertificationAssessmentTypesTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/assessments/types", true).param("type", CertificationSubject.SELF.name().toLowerCase()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(selfCertificationAssessmentTypes.size())))
                .andExpect(jsonPath("$.[*].name", is(selfCertificationAssessmentTypes.stream().map(SelfCertificationAssessmentType::getName).collect(Collectors.toList()))));
    }

    @Test
    public void getReferencedStandardsTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/processingStandards", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(4)))
                // there is also GOTS because it overlaps with the transaction referenced standard (GOTS)
                .andExpect(jsonPath("$.[*].name", is(referencedStandards.stream().limit(4).map(ReferencedStandard::getName).collect(Collectors.toList()))));
    }

    @Test
    public void getSelfCertificationProprietaryStandardsTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/processingStandards", true).param("type", CertificationSubject.SELF.name().toLowerCase()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$.[*].name", is(selfCertificationProprietaryStandards
                        .stream().filter(ps -> ps.getSustainabilityCriterion().getCompanyIndustries().contains(user1Login.getUser().getCompany().getCompanyIndustry()))
                        .map(SelfCertificationProprietaryStandard::getName).sorted().collect(Collectors.toList()))));
    }

    @Test
    public void getMaterialCertificationReferencedStandardsTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/processingStandards", true).param("type", CertificationSubject.MATERIAL.name().toLowerCase()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$.[*].name", is(materialCertificationReferencedStandards.stream().map(MaterialCertificationReferencedStandard::getName).collect(Collectors.toList()))));
    }

    @Test
    public void getTransactionCertificationReferencedStandardsTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/processingStandards", true).param("type", CertificationSubject.TRANSACTION.name().toLowerCase()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$.[*].name", is(transactionCertificationReferencedStandards.stream().map(TransactionCertificationReferencedStandard::getName).collect(Collectors.toList()))));
    }

    @Test
    public void getAllProductCategoriesTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/productCategories", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(productCategories.size())))
                .andExpect(jsonPath("$.[*].name", is(productCategories.stream().map(ProductCategory::getName).collect(Collectors.toList()))));
    }

    @Test
    public void createThirdPartyCertification() throws Exception {
        CertificationRequest certificationRequest = new CertificationRequest(
                certifierCompany.getCompanyName(),
                certifierUser.getUser().getEmail(),
                null,
                null,
                documentType.getCode(),
                documentRequests.get(2),
                referencedStandards.get(0).getName(),
                assessmentType.getName(),
                Collections.singletonList(productCategory.getCode()),
                outputMaterials.stream().map(MaterialPresentable::new).collect(Collectors.toList()),
                Collections.singletonList(new ProcessType(processType.getCode(), processType.getName(), null)),
                null,
                new Date(),
                new Date(),
                "certificateReferenceNumberTest",
                "notesTest",
                null,
                CertificationSubject.SCOPE,
                null,
                false
            );

        this.mock().perform(post(user1Login.getUsername(), PATH, true, new ObjectMapper().writeValueAsString(certificationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(certifierCompany.getCompanyName())))
                .andExpect(jsonPath("$.contractorEmail", is(certifierUser.getUser().getEmail())))
                .andExpect(jsonPath("$.consigneeName", is(user1Login.getUser().getCompany().getCompanyName())))
                .andExpect(jsonPath("$.consigneeEmail", is(user1Login.getUser().getEmail())))
        ;

        CertificationTransaction certificationTransaction = certificationTransactionRepository.findAll().get(certificationTransactions.size());
        assertEquals(certifierCompany.getCompanyName(), certificationTransaction.getContractor().getCompanyName());

        CertificationTransactionProcessType certificationTransactionProcessType = certificationTransactionProcessTypeRepository.findAll().get(0);
        assertEquals(certificationTransaction, certificationTransactionProcessType.getCertificationTransaction());
        assertEquals(processType.getCode(), certificationTransactionProcessType.getProcessType().getCode());

        CertificationTransactionProductCategory certificationTransactionProductCategory = certificationTransactionProductCategoryRepository.findAll().get(0);
        assertEquals(certificationTransaction, certificationTransactionProductCategory.getCertificationTransaction());
        assertEquals(productCategory.getCode(), certificationTransactionProductCategory.getProductCategory().getCode());

        // a certification_transaction_material entry has been created if certification is SCOPE
        assertEquals(new HashSet<>(outputMaterials), certificationTransaction.getOutputMaterials());
    }

    @Test
    public void createSelfVerifiedBySecondPartyCertification() throws Exception {
        CertificationRequest certificationRequest = new CertificationRequest(
                user1Login.getUser().getCompany().getCompanyName(),
                user1Login.getUser().getEmail(),
                user2Login.getUser().getCompany().getCompanyName(),
                user2Login.getUser().getEmail(),
                documentType.getCode(),
                documentRequests.get(2),
                referencedStandards.get(0).getName(),
                assessmentType.getName(),
                null,
                null,
                null,
                null,
                new Date(),
                new Date(),
                "certificateReferenceNumberTest",
                "notesTest",
                null,
                CertificationSubject.SELF,
                null,
                false
        );

        this.mock().perform(post(user1Login.getUsername(), PATH, true, new ObjectMapper().writeValueAsString(certificationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(user2Login.getUser().getCompany().getCompanyName())))
                .andExpect(jsonPath("$.contractorEmail", is(user2Login.getUser().getEmail())))
                .andExpect(jsonPath("$.consigneeName", is(user1Login.getUser().getCompany().getCompanyName())))
                .andExpect(jsonPath("$.consigneeEmail", is(user1Login.getUser().getEmail())))
        ;

        CertificationTransaction certificationTransaction = certificationTransactionRepository.findAll().get(certificationTransactions.size());
        assertEquals(user2Login.getUser().getCompany().getCompanyName(), certificationTransaction.getContractor().getCompanyName());
    }

    @Test
    public void createSelfCertification() throws Exception {
        CertificationRequest certificationRequest = new CertificationRequest(
                null,
                null,
                user2Login.getUser().getCompany().getCompanyName(),
                user2Login.getUser().getEmail(),
                documentType.getCode(),
                documentRequests.get(2),
                referencedStandards.get(0).getName(),
                assessmentType.getName(),
                null,
                null,
                null,
                null,
                new Date(),
                new Date(),
                "certificateReferenceNumberTest",
                "notesTest",
                null,
                CertificationSubject.SELF,
                null,
                false
        );

        this.mock().perform(post(user1Login.getUsername(), PATH, true, new ObjectMapper().writeValueAsString(certificationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(user2Login.getUser().getCompany().getCompanyName())))
                .andExpect(jsonPath("$.contractorEmail", is(user2Login.getUser().getEmail())))
                .andExpect(jsonPath("$.consigneeName", is(user1Login.getUser().getCompany().getCompanyName())))
                .andExpect(jsonPath("$.consigneeEmail", is(user1Login.getUser().getEmail())))
        ;

        CertificationTransaction certificationTransaction = certificationTransactionRepository.findAll().get(certificationTransactions.size());
        assertEquals(user2Login.getUser().getCompany().getCompanyName(), certificationTransaction.getContractor().getCompanyName());
    }

    @Test
    public void createThirdPartyCertificationAsTraderWithInvitationTest() throws Exception {
        CertificationRequest certificationRequest = new CertificationRequest(
                "companyInvitedName",
                "companyinvited@mail.ch",
                null,
                null,
                documentType.getCode(),
                documentRequests.get(2),
                referencedStandards.get(0).getName(),
                assessmentType.getName(),
                Collections.singletonList(productCategory.getCode()),
                outputMaterials.stream().map(MaterialPresentable::new).collect(Collectors.toList()),
                Collections.singletonList(new ProcessType(processType.getCode(), processType.getName(), null)),
                null,
                new Date(),
                new Date(),
                "certificateReferenceNumberTest",
                "notesTest",
                null,
                CertificationSubject.SCOPE,
                null,
                true
        );

        this.mock().perform(post(user1Login.getUsername(), PATH, true, new ObjectMapper().writeValueAsString(certificationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is("companyInvitedName")))
                .andExpect(jsonPath("$.contractorEmail", is("companyinvited@mail.ch")))
                .andExpect(jsonPath("$.consigneeName", is(user1Login.getUser().getCompany().getCompanyName())))
                .andExpect(jsonPath("$.consigneeEmail", is(user1Login.getUser().getEmail())))
        ;
        // the company has been invited, so a Company is created with the primary key of its new custodial wallet and also a relation from companyA to companyB
        List<CompanyKnowsCompany> companyKnowsCompanies = companyKnowsCompanyRepository.findAllByCompanyBCompanyName("companyInvitedName");
        Company companyAdded = companyRepository.findByCompanyName("companyInvitedName");
        Optional<CustodialWalletCredentials> companyAddedWallet = custodialWalletCredentialsRepository.findById(companyAdded.getCustodialWalletCredentials().getId());
        assertNotNull(companyAdded);
        assertTrue(companyAddedWallet.isPresent());
        assertEquals(companyAddedWallet.get().getPublicKey(), companyAdded.getEthAddress());
        // new company is companyB in companyknowscompany relation
        assertEquals(1, companyKnowsCompanies.size());
        assertEquals(user1Login.getUser().getCompany(), companyKnowsCompanies.get(0).getCompanyA());
        assertEquals(companyAdded, companyKnowsCompanies.get(0).getCompanyB());
        // a token to finish the onboarding process has been created
        Optional<Token> companyAddedToken = tokenRepository.findAll().stream().filter(t -> t.getCompany().equals(companyAdded)).findFirst();
        assertTrue(companyAddedToken.isPresent());
        assertEquals(companyAddedToken.get().getGeneratedBy(), user1Login.getUser().getCompany());
    }

    @Test
    public void createCertificationAsCertifierWithInvitationTest() throws Exception {
        CertificationRequest certificationRequest = new CertificationRequest(
                "traderInvitedName",
                "traderinvited@mail.ch",
                null,
                null,
                documentType.getCode(),
                documentRequests.get(2),
                referencedStandards.get(0).getName(),
                assessmentType.getName(),
                Collections.singletonList(productCategory.getCode()),
                outputMaterials.stream().map(MaterialPresentable::new).collect(Collectors.toList()),
                Collections.singletonList(new ProcessType(processType.getCode(), processType.getName(), null)),
                null,
                new Date(),
                new Date(),
                "certificateReferenceNumberTest",
                "notesTest",
                null,
                CertificationSubject.SCOPE,
                null,
                true
        );

        Login loginCertifier = user1Login;
        loginCertifier.getUser().setCompany(certifierCompany);

        this.mock().perform(post(loginCertifier.getUsername(), PATH, true, new ObjectMapper().writeValueAsString(certificationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(user1Login.getUser().getCompany().getCompanyName())))
                .andExpect(jsonPath("$.contractorEmail", is(user1Login.getUser().getEmail())))
                .andExpect(jsonPath("$.consigneeName", is("traderInvitedName")))
                .andExpect(jsonPath("$.consigneeEmail", is("traderinvited@mail.ch")))
        ;
        // the company has been invited, so a Company is created with the primary key of its new custodial wallet and also a relation from companyA to companyB and vice versa
        List<CompanyKnowsCompany> companyKnowsCompaniesB = companyKnowsCompanyRepository.findAllByCompanyBCompanyName("traderInvitedName");
        List<CompanyKnowsCompany> companyKnowsCompaniesA = companyKnowsCompanyRepository.findAllByCompanyACompanyName("traderInvitedName");
        Company companyAdded = companyRepository.findByCompanyName("traderInvitedName");
        Optional<CustodialWalletCredentials> companyAddedWallet = custodialWalletCredentialsRepository.findById(companyAdded.getCustodialWalletCredentials().getId());
        assertNotNull(companyAdded);
        assertTrue(companyAddedWallet.isPresent());
        assertEquals(companyAddedWallet.get().getPublicKey(), companyAdded.getEthAddress());
        // new company is companyB in companyknowscompany relation
        assertEquals(1, companyKnowsCompaniesB.size());
        assertEquals(user1Login.getUser().getCompany(), companyKnowsCompaniesB.get(0).getCompanyA());
        assertEquals(companyAdded, companyKnowsCompaniesB.get(0).getCompanyB());
        // new company is companyA in companyknowscompany relation
        assertEquals(1, companyKnowsCompaniesA.size());
        assertEquals(user1Login.getUser().getCompany(), companyKnowsCompaniesA.get(0).getCompanyB());
        assertEquals(companyAdded, companyKnowsCompaniesA.get(0).getCompanyA());
        // a token to finish the onboarding process has been created
        Optional<Token> companyAddedToken = tokenRepository.findAll().stream().filter(t -> t.getCompany().equals(companyAdded)).findFirst();
        assertTrue(companyAddedToken.isPresent());
        assertEquals(companyAddedToken.get().getGeneratedBy(), user1Login.getUser().getCompany());

    }

    @Test
    public void getCertificationTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/" + certificationTransactions.get(0).getId(), true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.assessmentType", is(certificationTransactions.get(0).getAssessmentType().getName())))
                .andExpect(jsonPath("$.document.content", is(Base64.getEncoder().encodeToString(document.getContent()))));
    }

    @Test(expected = NestedServletException.class)
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void getCertificationNotFoundTest() throws Exception {
        this.mock().perform(get(user1Login.getUsername(), PATH + "/10", true))
                .andExpect(status().isNotFound())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.TRANSACTION_NOT_FOUND.getMessage(), result.getResolvedException().getMessage()));
    }

    @Test(expected = AssertionError.class)
    public void getCertificationForbiddenTest() throws Exception {
        this.mock().perform(get(user2Login.getUsername(), PATH + "/" + certificationTransactions.get(0), true))
                .andExpect(status().isForbidden())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.FORBIDDEN.getMessage(), result.getResolvedException().getMessage()));
    }

}
