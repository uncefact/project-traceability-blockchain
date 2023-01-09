package ch.supsi.core.controller;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.company.Company;
import ch.supsi.model.Document;
import ch.supsi.model.login.Login;
import ch.supsi.model.transaction.certification.*;
import ch.supsi.model.transaction.trade.ContractDocumentType;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.trade.OrderDocumentType;
import ch.supsi.model.transaction.trade.ShippingDocumentType;
import ch.supsi.repository.company.CompanyRepository;
import ch.supsi.repository.LoginRepository;
import ch.supsi.repository.transaction.certificate.CertificationTransactionRepository;
import ch.supsi.repository.transaction.certificate.MaterialCertificationDocumentTypeRepository;
import ch.supsi.repository.transaction.certificate.ScopeCertificationDocumentTypeRepository;
import ch.supsi.repository.transaction.certificate.SelfCertificationDocumentTypeRepository;
import ch.supsi.repository.transaction.certificate.TransactionCertificationDocumentTypeRepository;
import ch.supsi.repository.transaction.trade.ContractDocumentTypeRepository;
import ch.supsi.repository.transaction.trade.ContractTradeRepository;
import ch.supsi.repository.transaction.trade.OrderDocumentTypeRepository;
import ch.supsi.repository.transaction.trade.ShippingDocumentTypeRepository;
import ch.supsi.request.DocumentRequest;
import ch.supsi.service.DocumentService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.web.util.NestedServletException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class DocumentControllerTest extends UneceControllerTestTemplate {

    @Value("${unece.documents-storage-path}")
    private String documentsPath;

    @Autowired
    private LoginRepository loginRepository;
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
    private SelfCertificationDocumentTypeRepository selfCertificationDocumentTypeRepository;

    @Autowired
    private ContractTradeRepository contractTradeRepository;

    @Autowired
    private DocumentService documentService;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CertificationTransactionRepository certificationTransactionRepository;

    private final String PATH = "/documents";

    private Login userLogin;
    private List<DocumentRequest> documentRequests = null;
    private List<Company> companies = null;
    private List<Document> documents;

    @Before
    public void init(){
        documents = new ArrayList<>();
        userLogin = loginRepository.findLoginByUsernameAndExpiredIsNull("user");
        companies = companyRepository.findAll();

        try {
            documentRequests = Utils.loadDocumentRequestsFromFiles(documentsPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
        documentRequests.forEach(documentRequest -> documents.add(documentService.saveDocumentFromRequest(documentRequest)));

        contractTradeRepository.save(new ContractTrade(userLogin.getUser().getCompany(), companies.get(1), documents.get(0)));

        CertificationTransaction certificationTransaction = new CertificationTransaction();
        certificationTransaction.setDocument(documents.get(0));
        certificationTransaction.setContractor(userLogin.getUser().getCompany());
        certificationTransaction.setConsignee(userLogin.getUser().getCompany());
        certificationTransactionRepository.save(certificationTransaction);
    }

    @Test
    public void getContractDocumentTypes() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/types?type=contract", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(contractDocumentTypeRepository.findAll().size())))
                .andExpect(jsonPath("$.[*].code", hasItems(contractDocumentTypeRepository.findAll().stream().map(ContractDocumentType::getCode).toArray(String[]::new))));
    }

    @Test
    public void getOrderDocumentTypes() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/types?type=order", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(orderDocumentTypeRepository.findAll().size())))
                .andExpect(jsonPath("$.[*].code", hasItems(orderDocumentTypeRepository.findAll().stream().map(OrderDocumentType::getCode).toArray(String[]::new))));
    }

    @Test
    public void getShippingDocumentTypes() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/types?type=shipping", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(shippingDocumentTypeRepository.findAll().size())))
                .andExpect(jsonPath("$.[*].code", hasItems(shippingDocumentTypeRepository.findAll().stream().map(ShippingDocumentType::getCode).toArray(String[]::new))));
    }

    @Test
    public void getScopeCertificationDocumentTypes() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/types?type=scope_certification", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(scopeCertificationDocumentTypeRepository.findAll().size())))
                .andExpect(jsonPath("$.[*].code", hasItems(scopeCertificationDocumentTypeRepository.findAll().stream().map(ScopeCertificationDocumentType::getCode).toArray(String[]::new))));
    }

    @Test
    public void getTransactionCertificationDocumentTypes() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/types?type=transaction_certification", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(transactionCertificationDocumentTypeRepository.findAll().size())))
                .andExpect(jsonPath("$.[*].code", hasItems(transactionCertificationDocumentTypeRepository.findAll().stream().map(TransactionCertificationDocumentType::getCode).toArray(String[]::new))));
    }

    @Test
    public void getMaterialCertificationDocumentTypes() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/types?type=material_certification", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(materialCertificationDocumentTypeRepository.findAll().size())))
                .andExpect(jsonPath("$.[*].code", hasItems(materialCertificationDocumentTypeRepository.findAll().stream().map(MaterialCertificationDocumentType::getCode).toArray(String[]::new))));
    }

    @Test
    public void getDocumentTest() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/" + documents.get(0).getId(), true))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + documents.get(0).getFileName() + "\""));
    }

    @Test(expected = NestedServletException.class)
    public void getDocumentFailedTest() throws Exception {
        // document not found
        this.mock().perform(get(userLogin.getUsername(), PATH + "/20", true))
                .andExpect(status().isNotFound())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.DOCUMENT_NOT_FOUND.getMessage(), result.getResolvedException().getMessage()));

        // document view not authorized
        this.mock().perform(get(userLogin.getUsername(), PATH + "/" + documents.get(0).getId(), true))
                .andExpect(status().isForbidden())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof UneceException))
                .andExpect(result -> assertEquals(UneceError.FORBIDDEN.getMessage(), result.getResolvedException().getMessage()));

        //TODO Test with supply chain logic (at 07/06 no supply chain test are implemented)
    }

    @Test
    public void getSelfCertificationDocumentTypes() throws Exception {
        this.mock().perform(get(userLogin.getUsername(), PATH + "/types?type=self_certification", true))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(selfCertificationDocumentTypeRepository.findAll().size())))
                .andExpect(jsonPath("$.[*].code", hasItems(selfCertificationDocumentTypeRepository.findAll().stream().map(SelfCertificationDocumentType::getCode).toArray(String[]::new))));
    }

}
