package ch.supsi.core.request.transaction.trade;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.position.ShippingPosition;
import ch.supsi.request.DocumentRequest;
import ch.supsi.request.transaction.trade.OrderRequest;
import ch.supsi.request.transaction.trade.ShippingRequest;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class ShippingRequestTest extends UneceRequestTestTemplate {

    private ShippingRequest shippingRequest;
    private List<ShippingPosition> positions;
    private DocumentRequest documentRequest;
    private Date validFrom, validUntil;

    @Override
    public void init() {
        positions = Collections.singletonList(new ShippingPosition());
        documentRequest = new DocumentRequest("", "", "");
        validFrom = new Date();
        validUntil = new Date();
        shippingRequest = new ShippingRequest(
                "consigneeName",
                "consignee@mail.ch",
                validFrom,
                validUntil,
                "documentType",
                documentRequest,
                "Processing standard 1",
                "notes",
                "contractorReferenceNumber",
                "contractorParentReferenceNumber",
                positions,
                false
        );
    }

    @Override
    public void testGetters() {
        assertEquals("consigneeName", shippingRequest.getConsigneeCompanyName());
        assertEquals("consignee@mail.ch", shippingRequest.getConsigneeEmail());
        assertEquals(validFrom, shippingRequest.getValidFrom());
        assertEquals(validUntil, shippingRequest.getValidUntil());
        assertEquals("documentType", shippingRequest.getDocumentTypeCode());
        assertEquals(documentRequest, shippingRequest.getDocumentUpload());
        assertEquals("Processing standard 1", shippingRequest.getProcessingStandardName());
        assertEquals("contractorReferenceNumber", shippingRequest.getContractorReferenceNumber());
        assertEquals("contractorParentReferenceNumber", shippingRequest.getContractorParentReferenceNumber());
        assertEquals(positions, shippingRequest.getPositions());
        assertFalse(shippingRequest.isInvitation());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        shippingRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        shippingRequest.setPositions(null);
        try {
            shippingRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
