package ch.supsi.core.model.transaction.trade;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.company.Company;
import ch.supsi.model.Document;
import ch.supsi.model.DocumentType;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.TransactionStatus;

import static org.junit.Assert.*;

public class ContractTradeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        ContractTrade contractTrade = new ContractTrade();
        assertNull(contractTrade.getId());
        assertNull(contractTrade.getContractor());
        assertNull(contractTrade.getConsignee());
        assertNull(contractTrade.getContractorEmail());
        assertNull(contractTrade.getConsigneeEmail());
        assertNull(contractTrade.getIsSubcontracting());
        assertNull(contractTrade.getConsigneeDate());
        assertNull(contractTrade.getContractorDate());
        assertNull(contractTrade.getDocumentType());
        assertNull(contractTrade.getNotes());
        assertNull(contractTrade.getConsigneeReferenceNumber());
        assertNull(contractTrade.getContractorReferenceNumber());
        assertNull(contractTrade.getValidFrom());
        assertNull(contractTrade.getValidUntil());
        assertNull(contractTrade.getSupplyChainVisibilityLevel());
        assertNull(contractTrade.getB2bLevel());
        assertNull(contractTrade.getStatus());
        assertNull(contractTrade.getDocumentApproval());
        assertNull(contractTrade.getToBeContacted());
        assertNull(contractTrade.getDocument());
        assertNull(contractTrade.getProcessingStandard());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ContractTrade trade = new ContractTrade();
        Company consignee = new Company(), contractor = new Company(), certifier = new Company();
        trade.setConsignee(consignee);
        assertEquals(trade.getConsignee(), consignee);
        trade.setContractor(contractor);
        assertEquals(trade.getContractor(), contractor);
        trade.setContractorEmail("test@test.ch");
        assertEquals(trade.getContractorEmail(), "test@test.ch");
        trade.setConsigneeEmail("test@test.ch");
        assertEquals(trade.getConsigneeEmail(), "test@test.ch");
        trade.setIsSubcontracting(false);
        assertFalse(trade.getIsSubcontracting());
        DocumentType documentType = new DocumentType();
        trade.setDocumentType(documentType);
        assertEquals(trade.getDocumentType(), documentType);
        trade.setNotes("notes");
        assertEquals(trade.getNotes(), "notes");
        trade.setConsigneeReferenceNumber("1234");
        assertEquals(trade.getConsigneeReferenceNumber(), "1234");
        trade.setContractorReferenceNumber("12345");
        assertEquals(trade.getContractorReferenceNumber(), "12345");
        trade.setSupplyChainVisibilityLevel(4);
        assertEquals(trade.getSupplyChainVisibilityLevel(), Integer.valueOf(4));
        trade.setB2bLevel(3);
        assertEquals(trade.getB2bLevel(), Integer.valueOf(3));
        trade.setStatus(TransactionStatus.PENDING);
        assertEquals(trade.getStatus(), TransactionStatus.PENDING);
        trade.setDocumentApproval("approval");
        assertEquals(trade.getDocumentApproval(), "approval");
        trade.setProcessStandard("pr standard");
        assertEquals(trade.getProcessStandard(), "pr standard");
        trade.setProcessAmount(2.3);
        assertEquals(trade.getProcessAmount(), Double.valueOf(2.3));
        trade.setToBeContacted(true);
        assertTrue(trade.getToBeContacted());
        trade.setContactFirstName("first name");
        assertEquals(trade.getContactFirstName(), "first name");
        trade.setContactLastName("last name");
        assertEquals(trade.getContactLastName(), "last name");
        trade.setContactPartnerName("name");
        assertEquals(trade.getContactPartnerName(), "name");
        trade.setContactEmail("contact@test.ch");
        assertEquals(trade.getContactEmail(), "contact@test.ch");
        Document document = new Document();
        trade.setDocument(document);
        assertEquals(document, trade.getDocument());
        ProcessingStandard processingStandard = new ProcessingStandard();
        trade.setProcessingStandard(processingStandard);
        assertEquals(processingStandard, trade.getProcessingStandard());
    }
}
