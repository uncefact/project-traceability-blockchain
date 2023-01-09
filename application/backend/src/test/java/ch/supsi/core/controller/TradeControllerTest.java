package ch.supsi.core.controller;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.company.CompanyKnowsCompany;
import ch.supsi.model.login.Login;
import ch.supsi.model.position.ContractPosition;
import ch.supsi.model.position.OrderPosition;
import ch.supsi.model.position.Position;
import ch.supsi.model.position.ShippingPosition;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.model.processing_standard.ProcessingStandardCompanyIndustry;
import ch.supsi.model.processing_standard.TransactionCertificationReferencedStandard;
import ch.supsi.model.transaction.Transaction;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.presentable.TradePresentable;
import ch.supsi.repository.*;
import ch.supsi.repository.company.CompanyKnowsCompanyRepository;
import ch.supsi.repository.company.CompanyRepository;
import ch.supsi.repository.position.ContractPositionRepository;
import ch.supsi.repository.position.OrderPositionRepository;
import ch.supsi.repository.position.ShippingPositionRepository;
import ch.supsi.repository.processing_standard.ProcessingStandardCompanyIndustryRepository;
import ch.supsi.repository.processing_standard.ProcessingStandardRepository;
import ch.supsi.repository.processing_standard.TransactionCertificationReferencedStandardRepository;
import ch.supsi.repository.transaction.trade.ContractTradeRepository;
import ch.supsi.repository.transaction.trade.OrderTradeRepository;
import ch.supsi.repository.transaction.trade.ShippingTradeRepository;
import ch.supsi.request.DocumentRequest;
import ch.supsi.request.transaction.trade.ContractRequest;
import ch.supsi.request.transaction.trade.OrderRequest;
import ch.supsi.request.transaction.trade.ShippingRequest;
import ch.supsi.request.transaction.trade.UpdateTradeRequest;
import ch.supsi.service.MailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MvcResult;
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

public class TradeControllerTest extends UneceControllerTestTemplate {

    @Value("${unece.documents-storage-path}")
    private String documentsPath;

    @MockBean
    private MailService mailService;

    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private ContractTradeRepository contractTradeRepository;
    @Autowired
    private OrderTradeRepository orderTradeRepository;
    @Autowired
    private ShippingTradeRepository shippingTradeRepository;
    @Autowired
    private DocumentTypeRepository documentTypeRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private CompanyKnowsCompanyRepository companyKnowsCompanyRepository;
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private ContractPositionRepository contractPositionRepository;
    @Autowired
    private OrderPositionRepository orderPositionRepository;
    @Autowired
    private ShippingPositionRepository shippingPositionRepository;
    @Autowired
    private UnitRepository unitRepository;
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private ProcessingStandardRepository processingStandardRepository;
    @Autowired
    private TransactionCertificationReferencedStandardRepository transactionCertificationReferencedStandardRepository;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private CustodialWalletCredentialsRepository custodialWalletCredentialsRepository;
    @Autowired
    private ProcessingStandardCompanyIndustryRepository processingStandardCompanyIndustryRepository;

    private final String PATH = "/trades";

    private Login userLogin;
    private Login userCertifierLogin;
    private List<ContractTrade> contracts = new ArrayList<>();
    private List<OrderTrade> orders = new ArrayList<>();
    private List<ShippingTrade> shippings = new ArrayList<>();
    private List<Company> companies;
    private List<Material> materialsOfLoggedCompany;
    private List<Material> materialsOfConsigneeCompany;
    private List<Material> outputMaterials;
    private List<Unit> units;
    private List<DocumentType> documentTypes = new ArrayList<>();
    private List<DocumentRequest> documentRequests = null;
    private List<ContractPosition> contractPositions = new ArrayList<>();
    private List<OrderPosition> orderPositions = new ArrayList<>();
    private List<ShippingPosition> shippingPositions = new ArrayList<>();
    private ProcessingStandard processingStandard;

    @Before
    public void init() {
        List<ContractTrade> contractsSaved;
        List<OrderTrade> ordersSaved;
        List<DocumentType> documentTypesSaved;
        List<ShippingTrade> shippingsSaved;
        List<ContractPosition> contractPositionsSaved;
        List<OrderPosition> orderPositionsSaved;
        List<ShippingPosition> shippingPositionsSaved;
        ContractPosition contractPositionWithCachedMaterial;
        OrderPosition orderPositionWithCachedMaterial;
        ShippingPosition shippingPositionWithCachedMaterial;
        userLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("user");
        userCertifierLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("cert");

        this.companies = companyRepository.findAll();
        this.materialsOfConsigneeCompany = materialRepository.findAllByCompanyCompanyName(companies.get(9).getCompanyName());
        this.materialsOfLoggedCompany = materialRepository.findAllByCompanyCompanyName(userLogin.getUser().getCompany().getCompanyName());
        this.outputMaterials = materialRepository.findAll().stream().filter(material -> !material.isInput()).collect(Collectors.toList());
        this.units = unitRepository.findAll();

        documentTypesSaved = Arrays.asList(
                new DocumentType("dt1"),
                new DocumentType("dt2"),
                new DocumentType("dt3"));
        documentTypesSaved.forEach(documentType -> this.documentTypes.add(documentTypeRepository.save(documentType)));

        processingStandard = processingStandardRepository.save(new ProcessingStandard("Processing standard 1"));

        contractsSaved = Arrays.asList(
                new ContractTrade("12345", companies.get(2), companies.get(1), documentTypes.get(0)),
                new ContractTrade("54321", companies.get(0), companies.get(9), documentTypes.get(2)),
                new ContractTrade("00000", companies.get(0), companies.get(7), documentTypes.get(0)),
                new ContractTrade("11111", companies.get(0), companies.get(7), documentTypes.get(0)));
        contractsSaved.forEach(trade -> contracts.add(contractTradeRepository.save(trade)));

        contractPositionWithCachedMaterial = new ContractPosition(materialsOfLoggedCompany.get(2), 25.7, 42.7, "description", units.get(1));
        contractPositionWithCachedMaterial.setContractTrade(contracts.get(3));
        contractPositionWithCachedMaterial.setConsigneeMaterial(materialsOfConsigneeCompany.get(0));
        contractPositionsSaved = Arrays.asList(
                new ContractPosition(materialsOfLoggedCompany.get(0), 12.2, 100.2, "description", units.get(1)),
                new ContractPosition(materialsOfLoggedCompany.get(1), 8.2, 80.5, "description", units.get(2)),
                new ContractPosition(materialsOfLoggedCompany.get(2), 25.7, 42.7, "description", units.get(1)),
                contractPositionWithCachedMaterial);
        contractPositionsSaved.forEach(contractPosition -> contractPositions.add(contractPositionRepository.save(contractPosition)));

        ordersSaved = Arrays.asList(
                new OrderTrade("1234", companies.get(2), companies.get(1), contractsSaved.get(0), documentTypes.get(1)),
                new OrderTrade("4321", companies.get(0), companies.get(9), contractsSaved.get(1), documentTypes.get(0)),
                new OrderTrade("00000", companies.get(0), companies.get(7), contractsSaved.get(0), documentTypes.get(1)),
                new OrderTrade("11111", companies.get(0), companies.get(7), contractsSaved.get(0), documentTypes.get(1)));
        ordersSaved.forEach(trade -> orders.add(orderTradeRepository.save(trade)));

        orderPositionWithCachedMaterial = new OrderPosition(materialsOfLoggedCompany.get(1), 25.7, 42.7, "description", units.get(1));
        orderPositionWithCachedMaterial.setOrderTrade(orders.get(3));
        orderPositionWithCachedMaterial.setConsigneeMaterial(materialsOfConsigneeCompany.get(1));
        orderPositionsSaved = Arrays.asList(
                new OrderPosition(materialsOfLoggedCompany.get(0), 12.2, 80.9, "description", units.get(0)),
                new OrderPosition(materialsOfLoggedCompany.get(1), 16.3, 45.6, "description", units.get(2)),
                new OrderPosition(materialsOfLoggedCompany.get(1), 3.4, 209.3, "description", units.get(1)),
                orderPositionWithCachedMaterial);
        orderPositionsSaved.forEach(orderPosition -> orderPositions.add(orderPositionRepository.save(orderPosition)));

        shippingsSaved = Arrays.asList(
                new ShippingTrade("123", companies.get(0), companies.get(1), ordersSaved.get(0), documentTypes.get(1)),
                new ShippingTrade("124", companies.get(2), companies.get(1), ordersSaved.get(0), documentTypes.get(1)),
                new ShippingTrade("321", companies.get(0), companies.get(9), ordersSaved.get(1), documentTypes.get(2)),
                new ShippingTrade("000", companies.get(0), companies.get(7), ordersSaved.get(0), documentTypes.get(1)),
                new ShippingTrade("111", companies.get(0), companies.get(7), ordersSaved.get(0), documentTypes.get(1)));
        shippingsSaved.get(0).setProcessingStandard(processingStandard);
        shippingsSaved.forEach(shippingTransaction -> shippings.add(shippingTradeRepository.save(shippingTransaction)));

        shippingPositionWithCachedMaterial = new ShippingPosition(materialsOfLoggedCompany.get(0), 25.7, 42.7, "description", units.get(1));
        shippingPositionWithCachedMaterial.setShippingTrade(shippings.get(4));
        shippingPositionWithCachedMaterial.setConsigneeMaterial(materialsOfConsigneeCompany.get(1));
        shippingPositionsSaved = Arrays.asList(
                new ShippingPosition(materialsOfLoggedCompany.get(2), 12.2, 75.3, "description", units.get(0)),
                new ShippingPosition(materialsOfLoggedCompany.get(0), 35.2, 357.9, "description", units.get(0)),
                new ShippingPosition(materialsOfLoggedCompany.get(1), 180.4, 32.4, "description", units.get(1)),
                shippingPositionWithCachedMaterial);
        shippingPositionsSaved.forEach(shippingPosition -> shippingPositions.add(shippingPositionRepository.save(shippingPosition)));


        try {
            documentRequests = Utils.loadDocumentRequestsFromFiles(documentsPath);
        } catch (IOException e) {
            e.printStackTrace();
        }

        processingStandardCompanyIndustryRepository.save(
                new ProcessingStandardCompanyIndustry(transactionCertificationReferencedStandardRepository.findAll().get(0), userLogin.getUser().getCompany().getCompanyIndustry()));

        doNothing().when(mailService).sendMail(isA(String[].class), isA(String.class), isA(String.class));
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void getContractsTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/contracts", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$.[*].id", hasItems(this.contracts.stream().filter(c -> c.getContractor().getCompanyName().equals(userLogin.getUser().getCompany().getCompanyName())).map(c -> c.getId().intValue()).toArray(Integer[]::new))));
    }

//    @Test
//    public void getContractsTestFailed() throws Exception {
//        this.mock().perform(get(userCertifierLogin.getUsername(), PATH + "/contracts", true))
//                .andExpect(status().isForbidden());
//    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void getOrdersTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/orders", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$.[*].id", hasItems(this.orders.stream().filter(c -> c.getContractor().getCompanyName().equals(userLogin.getUser().getCompany().getCompanyName())).map(c -> c.getId().intValue()).toArray(Integer[]::new))));
    }

//    @Test
//    public void getOrdersTestFailed() throws Exception {
//        this.mock().perform(get(userCertifierLogin.getUsername(), PATH + "/orders", true))
//                .andExpect(status().isForbidden());
//    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void getShippingTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/shippings", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$.[*].id", hasItems(this.shippings.stream().filter(c -> c.getContractor().getCompanyName().equals(userLogin.getUser().getCompany().getCompanyName())).map(c -> c.getId().intValue()).toArray(Integer[]::new))));
    }

    @Test
    public void getShippingsByCompanyTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/shippingsByCompany", true).param("companyName", companies.get(9).getCompanyName()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.[*].contractorReferenceNumber", hasItems(this.shippings.stream().filter(s -> s.getContractor().equals(companies.get(9)) || s.getConsignee().equals(companies.get(9))).map(Transaction::getContractorReferenceNumber).toArray(String[]::new))));
    }

    @Test
    // per ripulire il contesto del db, in modo tale che i contratti che vengono aggiunti al db abbiano un id incrementale che parte da 1
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void getContractByIdTest() throws Exception {
        assertEquals(userLogin.getUser().getCompany().getCompanyName(), contracts.get(2).getContractor().getCompanyName());
        this.mock().perform(get(userLogin.getUsername(), PATH + "/contracts/3", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(companies.get(7).getCompanyName())))
                .andExpect(jsonPath("$.documentType", is(documentTypes.get(0).getCode() + " - " + documentTypes.get(0).getName())));

        // use cached material
        this.mock().perform(get(userLogin.getUsername(), PATH + "/contracts/4", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(companies.get(7).getCompanyName())))
                .andExpect(jsonPath("$.positions.[0].consigneeMaterialName", is(contractPositions.get(3).getConsigneeMaterial().getName())))
                .andExpect(jsonPath("$.positions.[0].consigneeMaterialId", is(contractPositions.get(3).getConsigneeMaterial().getId().intValue())));
    }

    @Test(expected = AssertionError.class)
    public void getContractByIdTestFailed() throws Exception {
        assertNotEquals(userLogin.getUser().getCompany().getCompanyName(), contracts.get(0).getConsignee().getCompanyName());
        assertNotEquals(userLogin.getUser().getCompany().getCompanyName(), contracts.get(0).getContractor().getCompanyName());
        this.mock().perform(get(userLogin.getUsername(), PATH + "/contracts/" + contracts.get(0).getId(), true))
                .andExpect(status().isForbidden())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.FORBIDDEN.getMessage(), result.getResolvedException().getMessage()));

        this.mock().perform(get(userLogin.getUsername(), PATH + "/contracts/10", true))
                .andExpect(status().isNotFound())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.TRANSACTION_NOT_FOUND.getMessage(), result.getResolvedException().getMessage()));

        // certifier tries to view trade resources
        this.mock().perform(get(userCertifierLogin.getUsername(), PATH + "/contracts/1", true))
                .andExpect(status().isForbidden());
    }

    @Test
    // per ripulire il contesto del db, in modo tale che gli ordini che vengono aggiunti al db abbiano un id incrementale che parte da 1
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void getOrderByIdTest() throws Exception {
        assertEquals(userLogin.getUser().getCompany().getCompanyName(), orders.get(2).getContractor().getCompanyName());
        this.mock().perform(get(userLogin.getUsername(), PATH + "/orders/3", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(companies.get(7).getCompanyName())))
                .andExpect(jsonPath("$.documentType", is(documentTypes.get(1).getCode() + " - " + documentTypes.get(1).getName())));

        // use cached material
        this.mock().perform(get(userLogin.getUsername(), PATH + "/orders/4", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(companies.get(7).getCompanyName())))
                .andExpect(jsonPath("$.positions.[0].consigneeMaterialName", is(orderPositions.get(3).getConsigneeMaterial().getName())))
                .andExpect(jsonPath("$.positions.[0].consigneeMaterialId", is(orderPositions.get(3).getConsigneeMaterial().getId().intValue())));

    }

    @Test(expected = AssertionError.class)
    public void getOrderByIdTestFailed() throws Exception {
        assertNotEquals(userLogin.getUser().getCompany().getCompanyName(), orders.get(0).getConsignee().getCompanyName());
        assertNotEquals(userLogin.getUser().getCompany().getCompanyName(), orders.get(0).getContractor().getCompanyName());
        this.mock().perform(get(userLogin.getUsername(), PATH + "/orders/" + orders.get(0).getId(), true))
                .andExpect(status().isForbidden())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.FORBIDDEN.getMessage(), result.getResolvedException().getMessage()));

        this.mock().perform(get(userLogin.getUsername(), PATH + "/orders/10", true))
                .andExpect(status().isNotFound())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.TRANSACTION_NOT_FOUND.getMessage(), result.getResolvedException().getMessage()));

        // certifier tries to view trade resources
        this.mock().perform(get(userCertifierLogin.getUsername(), PATH + "/orders/1", true))
                .andExpect(status().isForbidden());
    }

    @Test
    // per ripulire il contesto del db, in modo tale che le shipping che vengono aggiunti al db abbiano un id incrementale che parte da 1
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void getShippingByIdTest() throws Exception {
        assertEquals(userLogin.getUser().getCompany().getCompanyName(), shippings.get(3).getContractor().getCompanyName());

        this.mock().perform(get(userLogin.getUsername(), PATH + "/shippings/4", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(companies.get(7).getCompanyName())))
                .andExpect(jsonPath("$.documentType", is(documentTypes.get(1).getCode() + " - " + documentTypes.get(1).getName())));

        // use cached material
        this.mock().perform(get(userLogin.getUsername(), PATH + "/shippings/5", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.contractorName", is(companies.get(7).getCompanyName())))
                .andExpect(jsonPath("$.positions.[0].consigneeMaterialName", is(shippingPositions.get(3).getConsigneeMaterial().getName())))
                .andExpect(jsonPath("$.positions.[0].consigneeMaterialId", is(shippingPositions.get(3).getConsigneeMaterial().getId().intValue())));
    }

    @Test(expected = AssertionError.class)
    public void getShippingByIdTestFailed() throws Exception {
        assertNotEquals(userLogin.getUser().getCompany().getCompanyName(), shippings.get(2).getConsignee().getCompanyName());
        assertNotEquals(userLogin.getUser().getCompany().getCompanyName(), shippings.get(2).getContractor().getCompanyName());
        this.mock().perform(get(userLogin.getUsername(), PATH + "/shippings/" + shippings.get(2).getId(), true))
                .andExpect(status().isForbidden())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.FORBIDDEN.getMessage(), result.getResolvedException().getMessage()));

        this.mock().perform(get(userLogin.getUsername(), PATH + "/shippings/10", true))
                .andExpect(status().isNotFound())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.TRANSACTION_NOT_FOUND.getMessage(), result.getResolvedException().getMessage()));

        // certifier tries to view trade resources
        this.mock().perform(get(userCertifierLogin.getUsername(), PATH + "/shippings/1", true))
                .andExpect(status().isForbidden());
    }

    @Test
    public void createContractTest() throws Exception {
        contractPositions.forEach(cp -> cp.setContractorMaterial(outputMaterials.get(1)));
        ContractRequest contractRequest = new ContractRequest(
                companies.get(0).getCompanyName(), "consignee@mail.ch", new Date(), null, documentTypes.get(0).getCode(), documentRequests.get(2),
                processingStandard.getName(), "notesTest", "23456", contractPositions, false);

        MvcResult result = this.mock().perform(post(userLogin.getUsername(), PATH + "/contract/create", true, new ObjectMapper().writeValueAsString(contractRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.documentType", is(documentTypes.get(0).getCode() + " - " + documentTypes.get(0).getName())))
                .andExpect(jsonPath("$.positions.[*].contractorMaterialName", is(contractPositions.stream().map(cp -> cp.getContractorMaterial().getName()).collect(Collectors.toList()))))
                .andReturn();
        assertNotNull(contractTradeRepository.findByContractorReferenceNumber("23456"));
        assertEquals(contractTradeRepository.findByContractorReferenceNumber("23456").getDocumentType(), documentTypes.get(0));
        TradePresentable tradePresentable = new ObjectMapper().readValue(result.getResponse().getContentAsString(), TradePresentable.class);
        assertEquals(documentRepository.getOne(tradePresentable.getDocumentID()).getFileName(), documentRequests.get(2).getName());
        assertEquals(contractPositions.stream().map(Position::getQuantity).collect(Collectors.toList()), contractPositionRepository.findAll().stream().map(Position::getQuantity).collect(Collectors.toList()));
    }

    @Test
    public void createContractWithInvitationTest() throws Exception {
        contractPositions.forEach(cp -> cp.setContractorMaterial(outputMaterials.get(1)));
        ContractRequest contractRequest = new ContractRequest(
                "companyInvitedName", "companyinvited@mail.ch", new Date(), null, documentTypes.get(0).getCode(), documentRequests.get(2),
                processingStandard.getName(), "notesTest", "1010", contractPositions, true);
        MvcResult result = this.mock().perform(post(userLogin.getUsername(), PATH + "/contract/create", true, new ObjectMapper().writeValueAsString(contractRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.documentType", is(documentTypes.get(0).getCode() + " - " + documentTypes.get(0).getName())))
                .andExpect(jsonPath("$.positions.[*].contractorMaterialName", is(contractPositions.stream().map(cp -> cp.getContractorMaterial().getName()).collect(Collectors.toList()))))
                .andReturn();
        // usual trade creation test
        assertNotNull(contractTradeRepository.findByContractorReferenceNumber("1010"));
        TradePresentable tradePresentable = new ObjectMapper().readValue(result.getResponse().getContentAsString(), TradePresentable.class);
        assertEquals(documentRepository.getOne(tradePresentable.getDocumentID()).getFileName(), documentRequests.get(2).getName());
        assertEquals(contractPositions.stream().map(Position::getQuantity).collect(Collectors.toList()), contractPositionRepository.findAll().stream().map(Position::getQuantity).collect(Collectors.toList()));
        // the company has been invited, so a Company is created with the primary key of its new custodial wallet and also a relation from company a to company b
        List<CompanyKnowsCompany> companyKnowsCompanies = companyKnowsCompanyRepository.findAllByCompanyBCompanyName("companyInvitedName");
        Company companyAdded = companyRepository.findByCompanyName("companyInvitedName");
        Optional<CustodialWalletCredentials> companyAddedWallet = custodialWalletCredentialsRepository.findById(companyAdded.getCustodialWalletCredentials().getId());
        assertNotNull(companyAdded);
        assertTrue(companyAddedWallet.isPresent());
        assertEquals(companyAddedWallet.get().getPublicKey(), companyAdded.getEthAddress());
        assertEquals(1, companyKnowsCompanies.size());
        assertEquals(userLogin.getUser().getCompany(), companyKnowsCompanies.get(0).getCompanyA());
        assertEquals(companyAdded, companyKnowsCompanies.get(0).getCompanyB());
        // a token to finish the onboarding process has been created
        Optional<Token> companyAddedToken = tokenRepository.findAll().stream().filter(t -> t.getCompany().equals(companyAdded)).findFirst();
        assertTrue(companyAddedToken.isPresent());
        assertEquals(companyAddedToken.get().getGeneratedBy(), userLogin.getUser().getCompany());
    }

    @Test
    public void createOrderTest() throws Exception {
        orderPositions.forEach(op -> op.setContractorMaterial(outputMaterials.get(0)));
        OrderRequest orderRequest = new OrderRequest(
                companies.get(0).getCompanyName(), "consignee@mail.ch", new Date(), null, documentTypes.get(1).getCode(), documentRequests.get(1), processingStandard.getName(),
                "notesTest", "23457", contracts.get(0).getContractorReferenceNumber(), orderPositions, false);

        this.mock().perform(post(userLogin.getUsername(), PATH + "/order/create", true, new ObjectMapper().writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.documentType", is(documentTypes.get(1).getCode() + " - " + documentTypes.get(1).getName())))
                .andExpect(jsonPath("$.positions.[*].contractorMaterialName", is(orderPositions.stream().map(op -> op.getContractorMaterial().getName()).collect(Collectors.toList()))));
        assertNotNull(orderTradeRepository.findByContractorReferenceNumber("23457"));
        assertEquals(orderTradeRepository.findByContractorReferenceNumber("23457").getConsignee(), companies.get(0));
        assertEquals(orderPositions.stream().map(Position::getQuantity).collect(Collectors.toList()), orderPositionRepository.findAll().stream().map(Position::getQuantity).collect(Collectors.toList()));
    }

    @Test
    public void createOrderWithInvitationTest() throws Exception {
        orderPositions.forEach(op -> op.setContractorMaterial(outputMaterials.get(0)));
        OrderRequest orderRequest = new OrderRequest(
                "invitedCompanyName2", "companyinvited2@mail.ch", new Date(), null, documentTypes.get(1).getCode(), documentRequests.get(1), processingStandard.getName(),
                "notesTest", "23457", contracts.get(0).getContractorReferenceNumber(), orderPositions, true);

        this.mock().perform(post(userLogin.getUsername(), PATH + "/order/create", true, new ObjectMapper().writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.documentType", is(documentTypes.get(1).getCode() + " - " + documentTypes.get(1).getName())))
                .andExpect(jsonPath("$.positions.[*].contractorMaterialName", is(orderPositions.stream().map(op -> op.getContractorMaterial().getName()).collect(Collectors.toList()))));

        assertNotNull(orderTradeRepository.findByContractorReferenceNumber("23457"));
        assertEquals(orderPositions.stream().map(Position::getQuantity).collect(Collectors.toList()), orderPositionRepository.findAll().stream().map(Position::getQuantity).collect(Collectors.toList()));
        // the company has been invited, so a Company is created with the primary key of its new custodial wallet and also a relation from company a to company b
        List<CompanyKnowsCompany> companyKnowsCompanies = companyKnowsCompanyRepository.findAllByCompanyBCompanyName("invitedCompanyName2");
        Company companyAdded = companyRepository.findByCompanyName("invitedCompanyName2");
        Optional<CustodialWalletCredentials> companyAddedWallet = custodialWalletCredentialsRepository.findById(companyAdded.getCustodialWalletCredentials().getId());
        assertNotNull(companyAdded);
        assertTrue(companyAddedWallet.isPresent());
        assertEquals(companyAddedWallet.get().getPublicKey(), companyAdded.getEthAddress());
        assertEquals(1, companyKnowsCompanies.size());
        assertEquals(userLogin.getUser().getCompany(), companyKnowsCompanies.get(0).getCompanyA());
        assertEquals(companyAdded, companyKnowsCompanies.get(0).getCompanyB());
        // a token to finish the onboarding process has been created
        Optional<Token> companyAddedToken = tokenRepository.findAll().stream().filter(t -> t.getCompany().equals(companyAdded)).findFirst();
        assertTrue(companyAddedToken.isPresent());
        assertEquals(companyAddedToken.get().getGeneratedBy(), userLogin.getUser().getCompany());
    }

    @Test
    public void createShippingTest() throws Exception {
        shippingPositions.forEach(sp -> sp.setContractorMaterial(outputMaterials.get(2)));
        ShippingRequest shippingRequest = new ShippingRequest(
                companies.get(1).getCompanyName(), "consignee@mail.ch", new Date(), new Date(), documentTypes.get(2).getCode(), documentRequests.get(0), processingStandard.getName(),
                "", "23458", orders.get(1).getContractorReferenceNumber(), shippingPositions, false);

        this.mock().perform(post(userLogin.getUsername(), PATH + "/shipping/create", true, new ObjectMapper().writeValueAsString(shippingRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.documentType", is(documentTypes.get(2).getCode() + " - " + documentTypes.get(2).getName())))
                .andExpect(jsonPath("$.positions.[*].contractorMaterialName", is(shippingPositions.stream().map(sp -> sp.getContractorMaterial().getName()).collect(Collectors.toList()))));

        assertNotNull(shippingTradeRepository.findByContractorReferenceNumber("23458"));
        assertEquals(shippingTradeRepository.findByContractorReferenceNumber("23458").getConsignee(), companies.get(1));
        assertEquals(shippingPositions.stream().map(Position::getQuantity).collect(Collectors.toList()), shippingPositionRepository.findAll().stream().map(Position::getQuantity).collect(Collectors.toList()));
    }

    @Test
    public void createShippingWithInvitationTest() throws Exception {
        shippingPositions.forEach(sp -> sp.setContractorMaterial(outputMaterials.get(2)));
        ShippingRequest shippingRequest = new ShippingRequest(
                "invitedCompanyName3", "companyinvited3@mail.ch", new Date(), null, documentTypes.get(2).getCode(), documentRequests.get(0), processingStandard.getName(),
                "", "23458", orders.get(1).getContractorReferenceNumber(), shippingPositions, true);

        this.mock().perform(post(userLogin.getUsername(), PATH + "/shipping/create", true, new ObjectMapper().writeValueAsString(shippingRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.documentType", is(documentTypes.get(2).getCode() + " - " + documentTypes.get(2).getName())))
                .andExpect(jsonPath("$.positions.[*].contractorMaterialName", is(shippingPositions.stream().map(sp -> sp.getContractorMaterial().getName()).collect(Collectors.toList()))));

        assertNotNull(shippingTradeRepository.findByContractorReferenceNumber("23458"));
        assertEquals(shippingPositions.stream().map(Position::getQuantity).collect(Collectors.toList()), shippingPositionRepository.findAll().stream().map(Position::getQuantity).collect(Collectors.toList()));
        // the company has been invited, so a Company is created with the primary key of its new custodial wallet and also a relation from company a to company b
        List<CompanyKnowsCompany> companyKnowsCompanies = companyKnowsCompanyRepository.findAllByCompanyBCompanyName("invitedCompanyName3");
        Company companyAdded = companyRepository.findByCompanyName("invitedCompanyName3");
        Optional<CustodialWalletCredentials> companyAddedWallet = custodialWalletCredentialsRepository.findById(companyAdded.getCustodialWalletCredentials().getId());
        assertNotNull(companyAdded);
        assertTrue(companyAddedWallet.isPresent());
        assertEquals(companyAddedWallet.get().getPublicKey(), companyAdded.getEthAddress());
        assertEquals(1, companyKnowsCompanies.size());
        assertEquals(userLogin.getUser().getCompany(), companyKnowsCompanies.get(0).getCompanyA());
        assertEquals(companyAdded, companyKnowsCompanies.get(0).getCompanyB());
        // a token to finish the onboarding process has been created
        Optional<Token> companyAddedToken = tokenRepository.findAll().stream().filter(t -> t.getCompany().equals(companyAdded)).findFirst();
        assertTrue(companyAddedToken.isPresent());
        assertEquals(companyAddedToken.get().getGeneratedBy(), userLogin.getUser().getCompany());
    }

    @Test
    public void createContractTestFailed() throws Exception {
        contractPositions.forEach(cp -> cp.setContractorMaterial(outputMaterials.get(2)));
        ContractRequest contractRequest = new ContractRequest(
                companies.get(1).getCompanyName(), "consignee@mail.ch", new Date(), null, documentTypes.get(2).getCode(), documentRequests.get(0), processingStandard.getName(),
                "", "", contractPositions, false);

        try {
            this.mock().perform(post(userLogin.getUsername(), PATH + "/contract/create", true, new ObjectMapper().writeValueAsString(contractRequest)));
        }
        catch (NestedServletException e){
            assertEquals(UneceError.INVALID_VALUE.getMessage(), e.getCause().getMessage());
        }

        contractRequest.setContractorReferenceNumber("       ");
        try {
            this.mock().perform(post(userLogin.getUsername(), PATH + "/contract/create", true, new ObjectMapper().writeValueAsString(contractRequest)))
                    .andExpect(status().isBadRequest());
        }
        catch (NestedServletException e){
            assertEquals(UneceError.INVALID_VALUE.getMessage(), e.getCause().getMessage());
        }

//        this.mock().perform(post(userCertifierLogin.getUsername(), PATH + "/contract/create", true, new ObjectMapper().writeValueAsString(contractRequest)))
//                .andExpect(status().isForbidden());
    }

    @Test
    public void createOrderTestFailed() throws Exception {
        orderPositions.forEach(op -> op.setContractorMaterial(outputMaterials.get(2)));
        OrderRequest orderRequest = new OrderRequest(
                companies.get(1).getCompanyName(), "consignee@mail.ch", new Date(), new Date(), documentTypes.get(2).getCode(), documentRequests.get(0), processingStandard.getName(),
                "", "", "", orderPositions, false);

        try {
            this.mock().perform(post(userLogin.getUsername(), PATH + "/order/create", true, new ObjectMapper().writeValueAsString(orderRequest)));
        }
        catch (NestedServletException e){
            assertEquals(UneceError.INVALID_VALUE.getMessage(), e.getCause().getMessage());
        }

        orderRequest.setContractorReferenceNumber("       ");
        try {
            this.mock().perform(post(userLogin.getUsername(), PATH + "/order/create", true, new ObjectMapper().writeValueAsString(orderRequest)))
                    .andExpect(status().isBadRequest());
        }
        catch (NestedServletException e){
            assertEquals(UneceError.INVALID_VALUE.getMessage(), e.getCause().getMessage());
        }

//        this.mock().perform(post(userCertifierLogin.getUsername(), PATH + "/order/create", true, new ObjectMapper().writeValueAsString(orderRequest)))
//                .andExpect(status().isForbidden());
    }

    @Test
    public void createShippingTestFailed() throws Exception {
        shippingPositions.forEach(sp -> sp.setContractorMaterial(outputMaterials.get(2)));
        ShippingRequest shippingRequest = new ShippingRequest(
                companies.get(1).getCompanyName(), "consignee@mail.ch", new Date(), null, documentTypes.get(2).getCode(), documentRequests.get(0), processingStandard.getName(),
                "", "", orders.get(1).getContractorReferenceNumber(), shippingPositions, false);

        try {
            this.mock().perform(post(userLogin.getUsername(), PATH + "/shipping/create", true, new ObjectMapper().writeValueAsString(shippingRequest)));
        }
        catch (NestedServletException e){
            assertEquals(UneceError.INVALID_VALUE.getMessage(), e.getCause().getMessage());
        }

        shippingRequest.setContractorReferenceNumber("       ");
        try {
            this.mock().perform(post(userLogin.getUsername(), PATH + "/order/create", true, new ObjectMapper().writeValueAsString(shippingRequest)))
                    .andExpect(status().isBadRequest());
        }
        catch (NestedServletException e){
            assertEquals(UneceError.INVALID_VALUE.getMessage(), e.getCause().getMessage());
        }

//        this.mock().perform(post(userCertifierLogin.getUsername(), PATH + "/order/create", true, new ObjectMapper().writeValueAsString(shippingRequest)))
//                .andExpect(status().isForbidden());
    }

    @Test
    public void updateTradeTest() throws Exception {
        UpdateTradeRequest updateTradeRequest = new UpdateTradeRequest("Global Organic Textile Standard (GOTS)", "shipping");

        assertEquals(processingStandard, shippings.get(0).getProcessingStandard());

        this.mock().perform(put(userLogin.getUsername(), PATH + '/' + shippings.get(0).getId(), true, new ObjectMapper().writeValueAsString(updateTradeRequest)))
                .andExpect(status().isOk());

        assertTrue(shippingTradeRepository.findById(shippings.get(0).getId()).isPresent());
        assertEquals(processingStandardRepository.findByName("Global Organic Textile Standard (GOTS)"), shippingTradeRepository.findById(shippings.get(0).getId()).get().getProcessingStandard());
    }

    @Test
    public void getTradeProcessingStandardsTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/processingStandards", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[*].name", is(transactionCertificationReferencedStandardRepository.findAll().stream().limit(1).map(TransactionCertificationReferencedStandard::getName).collect(Collectors.toList()))));
    }

}
