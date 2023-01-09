package ch.supsi.core.controller;

import ch.supsi.model.company.Company;
import ch.supsi.model.DocumentType;
import ch.supsi.model.Material;
import ch.supsi.model.Unit;
import ch.supsi.model.login.Login;
import ch.supsi.model.position.ContractPosition;
import ch.supsi.model.position.OrderPosition;
import ch.supsi.model.position.ShippingPosition;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.model.transaction.certification.assessment_type.AssessmentType;
import ch.supsi.model.transaction.certification.CertificationSubject;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.repository.*;
import ch.supsi.repository.company.CompanyRepository;
import ch.supsi.repository.position.ContractPositionRepository;
import ch.supsi.repository.position.OrderPositionRepository;
import ch.supsi.repository.position.ShippingPositionRepository;
import ch.supsi.repository.transaction.certificate.assessment_type.AssessmentTypeRepository;
import ch.supsi.repository.transaction.certificate.CertificationTransactionRepository;
import ch.supsi.repository.transaction.trade.ContractTradeRepository;
import ch.supsi.repository.transaction.trade.OrderTradeRepository;
import ch.supsi.repository.transaction.trade.ShippingTradeRepository;
import ch.supsi.request.position.PositionRequest;
import ch.supsi.request.transaction.ConfirmationTransactionRequest;
import ch.supsi.service.MailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;

import java.util.*;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TransactionControllerTest extends UneceControllerTestTemplate {

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
    private MaterialRepository materialRepository;
    @Autowired
    private ContractPositionRepository contractPositionRepository;
    @Autowired
    private OrderPositionRepository orderPositionRepository;
    @Autowired
    private ShippingPositionRepository shippingPositionRepository;
    @Autowired
    private CertificationTransactionRepository certificationTransactionRepository;
    @Autowired
    private AssessmentTypeRepository assessmentTypeRepository;
    @Autowired
    private UnitRepository unitRepository;

    private final String PATH = "/transactions";

    private Login userLogin;
    private Login userCertifierLogin;
    private Login albiniLogin;
    private List<Material> materials;
    private List<ContractTrade> contracts = new ArrayList<>();
    private List<OrderTrade> orders = new ArrayList<>();
    private List<ShippingTrade> shippings = new ArrayList<>();
    private List<Company> companies;
    private List<Unit> units;
    private List<DocumentType> documentTypes = new ArrayList<>();
    private List<ContractPosition> contractPositions = new ArrayList<>();
    private List<OrderPosition> orderPositions = new ArrayList<>();
    private List<ShippingPosition> shippingPositions = new ArrayList<>();
    private AssessmentType assessmentType;

    private ContractTrade contractTrade;
    private OrderTrade orderTrade;
    private ShippingTrade shippingTrade;
    private CertificationTransaction certificationTransaction;

    @Before
    public void init() {
        List<ContractTrade> contractsSaved;
        List<OrderTrade> ordersSaved;
        List<DocumentType> documentTypesSaved;
        List<ShippingTrade> shippingsSaved;
        List<ContractPosition> contractPositionsSaved;
        List<OrderPosition> orderPositionsSaved;
        List<ShippingPosition> shippingPositionsSaved;

        this.companies = this.companyRepository.findAll();
        this.userLogin = this.loginRepository.findLoginByUsernameAndExpiredIsNull("user");
        this.userCertifierLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("cert");
        this.albiniLogin = this.loginRepository.findLoginByUsernameAndExpiredIsNull("albini");

        this.companies = companyRepository.findAll();
        this.materials = materialRepository.findAllByCompanyCompanyName(userLogin.getUser().getCompany().getCompanyName());
        this.units = unitRepository.findAll();

        documentTypesSaved = Arrays.asList(
                new DocumentType("dt1"),
                new DocumentType("dt2"),
                new DocumentType("dt3"));
        documentTypesSaved.forEach(documentType -> this.documentTypes.add(documentTypeRepository.save(documentType)));

        this.contractTrade = this.contractTradeRepository.save(new ContractTrade("12345",
                        this.albiniLogin.getUser().getCompany(),
                        this.userLogin.getUser().getCompany(),
                        documentTypes.get(0)));

        contractPositionsSaved = Arrays.asList(
                new ContractPosition(materials.get(0), 12.2, 100.2, "description", units.get(1)),
                new ContractPosition(materials.get(1), 8.2, 80.5, "description", units.get(2)),
                new ContractPosition(materials.get(2), 25.7, 42.7, "description", units.get(1)));
        contractPositionsSaved.forEach(contractPosition -> contractPositions.add(contractPositionRepository.save(contractPosition)));

        this.orderTrade = this.orderTradeRepository.save(new OrderTrade("1234",
                        this.albiniLogin.getUser().getCompany(),
                        this.userLogin.getUser().getCompany(),
                        this.contractTrade, documentTypes.get(1)));

        orderPositionsSaved = Arrays.asList(
                new OrderPosition(materials.get(0), 12.2, 80.9, "description", units.get(0)),
                new OrderPosition(materials.get(2), 16.3, 45.6, "description", units.get(2)),
                new OrderPosition(materials.get(1), 3.4, 209.3, "description", units.get(1)));
        orderPositionsSaved.forEach(orderPosition -> orderPositions.add(orderPositionRepository.save(orderPosition)));

        this.shippingTrade = this.shippingTradeRepository.save(new ShippingTrade("123",
                        this.albiniLogin.getUser().getCompany(),
                        this.userLogin.getUser().getCompany(),
                        this.orderTrade, documentTypes.get(1)));


        shippingPositionsSaved = Arrays.asList(
                new ShippingPosition(materials.get(2), 12.2, 75.3, "description", units.get(0)),
                new ShippingPosition(materials.get(0), 35.2, 357.9, "description", units.get(0)),
                new ShippingPosition(materials.get(1), 180.4, 32.4, "description", units.get(1)));
        shippingPositionsSaved.forEach(shippingPosition -> shippingPositions.add(shippingPositionRepository.save(shippingPosition)));

        assessmentType = assessmentTypeRepository.save(new AssessmentType("Assessment type test"));
        CertificationTransaction certificationTransaction =  new CertificationTransaction("6543", this.albiniLogin.getUser().getCompany(), this.userLogin.getUser().getCompany(), documentTypes.get(0), assessmentType, "certificateReferenceNumber", CertificationSubject.SCOPE);
        certificationTransaction.setApprover(albiniLogin.getUser().getCompany());
        this.certificationTransaction = certificationTransactionRepository.save(
                certificationTransaction
        );

        doNothing().when(mailService).sendMail(isA(String[].class), isA(String.class), isA(String.class));
    }

    @Test
    // per ripulire il contesto del db, in modo tale che le posizioni che vengono aggiunte al db abbiano un id incrementale che parte da 1
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void confirmContractTrade() throws Exception {
        List<PositionRequest> positionRequests = Arrays.asList(
                new PositionRequest(1L, new MaterialPresentable(materials.get(1))),
                new PositionRequest(2L, new MaterialPresentable(materials.get(2))),
                new PositionRequest(3L, new MaterialPresentable(materials.get(0)))
        );
        ConfirmationTransactionRequest confirmationTransactionRequest = new ConfirmationTransactionRequest(
                "Consignee ref number", null, TransactionStatus.ACCEPTED, null, positionRequests);
        this.mock().perform(post(this.albiniLogin.getUsername(), PATH + "/"+this.contractTrade.getId()+"/confirmation?type=contract", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", is("Transaction successfully confirmed")));

        assertEquals("Consignee ref number", contractTradeRepository.getOne(this.contractTrade.getId()).getConsigneeReferenceNumber());
        assertEquals(contractPositionRepository.findAll().get(1).getConsigneeMaterial().getName(), positionRequests.get(1).getMaterial().getName());

        // test REFUSED transaction -> no positions will be updated
        confirmationTransactionRequest = new ConfirmationTransactionRequest(
                "Consignee ref number", null, TransactionStatus.REFUSED, null, Collections.singletonList(new PositionRequest(1L, new MaterialPresentable(materials.get(0)))));
        this.mock().perform(post(this.albiniLogin.getUsername(), PATH + "/"+this.contractTrade.getId()+"/confirmation?type=contract", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", is("Transaction successfully confirmed")));
        assertEquals("Consignee ref number", contractTradeRepository.getOne(this.contractTrade.getId()).getConsigneeReferenceNumber());
        assertNotEquals(contractPositionRepository.findAll().get(0).getConsigneeMaterial().getName(), materials.get(0).getName());

    }

//    @Test
//    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
//    public void confirmContractTradeNotAuthorized() throws Exception {
//        List<PositionRequest> positionRequests = Arrays.asList(
//                new PositionRequest(1L, new MaterialPresentable(materials.get(1))),
//                new PositionRequest(2L, new MaterialPresentable(materials.get(2))),
//                new PositionRequest(3L, new MaterialPresentable(materials.get(0)))
//        );
//        ConfirmationTransactionRequest confirmationTransactionRequest = new ConfirmationTransactionRequest(
//                "Consignee ref number", "Certification ref number", TransactionStatus.ACCEPTED, null, positionRequests);
//
//        this.mock().perform(post(this.userCertifierLogin.getUsername(), PATH + "/"+this.contractTrade.getId()+"/confirmation?type=contract", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
//                .andExpect(status().isForbidden());
//
//        this.mock().perform(post(this.userLogin.getUsername(), PATH + "/"+this.contractTrade.getId()+"/confirmation?type=contract", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
//                .andExpect(status().isUnauthorized());
//    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void confirmOrderTrade() throws Exception {
        List<PositionRequest> positionRequests = Arrays.asList(
                new PositionRequest(1L, new MaterialPresentable(materials.get(1))),
                new PositionRequest(2L, new MaterialPresentable(materials.get(2))),
                new PositionRequest(3L, new MaterialPresentable(materials.get(0)))
        );
        ConfirmationTransactionRequest confirmationTransactionRequest = new ConfirmationTransactionRequest(
                "Consignee ref number", null, TransactionStatus.ACCEPTED, null, positionRequests);
        this.mock().perform(post(this.albiniLogin.getUsername(), PATH + "/"+this.orderTrade.getId()+"/confirmation?type=order", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", is("Transaction successfully confirmed")));
        assertEquals("Consignee ref number", orderTradeRepository.getOne(this.orderTrade.getId()).getConsigneeReferenceNumber());
        assertEquals(orderPositionRepository.findAll().get(1).getConsigneeMaterial().getName(), positionRequests.get(1).getMaterial().getName());

        // test REFUSED transaction -> no positions will be updated
        confirmationTransactionRequest = new ConfirmationTransactionRequest(
                "Consignee ref number", null, TransactionStatus.REFUSED, null, Collections.singletonList(new PositionRequest(1L, new MaterialPresentable(materials.get(0)))));
        this.mock().perform(post(this.albiniLogin.getUsername(), PATH + "/"+this.orderTrade.getId()+"/confirmation?type=order", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", is("Transaction successfully confirmed")));
        assertEquals("Consignee ref number", orderTradeRepository.getOne(this.orderTrade.getId()).getConsigneeReferenceNumber());
        assertNotEquals(orderPositionRepository.findAll().get(0).getConsigneeMaterial().getName(), materials.get(0).getName());
    }

//    @Test
//    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
//    public void confirmOrderTradeNotAuthorized() throws Exception {
//        List<PositionRequest> positionRequests = Arrays.asList(
//                new PositionRequest(1L, new MaterialPresentable(materials.get(1))),
//                new PositionRequest(2L, new MaterialPresentable(materials.get(2))),
//                new PositionRequest(3L, new MaterialPresentable(materials.get(0)))
//        );
//        ConfirmationTransactionRequest confirmationTransactionRequest = new ConfirmationTransactionRequest(
//                "Consignee ref number", null, TransactionStatus.ACCEPTED, null, positionRequests);
//
//        this.mock().perform(post(this.userCertifierLogin.getUsername(), PATH + "/"+this.orderTrade.getId()+"/confirmation?type=order", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
//                .andExpect(status().isForbidden());
//
//        this.mock().perform(post(this.userLogin.getUsername(), PATH + "/"+this.orderTrade.getId()+"/confirmation?type=order", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
//                .andExpect(status().isUnauthorized());
//    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void confirmShippingTrade() throws Exception {
        List<PositionRequest> positionRequests = Arrays.asList(
                new PositionRequest(1L, new MaterialPresentable(materials.get(1))),
                new PositionRequest(2L, new MaterialPresentable(materials.get(2))),
                new PositionRequest(3L, new MaterialPresentable(materials.get(0)))
        );
        ConfirmationTransactionRequest confirmationTransactionRequest = new ConfirmationTransactionRequest(
                "Consignee ref number", null, TransactionStatus.ACCEPTED, null, positionRequests);
        this.mock().perform(post(this.albiniLogin.getUsername(), PATH + "/"+this.shippingTrade.getId()+"/confirmation?type=shipping", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", is("Transaction successfully confirmed")));
        assertEquals("Consignee ref number", shippingTradeRepository.getOne(this.shippingTrade.getId()).getConsigneeReferenceNumber());
        assertEquals(shippingPositionRepository.findAll().get(0).getConsigneeMaterial().getName(), positionRequests.get(0).getMaterial().getName());

        // test REFUSED transaction -> no positions will be updated
        confirmationTransactionRequest = new ConfirmationTransactionRequest(
                "Consignee ref number", null, TransactionStatus.REFUSED, null, Collections.singletonList(new PositionRequest(1L, new MaterialPresentable(materials.get(0)))));
        this.mock().perform(post(this.albiniLogin.getUsername(), PATH + "/"+this.shippingTrade.getId()+"/confirmation?type=shipping", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", is("Transaction successfully confirmed")));
        assertEquals("Consignee ref number", shippingTradeRepository.getOne(this.shippingTrade.getId()).getConsigneeReferenceNumber());
        assertNotEquals(shippingPositionRepository.findAll().get(0).getConsigneeMaterial().getName(), materials.get(0).getName());
    }

//    @Test
//    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
//    public void confirmShippingTradeNotAuthorized() throws Exception {
//        List<PositionRequest> positionRequests = Arrays.asList(
//                new PositionRequest(1L, new MaterialPresentable(materials.get(1))),
//                new PositionRequest(2L, new MaterialPresentable(materials.get(2))),
//                new PositionRequest(3L, new MaterialPresentable(materials.get(0)))
//        );
//        ConfirmationTransactionRequest confirmationTransactionRequest = new ConfirmationTransactionRequest(
//                "Consignee ref number", null, TransactionStatus.ACCEPTED, null, positionRequests);
//
//        this.mock().perform(post(this.userCertifierLogin.getUsername(), PATH + "/"+this.shippingTrade.getId()+"/confirmation?type=shipping", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
//                .andExpect(status().isForbidden());
//
//        this.mock().perform(post(this.userLogin.getUsername(), PATH + "/"+this.shippingTrade.getId()+"/confirmation?type=shipping", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
//                .andExpect(status().isUnauthorized());
//    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void confirmCertificateTransaction() throws Exception {
        ConfirmationTransactionRequest confirmationTransactionRequest = new ConfirmationTransactionRequest(
                "", null, TransactionStatus.REFUSED, null, new ArrayList<>());
        this.mock().perform(post(this.albiniLogin.getUsername(), PATH + "/"+this.certificationTransaction.getId()+"/confirmation?type=certification", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$", is("Transaction successfully confirmed")));
        assertNull(certificationTransactionRepository.getOne(this.certificationTransaction.getId()).getConsigneeReferenceNumber());
        assertEquals(assessmentType.getName(), certificationTransactionRepository.getOne(1L).getAssessmentType().getName());
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void confirmCertificateTransactionNotAuthorized() throws Exception {
        ConfirmationTransactionRequest confirmationTransactionRequest = new ConfirmationTransactionRequest(
                "", null, TransactionStatus.REFUSED, null, new ArrayList<>());
        this.mock().perform(post(this.userCertifierLogin.getUsername(), PATH + "/"+this.certificationTransaction.getId()+"/confirmation?type=certification", true, new ObjectMapper().writeValueAsString(confirmationTransactionRequest)))
                .andExpect(status().isUnauthorized());
    }
}
