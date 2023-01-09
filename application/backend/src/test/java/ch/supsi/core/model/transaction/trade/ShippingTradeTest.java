package ch.supsi.core.model.transaction.trade;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.processing_standard.ProcessingStandard;
import ch.supsi.model.transaction.trade.OrderTrade;
import ch.supsi.model.transaction.trade.ShippingTrade;
import ch.supsi.model.transaction.TransactionStatus;

import java.util.Date;

import static org.junit.Assert.*;
import static org.junit.Assert.assertTrue;

public class ShippingTradeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        ShippingTrade shippingTrade = new ShippingTrade();
        assertNull(shippingTrade.getId());
        assertNull(shippingTrade.getContractor());
        assertNull(shippingTrade.getConsignee());
        assertNull(shippingTrade.getContractorEmail());
        assertNull(shippingTrade.getConsigneeEmail());
        assertNull(shippingTrade.getIsSubcontracting());
        assertNull(shippingTrade.getContractorDate());
        assertNull(shippingTrade.getConsigneeDate());
        assertNull(shippingTrade.getContractorDate());
        assertNull(shippingTrade.getDocumentType());
        assertNull(shippingTrade.getNotes());
        assertNull(shippingTrade.getConsigneeReferenceNumber());
        assertNull(shippingTrade.getContractorReferenceNumber());
        assertNull(shippingTrade.getValidFrom());
        assertNull(shippingTrade.getValidUntil());
        assertNull(shippingTrade.getSupplyChainVisibilityLevel());
        assertNull(shippingTrade.getB2bLevel());
        assertNull(shippingTrade.getStatus());
        assertNull(shippingTrade.getDocumentApproval());
        assertNull(shippingTrade.getToBeContacted());
        assertNull(shippingTrade.getConsigneeParentReferenceNumber());
        assertNull(shippingTrade.getContractorParentReference());
        assertNull(shippingTrade.getDocument());
        assertNull(shippingTrade.getProcessingStandard());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ShippingTrade trade = new ShippingTrade();
        trade.setConsigneeParentReferenceNumber("1234");
        assertEquals(trade.getConsigneeParentReferenceNumber(), "1234");
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
        trade.setConsigneeParentReferenceNumber("1234");
        assertEquals(trade.getConsigneeParentReferenceNumber(), "1234");
        OrderTrade orderTrade = new OrderTrade();
        trade.setContractorParentReference(orderTrade);
        assertEquals(trade.getContractorParentReference(), orderTrade);
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
