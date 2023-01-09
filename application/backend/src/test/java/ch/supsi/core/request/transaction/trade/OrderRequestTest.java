package ch.supsi.core.request.transaction.trade;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.position.OrderPosition;
import ch.supsi.request.DocumentRequest;
import ch.supsi.request.transaction.trade.ContractRequest;
import ch.supsi.request.transaction.trade.OrderRequest;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;

public class OrderRequestTest extends UneceRequestTestTemplate {

    private OrderRequest orderRequest;
    private List<OrderPosition> positions;
    private DocumentRequest documentRequest;
    private Date validFrom, validUntil;

    @Override
    public void init() {
        positions = Collections.singletonList(new OrderPosition());
        documentRequest = new DocumentRequest("", "", "");
        validFrom = new Date();
        validUntil = new Date();
        orderRequest = new OrderRequest(
                "consigneeName",
                "consignee@mail.ch",
                validFrom,
                validUntil,
                "documentTypeCode",
                documentRequest,
                "Processing standard 1",
                "notes",
                "contractorReferenceNumber",
                "contractorRootReferenceNumber",
                positions,
                false
        );
    }

    @Override
    public void testGetters() {
        assertEquals("consigneeName", orderRequest.getConsigneeCompanyName());
        assertEquals("consignee@mail.ch", orderRequest.getConsigneeEmail());
        assertEquals(validFrom, orderRequest.getValidFrom());
        assertEquals(validUntil, orderRequest.getValidUntil());
        assertEquals("documentTypeCode", orderRequest.getDocumentTypeCode());
        assertEquals(documentRequest, orderRequest.getDocumentUpload());
        assertEquals("Processing standard 1", orderRequest.getProcessingStandardName());
        assertEquals("contractorReferenceNumber", orderRequest.getContractorReferenceNumber());
        assertEquals("contractorRootReferenceNumber", orderRequest.getContractorRootReferenceNumber());
        assertEquals(positions, orderRequest.getPositions());
        assertFalse(orderRequest.isInvitation());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        orderRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        orderRequest.setContractorRootReferenceNumber(null);
        try {
            orderRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
