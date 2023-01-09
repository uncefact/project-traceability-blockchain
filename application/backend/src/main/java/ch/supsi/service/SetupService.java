package ch.supsi.service;

import ch.supsi.model.ProcessType;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.company.CompanyIndustry;
import ch.supsi.model.company.CompanyKnowsCompany;
import ch.supsi.model.login.Login;
import ch.supsi.model.processing_standard.*;
import ch.supsi.model.SustainabilityCriterion;
import ch.supsi.model.Role;
import ch.supsi.model.transaction.certification.*;
import ch.supsi.model.transaction.certification.assessment_type.AssessmentType;
import ch.supsi.model.transaction.certification.assessment_type.SelfCertificationAssessmentType;
import ch.supsi.model.transaction.certification.assessment_type.ThirdPartyAssessmentType;
import ch.supsi.model.transaction.trade.ContractDocumentType;
import ch.supsi.model.transaction.trade.OrderDocumentType;
import ch.supsi.model.transaction.trade.ShippingDocumentType;
import ch.supsi.repository.*;
import ch.supsi.repository.company.CompanyIndustryRepository;
import ch.supsi.repository.company.CompanyKnowsCompanyRepository;
import ch.supsi.repository.company.CompanyRepository;
import ch.supsi.repository.processing_standard.*;
import ch.supsi.repository.RoleRepository;
import ch.supsi.repository.transaction.certificate.*;
import ch.supsi.repository.transaction.certificate.assessment_type.AssessmentTypeRepository;
import ch.supsi.repository.transaction.certificate.assessment_type.SelfCertificationAssessmentTypeRepository;
import ch.supsi.repository.transaction.certificate.assessment_type.ThirdPartyAssessmentTypeRepository;
import ch.supsi.repository.transaction.trade.ContractDocumentTypeRepository;
import ch.supsi.repository.transaction.trade.OrderDocumentTypeRepository;
import ch.supsi.repository.transaction.trade.ShippingDocumentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;

@Profile({"local", "docker", "local-venv"})
@Service
public class SetupService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private ContractDocumentTypeRepository contractDocumentTypeRepository;
    @Autowired
    private OrderDocumentTypeRepository orderDocumentTypeRepository;
    @Autowired
    private ShippingDocumentTypeRepository shippingDocumentTypeRepository;
    @Autowired
    private ScopeCertificationDocumentTypeRepository scopeCertificationDocumentTypeRepository;
    @Autowired
    private TransactionCertificationDocumentTypeRepository transactionCertificationDocumentTypeRepository;
    @Autowired
    private MaterialCertificationDocumentTypeRepository materialCertificationDocumentTypeRepository;
    @Autowired
    private SustainabilityCriterionRepository sustainabilityCriterionRepository;
    @Autowired
    private UnitRepository unitRepository;
    @Autowired
    private AssessmentTypeRepository assessmentTypeRepository;
    @Autowired
    private ProcessingStandardRepository processingStandardRepository;
    @Autowired
    private CompanyKnowsCompanyRepository companyKnowsCompanyRepository;
    @Autowired
    private ProductCategoryRepository productCategoryRepository;
    @Autowired
    private CountryRepository countryRepository;
    @Autowired
    private ProcessTypeRepository processTypeRepository;
    @Autowired
    private TraceabilityLevelRepository traceabilityLevelRepository;
    @Autowired
    private TransparencyLevelRepository transparencyLevelRepository;
    @Autowired
    private SelfCertificationDocumentTypeRepository selfCertificationDocumentTypeRepository;
    @Autowired
    private SelfCertificationAssessmentTypeRepository selfCertificationAssessmentTypeRepository;
    @Autowired
    private SelfCertificationProprietaryStandardRepository selfCertificationProprietaryStandardRepository;
    @Autowired
    private ReferencedStandardRepository referencedStandardRepository;
    @Autowired
    private ThirdPartyAssessmentTypeRepository thirdPartyAssessmentTypeRepository;
    @Autowired
    private MaterialCertificationReferencedStandardRepository materialCertificationReferencedStandardRepository;
    @Autowired
    private TransactionCertificationReferencedStandardRepository transactionCertificationReferencedStandardRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private CompanyIndustryRepository companyIndustryRepository;
    @Autowired
    private ProcessingStandardCompanyIndustryRepository processingStandardCompanyIndustryRepository;

    private List<CompanyIndustry> companyIndustriesSaved;
    private List<Company> companiesSaved;
    private List<ProcessingStandard> allProcessingStandardsSaved;
    private List<SustainabilityCriterion> sustainabilityCriteriaSaved;
    private List<DocumentType> documentTypes;

    @PostConstruct
    public void init() {
        if (userRepository.count() != 0)
            return;

        allProcessingStandardsSaved = new ArrayList<>();
        sustainabilityCriteriaSaved = new ArrayList<>();
        companyIndustriesSaved = new ArrayList<>();
        companiesSaved = new ArrayList<>();
        documentTypes = new ArrayList<>();
        this.loadCompanyIndustries();
        this.loadRoles();
        this.loadCountries();
        this.loadSustainabilityCriteria();
        this.loadCompanies();
        this.loadCompanyKnowsCompanies();
        this.loadUsers();
        this.loadLogins();
        this.loadDocumentTypes();
        this.loadContractDocumentTypes();
        this.loadOrderDocumentTypes();
        this.loadShippingDocumentTypes();
        this.loadScopeCertificationDocumentTypes();
        this.loadTransactionCertificationDocumentTypes();
        this.loadMaterialCertificationDocumentTypes();
        this.loadSelfCertificationAssessmentTypes();
        this.loadSelfCertificationDocumentTypes();
        this.loadSelfCertificationProprietaryStandards();
        this.loadMaterials();
        this.loadUnits();
        this.loadAllAssessmentTypes();
        this.loadThirdPartyAssessmentTypes();
        this.loadAllProcessingStandards();
        this.loadAllProcessingStandardCompanyIndustries();
        this.loadReferencedStandards();
        this.loadMaterialReferencedStandards();
        this.loadTransactionReferencedStandards();
        this.loadProductCategories();
        this.loadProcessTypes();
        this.loadTraceabilityLevel();
        this.loadTransparencyLevel();
    }

    private void loadCompanyIndustries(){
        CompanyIndustry cotton = new CompanyIndustry("cotton");
        CompanyIndustry leather = new CompanyIndustry("leather");
        companyIndustriesSaved.add(companyIndustryRepository.save(cotton));
        companyIndustriesSaved.add(companyIndustryRepository.save(leather));
    }

    private void loadRoles(){
        List<Role> roles = Arrays.asList(
                new Role("ginner", new HashSet<>(Arrays.asList(companyIndustriesSaved.get(0), companyIndustriesSaved.get(1)))),
                new Role("spinner", new HashSet<>(Arrays.asList(companyIndustriesSaved.get(0), companyIndustriesSaved.get(1)))),
                new Role("certifier", new HashSet<>(Collections.singletonList(companyIndustriesSaved.get(0))))
        );
        roleRepository.saveAll(roles);
    }

    private void loadCompanies() {
        Role roleGinner = roleRepository.getOne("ginner");
        Company egyyarnCompany = new Company("0x1111", "Egyyarn", "9", companyIndustriesSaved.get(0));
        egyyarnCompany.setCountry(countryRepository.findById("CH").get());
        egyyarnCompany.setPartnerType(roleRepository.getOne("ginner"));
        Company albiniCompany = new Company("0x2222","Albini Group", "10", companyIndustriesSaved.get(0));
        albiniCompany.setCountry(countryRepository.findById("CH").get());
        albiniCompany.setPartnerType(roleRepository.getOne("ginner"));
        Company vivienneCompany = new Company("0x3333","VIVIENNE WESTWOOD SRL", "11", companyIndustriesSaved.get(0));
        vivienneCompany.setCountry(countryRepository.findById("CH").get());
        vivienneCompany.setPartnerType(roleRepository.getOne("spinner"));
        Company certifier = new Company("0x4444", "Certifier SRL", "12", null);
        certifier.setPartnerType(roleRepository.getOne("certifier"));
        certifier.setCountry(countryRepository.findById("CH").get());


        List<Company> companies = Arrays.asList(
                new Company("0x5555","Cotton GIZA 45", "1", companyIndustriesSaved.get(0)),
                new Company("0x6666","Cotton GIZA 86", "2", companyIndustriesSaved.get(0)),
                new Company("0x7777","Cotton GIZA 96", "3", companyIndustriesSaved.get(0)),
                new Company("0x8888","Al Amir Company", "4", companyIndustriesSaved.get(0)),
                new Company("0x9999","EGYPT GINNING CO.", "5", companyIndustriesSaved.get(0)),
                new Company("0x1000","DELTA DYEING S.A.E.", "6", companyIndustriesSaved.get(0)),
                new Company("0x1001","weba Weberei Appenzell AG", "7", companyIndustriesSaved.get(0)),
                egyyarnCompany,
                albiniCompany,
                vivienneCompany,
                certifier,
                new Company("0x1002","Leather Company SRL", "13", companyIndustriesSaved.get(1))
                );
        companies.forEach(company -> companiesSaved.add(companyRepository.save(company)));

    }

    private void loadCompanyKnowsCompanies(){
        List<CompanyKnowsCompany> relationships = Arrays.asList(
                new CompanyKnowsCompany(companiesSaved.get(7), companiesSaved.get(8)),
                new CompanyKnowsCompany(companiesSaved.get(7), companiesSaved.get(9)),
                new CompanyKnowsCompany(companiesSaved.get(8), companiesSaved.get(9)),
                new CompanyKnowsCompany(companiesSaved.get(7), companiesSaved.get(10)),
                new CompanyKnowsCompany(companiesSaved.get(8), companiesSaved.get(10))
        );
        companyKnowsCompanyRepository.saveAll(relationships);
    }

    private void loadUsers() {
        List<User> users = Arrays.asList(
                new User("user1@mail.ch", "Mario", "Rossi", null, null, null, null, null, null, null, null, null, null, null, null, null, companyRepository.findByCompanyCode("9")),
                new User("albini@mail.ch", "Mario", "Bianchi", null, null, null, null, null, null, null, null, null, null, null, null, null, companyRepository.findByCompanyCode("10")),
                new User("viviennewestwood@mail.ch", "Mario", "Verdi", null, null, null, null, null, null, null, null, null, null, null, null, null, companyRepository.findByCompanyCode("11")),
                new User("certifier@mail.ch", "Giovanni", "Verdi", null, null, null, null, null, null, null, null, null, null, null, null, null, companyRepository.findByCompanyCode("12")),
                new User("francesco@mail.ch", "Francesco", "Neri", null, null, null, null, null, null, null, null, null, null, null, null, null, companyRepository.findByCompanyCode("13"))
        );
        userRepository.saveAll(users);
    }

    private void loadLogins() {
        Login user1 = new Login("user", new BCryptPasswordEncoder().encode("user"), 0L, userRepository.findByEmail("user1@mail.ch"));
        Login user2 = new Login("albini", new BCryptPasswordEncoder().encode("albini"), 0L, userRepository.findByEmail("albini@mail.ch"));
        Login user3 = new Login("vivienne", new BCryptPasswordEncoder().encode("vivienne"), 0L, userRepository.findByEmail("viviennewestwood@mail.ch"));
        Login user4 = new Login("cert", new BCryptPasswordEncoder().encode("cert"), 0L, userRepository.findByEmail("certifier@mail.ch"));
        Login user5 = new Login("francesco", new BCryptPasswordEncoder().encode("fra"), 0L, userRepository.findByEmail("francesco@mail.ch"));
        loginRepository.save(user1);
        loginRepository.save(user2);
        loginRepository.save(user3);
        loginRepository.save(user4);
        loginRepository.save(user5);
    }

    private void loadDocumentTypes() {
        List<DocumentType> documentTypesToSave = Arrays.asList(
                new DocumentType("2", "Certificate of conformity"),
                new DocumentType("12", "Mill Quality"),
                new DocumentType("105", "Order"),
                new DocumentType("152", "Contract"),
                new DocumentType("153", "Contract with volumes"),
                new DocumentType("220", "Order with PO Position"),
                new DocumentType("270", "Delivery note"),
                new DocumentType("416", "Soil analysis"),
                new DocumentType("538", "Good Manufacturing Practice (GMP)"),
                new DocumentType("626", "CITES"),
                new DocumentType("632", "Goods receipt"),
                new DocumentType("753", "Compliance"),
                new DocumentType("861", "Country of Origin"),
                new DocumentType("818", "Assessment report")
        );
        documentTypes.addAll(documentTypeRepository.saveAll(documentTypesToSave));
    }

    private void loadContractDocumentTypes() {
        List<ContractDocumentType> contractDocumentTypes = Arrays.asList(
                new ContractDocumentType(documentTypes.get(3).getCode()),
                new ContractDocumentType(documentTypes.get(4).getCode())
        );
        contractDocumentTypeRepository.saveAll(contractDocumentTypes);
    }

    private void loadOrderDocumentTypes() {
        List<OrderDocumentType> orderDocumentTypes = Arrays.asList(
                new OrderDocumentType(documentTypes.get(2).getCode()),
                new OrderDocumentType(documentTypes.get(5).getCode())
        );
        orderDocumentTypeRepository.saveAll(orderDocumentTypes);
    }

    private void loadShippingDocumentTypes() {
        List<ShippingDocumentType> shippingDocumentTypes = Arrays.asList(
                new ShippingDocumentType(documentTypes.get(6).getCode()),
                new ShippingDocumentType(documentTypes.get(12).getCode())
        );
        shippingDocumentTypeRepository.saveAll(shippingDocumentTypes);
    }

    private void loadScopeCertificationDocumentTypes() {
        List<ScopeCertificationDocumentType> scopeCertificationDocumentTypes = Arrays.asList(
                new ScopeCertificationDocumentType(documentTypes.get(0).getCode()),
                new ScopeCertificationDocumentType(documentTypes.get(1).getCode())
        );
        scopeCertificationDocumentTypeRepository.saveAll(scopeCertificationDocumentTypes);
    }

    private void loadTransactionCertificationDocumentTypes() {
        List<TransactionCertificationDocumentType> transactionCertificationDocumentTypes = Arrays.asList(
                new TransactionCertificationDocumentType(documentTypes.get(8).getCode()),
                new TransactionCertificationDocumentType(documentTypes.get(9).getCode()),
                new TransactionCertificationDocumentType(documentTypes.get(11).getCode())
        );
        transactionCertificationDocumentTypeRepository.saveAll(transactionCertificationDocumentTypes);
    }

    private void loadMaterialCertificationDocumentTypes() {
        List<MaterialCertificationDocumentType> materialCertificationDocumentTypes = Arrays.asList(
                new MaterialCertificationDocumentType(documentTypes.get(7).getCode()),
                new MaterialCertificationDocumentType(documentTypes.get(10).getCode())
        );
        materialCertificationDocumentTypeRepository.saveAll(materialCertificationDocumentTypes);
    }

    private void loadSelfCertificationProprietaryStandards() {
        List<SelfCertificationProprietaryStandard> selfCertificationProprietaryStandards = Arrays.asList(
            new SelfCertificationProprietaryStandard("Origin assessment", "", "", sustainabilityCriteriaSaved.get(3)),
            new SelfCertificationProprietaryStandard("Quality assessment", "", "", sustainabilityCriteriaSaved.get(4)),
            new SelfCertificationProprietaryStandard("Chemical use assessment", "", "", sustainabilityCriteriaSaved.get(6)),
            new SelfCertificationProprietaryStandard("Social assessment", "", "", sustainabilityCriteriaSaved.get(5)),
            new SelfCertificationProprietaryStandard("Social & environment assessment", "", "", sustainabilityCriteriaSaved.get(5)),
            new SelfCertificationProprietaryStandard("Health & safety assessment", "", "", sustainabilityCriteriaSaved.get(5)),
            new SelfCertificationProprietaryStandard("Animal welfare assessment", "", "", sustainabilityCriteriaSaved.get(0))
        );
        selfCertificationProprietaryStandardRepository.saveAll(selfCertificationProprietaryStandards);
    }

    private void loadSelfCertificationAssessmentTypes() {
        List<SelfCertificationAssessmentType> selfCertificationAssessmentTypes = Arrays.asList(
                new SelfCertificationAssessmentType("Self-Declared -- Upload of a document (report) is optional"),
                new SelfCertificationAssessmentType("Self-Assessed -- Upload of a document (report) is mandatory"),
                new SelfCertificationAssessmentType("Peer Reviewed -- Upload of a document (report) is mandatory"),
                new SelfCertificationAssessmentType("Verified by second party -- Upload of a document (report) is mandatory ")
        );
        selfCertificationAssessmentTypeRepository.saveAll(selfCertificationAssessmentTypes);
    }

    private void loadSelfCertificationDocumentTypes() {
        List<SelfCertificationDocumentType> selfCertificationDocumentTypes = Collections.singletonList(
                new SelfCertificationDocumentType(documentTypes.get(13).getCode())
        );
        selfCertificationDocumentTypeRepository.saveAll(selfCertificationDocumentTypes);
    }

    private void loadMaterials() {
        List<Material> materials = Arrays.asList(
                new Material("Red wire1", companiesSaved.get(7), false),
                new Material("Blue wire1", companiesSaved.get(7), true),
                new Material("White wire1", companiesSaved.get(7), false),
                new Material("Red cotton1", companiesSaved.get(7), true),
                new Material("Blue cotton1", companiesSaved.get(7), false),
                new Material("Green cotton1", companiesSaved.get(7), true),
                new Material("Red wire2", companiesSaved.get(8), false),
                new Material("Blue wire2", companiesSaved.get(8), true),
                new Material("White wire2", companiesSaved.get(8), false),
                new Material("Red cotton2", companiesSaved.get(8), true),
                new Material("Blue cotton2", companiesSaved.get(8), false),
                new Material("Green cotton2", companiesSaved.get(8), true),
                new Material("Red wire3", companiesSaved.get(9), false),
                new Material("Blue wire3", companiesSaved.get(9), true),
                new Material("White wire3", companiesSaved.get(9), false),
                new Material("Red cotton3", companiesSaved.get(9), true),
                new Material("Blue cotton3", companiesSaved.get(9), false),
                new Material("Green cotton3", companiesSaved.get(9), true)
        );
        materialRepository.saveAll(materials);
    }

    private void loadUnits() {
        List<Unit> units = Arrays.asList(
                new Unit("MT ", "Meters"),
                new Unit("BL", "Bales"),
                new Unit("BG", "Bags"),
                new Unit("C62", "Pieces"),
                new Unit("KGM", "Kilograms")
        );
        unitRepository.saveAll(units);
    }

    private void loadAllAssessmentTypes() {
        List<AssessmentType> assessmentTypes = Arrays.asList(
                new AssessmentType("Self Declared (First Party)"),
                new AssessmentType("Self Assessed (First Party)"),
                new AssessmentType("Peer Reviewed"),
                new AssessmentType("Verified (Second Party)"),
                new AssessmentType("Certified (Third Party)"),
                new AssessmentType("Self-Declared -- Upload of a document (report) is optional"),
                new AssessmentType("Self-Assessed -- Upload of a document (report) is mandatory"),
                new AssessmentType("Peer Reviewed -- Upload of a document (report) is mandatory"),
                new AssessmentType("Verified by second party -- Upload of a document (report) is mandatory ")
        );
        assessmentTypeRepository.saveAll(assessmentTypes);
    }

    private void loadThirdPartyAssessmentTypes() {
        List<ThirdPartyAssessmentType> thirdPartyAssessmentTypes = Arrays.asList(
                new ThirdPartyAssessmentType("Self Declared (First Party)"),
                new ThirdPartyAssessmentType("Self Assessed (First Party)"),
                new ThirdPartyAssessmentType("Peer Reviewed"),
                new ThirdPartyAssessmentType("Verified (Second Party)"),
                new ThirdPartyAssessmentType("Certified (Third Party)")
        );
        thirdPartyAssessmentTypeRepository.saveAll(thirdPartyAssessmentTypes);
    }

    private void loadSustainabilityCriteria() {
        List<SustainabilityCriterion> sustainabilityCriteria = Arrays.asList(
                new SustainabilityCriterion("Animal welfare", Collections.singleton(companyIndustriesSaved.get(1))),
                new SustainabilityCriterion("Fibre content", new HashSet<>(companyIndustriesSaved)),
                new SustainabilityCriterion("Gas emission", new HashSet<>(companyIndustriesSaved)),
                new SustainabilityCriterion("Origin", new HashSet<>(companyIndustriesSaved)),
                new SustainabilityCriterion("Product quality", new HashSet<>(companyIndustriesSaved)),
                new SustainabilityCriterion("Social/environmental performance", new HashSet<>(companyIndustriesSaved)),
                new SustainabilityCriterion("Use of chemicals", new HashSet<>(companyIndustriesSaved))
        );
        sustainabilityCriteriaSaved = sustainabilityCriterionRepository.saveAll(sustainabilityCriteria);
    }

    private void loadAllProcessingStandards() {
        List<ProcessingStandard> processingStandards = Arrays.asList(
                new ProcessingStandard("Better Cotton Initiative (BCI)", "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/102018/untitled-1_66.png?eJ41pGjMA8AjDCEryRjNVugMyiXGMr8e&itok=XqvSjp4W", "https://bettercotton.org/", sustainabilityCriteriaSaved.get(0)),
                new ProcessingStandard("Global Organic Textile Standard (GOTS)", "", "", sustainabilityCriteriaSaved.get(1)),
                new ProcessingStandard("STANDARD 100 by OEKO-TEX", "", "", sustainabilityCriteriaSaved.get(2)),
                new ProcessingStandard("STeP by OEKO-TEX", "", "", sustainabilityCriteriaSaved.get(3)),
                new ProcessingStandard("TE-GRS", "", "", sustainabilityCriteriaSaved.get(4)),
                new ProcessingStandard("TE-OCS", "", "", sustainabilityCriteriaSaved.get(5)),
                new ProcessingStandard("Haelixa DNA origin standard", "https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/itcxeonqx6revolmtvhz", "https://www.haelixa.com", sustainabilityCriteriaSaved.get(3)),
                new ProcessingStandard("Origin assessment", "", "", sustainabilityCriteriaSaved.get(3)),
                new ProcessingStandard("Quality assessment", "", "", sustainabilityCriteriaSaved.get(4)),
                new ProcessingStandard("Chemical use assessment", "", "", sustainabilityCriteriaSaved.get(6)),
                new ProcessingStandard("Social assessment", "", "", sustainabilityCriteriaSaved.get(5)),
                new ProcessingStandard("Social & environment assessment", "", "", sustainabilityCriteriaSaved.get(5)),
                new ProcessingStandard("Health & safety assessment", "", "", sustainabilityCriteriaSaved.get(5)),
                new ProcessingStandard("Animal welfare assessment", "", "", sustainabilityCriteriaSaved.get(0))
        );
        allProcessingStandardsSaved = processingStandardRepository.saveAll(processingStandards);
    }

    private void loadAllProcessingStandardCompanyIndustries() {
        List<ProcessingStandardCompanyIndustry> processingStandardCompanyIndustries = Arrays.asList(
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(0), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(1), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(1), companyIndustriesSaved.get(1)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(2), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(2), companyIndustriesSaved.get(1)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(3), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(6), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(7), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(7), companyIndustriesSaved.get(1)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(8), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(8), companyIndustriesSaved.get(1)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(9), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(9), companyIndustriesSaved.get(1)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(10), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(10), companyIndustriesSaved.get(1)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(11), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(11), companyIndustriesSaved.get(1)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(12), companyIndustriesSaved.get(0)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(12), companyIndustriesSaved.get(1)),
            new ProcessingStandardCompanyIndustry(allProcessingStandardsSaved.get(13), companyIndustriesSaved.get(1))
        );

        processingStandardCompanyIndustryRepository.saveAll(processingStandardCompanyIndustries);
    }

    private void loadReferencedStandards() {
        List<ReferencedStandard> referencedStandards = Arrays.asList(
                new ReferencedStandard("Better Cotton Initiative (BCI)", "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/102018/untitled-1_66.png?eJ41pGjMA8AjDCEryRjNVugMyiXGMr8e&itok=XqvSjp4W", "https://bettercotton.org/", sustainabilityCriteriaSaved.get(0)),
                new ReferencedStandard("Global Organic Textile Standard (GOTS)", "", "", sustainabilityCriteriaSaved.get(1)),
                new ReferencedStandard("STANDARD 100 by OEKO-TEX", "", "", sustainabilityCriteriaSaved.get(2)),
                new ReferencedStandard("STeP by OEKO-TEX", "", "", sustainabilityCriteriaSaved.get(3)),
                new ReferencedStandard("TE-GRS", "", "", sustainabilityCriteriaSaved.get(4)),
                new ReferencedStandard("TE-OCS", "", "", sustainabilityCriteriaSaved.get(5))
        );
        referencedStandardRepository.saveAll(referencedStandards);
    }

    private void loadMaterialReferencedStandards(){
        List<MaterialCertificationReferencedStandard> materialCertificationReferencedStandards = Collections.singletonList(
                new MaterialCertificationReferencedStandard("Haelixa DNA origin standard", "https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/itcxeonqx6revolmtvhz", "https://www.haelixa.com", sustainabilityCriteriaSaved.get(3))
        );
        materialCertificationReferencedStandardRepository.saveAll(materialCertificationReferencedStandards);
    }

    private void loadTransactionReferencedStandards(){
        List<TransactionCertificationReferencedStandard> transactionCertificationReferencedStandards = Collections.singletonList(
                new TransactionCertificationReferencedStandard("Global Organic Textile Standard (GOTS)", "", "", sustainabilityCriteriaSaved.get(1))
        );
        transactionCertificationReferencedStandardRepository.saveAll(transactionCertificationReferencedStandards);
    }

    private void loadProductCategories() {
        List<ProductCategory> productCategories = Arrays.asList(
                new ProductCategory("PC0025", "Dyed fabrics"),
                new ProductCategory("PC0026", "Greige fabrics"),
                new ProductCategory("PC0027", "Undyed fabrics"),
                new ProductCategory("PC0028", "Fabrics"),
                new ProductCategory("PC0029", "Dyed yarns"),
                new ProductCategory("PC0033", "Dyed fibres"),
                new ProductCategory("PC0034", "Undyed fibres"),
                new ProductCategory("PC0035", "Processed fibres/materials"),
                new ProductCategory("PC0036", "Unprocessed fibres/materials")
        );
        productCategoryRepository.saveAll(productCategories);
    }

    private void loadCountries() {
        List<Country> countries = Arrays.asList(
                new Country("CH", "Switzerland"),
                new Country("IT", "Italy"),
                new Country("US", "USA"),
                new Country("CHI", "China"),
                new Country("CZ", "Cechia")
        );
        countryRepository.saveAll(countries);
    }

    private void loadProcessTypes() {
        List<Role> roles = roleRepository.findAll();
        List<ProcessType> processTypes = Arrays.asList(
                new ProcessType("PR0030", "Trading", new HashSet<>(Arrays.asList(roles.get(0), roles.get(1)))),
                new ProcessType("PR0027", "Spinning", new HashSet<>(Arrays.asList(roles.get(0), roles.get(1)))),
                new ProcessType("PR0033", "Waeving", new HashSet<>(Arrays.asList(roles.get(0), roles.get(1)))),
                new ProcessType("PR0013", "Ginning", new HashSet<>(Arrays.asList(roles.get(0), roles.get(1)))),
                new ProcessType("PR0012", "Finishing", new HashSet<>(Collections.singletonList(roles.get(0)))),
                new ProcessType("PR0011", "Farm production", new HashSet<>(Arrays.asList(roles.get(0), roles.get(1)))),
                new ProcessType("PR0008", "Dyeing", new HashSet<>(Collections.singletonList(roles.get(0)))),
                new ProcessType("PR0025", "Retail sales", new HashSet<>(Arrays.asList(roles.get(0), roles.get(1)))),
                new ProcessType("PR0031", "Warehousing, distribution", new HashSet<>(Collections.singletonList(roles.get(0))))
        );
        processTypeRepository.saveAll(processTypes);
    }

    private void loadTraceabilityLevel() {
        List<TraceabilityLevel> traceabilityLevels = Arrays.asList(
                new TraceabilityLevel("1 - WHERE - country"),
                new TraceabilityLevel("2 - WHERE - region"),
                new TraceabilityLevel("3 - WHERE-WHO - name - address")
        );
        traceabilityLevelRepository.saveAll(traceabilityLevels);
    }

    private void loadTransparencyLevel() {
        List<TransparencyLevel> transparencyLevels = Arrays.asList(
                new TransparencyLevel("1 - Cert"),
                new TransparencyLevel("2 - Copy Certificate"),
                new TransparencyLevel("3 - Kpi")
        );
        transparencyLevelRepository.saveAll(transparencyLevels);
    }

}
