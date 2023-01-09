package ch.supsi.core.model.transaction.trade;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.model.transaction.trade.ContractTrade;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.TransactionStatus;

import java.util.Date;

import static org.junit.Assert.*;

public class OrderTradeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        OrderTrade orderTrade = new OrderTrade();
        assertNull(orderTrade.getId());
        assertNull(orderTrade.getContractor());
        assertNull(orderTrade.getConsignee());
        assertNull(orderTrade.getContractorEmail());
        assertNull(orderTrade.getConsigneeEmail());
        assertNull(orderTrade.getIsSubcontracting());
        assertNull(orderTrade.getContractorDate());
        assertNull(orderTrade.getConsigneeDate());
        assertNull(orderTrade.getContractorDate());
        assertNull(orderTrade.getDocumentType());
        assertNull(orderTrade.getNotes());
        assertNull(orderTrade.getConsigneeReferenceNumber());
        assertNull(orderTrade.getContractorReferenceNumber());
        assertNull(orderTrade.getConsigneeRootReferenceNumber());
        assertNull(orderTrade.getContractorRootReference());
        assertNull(orderTrade.getValidFrom());
        assertNull(orderTrade.getValidUntil());
        assertNull(orderTrade.getSupplyChainVisibilityLevel());
        assertNull(orderTrade.getB2bLevel());
        assertNull(orderTrade.getStatus());
        assertNull(orderTrade.getDocumentApproval());
        assertNull(orderTrade.getToBeContacted());
        assertNull(orderTrade.getConsigneeRootReferenceNumber());
        assertNull(orderTrade.getDocument());
        assertNull(orderTrade.getProcessingStandard());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        OrderTrade trade = new OrderTrade();
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
        Date date = new Date();
        trade.setContractorDate(date);
        assertEquals(trade.getContractorDate(), date);
        trade.setConsigneeDate(date);
        assertEquals(trade.getConsigneeDate(), date);
        trade.setContractorDate(date);
        assertEquals(trade.getContractorDate(), date);
        DocumentType documentType = new DocumentType();
        trade.setDocumentType(documentType);
        assertEquals(trade.getDocumentType(), documentType);
        trade.setNotes("notes");
        assertEquals(trade.getNotes(), "notes");
        trade.setConsigneeReferenceNumber("1234");
        assertEquals(trade.getConsigneeReferenceNumber(), "1234");
        trade.setContractorReferenceNumber("12345");
        assertEquals(trade.getContractorReferenceNumber(), "12345");
        trade.setConsigneeRootReferenceNumber("1234");
        assertEquals(trade.getConsigneeRootReferenceNumber(), "1234");
        ContractTrade contractTrade = new ContractTrade();
        trade.setContractorRootReference(contractTrade);
        assertEquals(trade.getContractorRootReference(), contractTrade);
        trade.setValidFrom(date);
        assertEquals(trade.getValidFrom(), date);
        trade.setValidUntil(date);
        assertEquals(trade.getValidUntil(), date);
        trade.setSupplyChainVisibilityLevel(4);
        assertEquals(trade.getSupplyChainVisibilityLevel(), Integer.valueOf(4));
        trade.setB2bLevel(3);
        assertEquals(trade.getB2bLevel(), Integer.valueOf(3));
        trade.setStatus(TransactionStatus.ACCEPTED);
        assertEquals(trade.getStatus(), TransactionStatus.ACCEPTED);
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
