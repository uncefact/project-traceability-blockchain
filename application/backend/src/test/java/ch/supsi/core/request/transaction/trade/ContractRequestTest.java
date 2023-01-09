package ch.supsi.core.request.transaction.trade;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.position.ContractPosition;
import ch.supsi.request.DocumentRequest;
import ch.supsi.request.transaction.trade.ContractRequest;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class ContractRequestTest extends UneceRequestTestTemplate {

    private ContractRequest contractRequest;
    private List<ContractPosition> positions;
    private DocumentRequest documentRequest;
    private Date validFrom, validUntil;

    @Override
    public void init() {
        positions = Collections.singletonList(new ContractPosition());
        documentRequest = new DocumentRequest("", "", "");
        validFrom = new Date();
        validUntil = new Date();
        contractRequest = new ContractRequest(
                "consigneeName",
                "consignee@mail.ch",
                validFrom,
                validUntil,
                "documentType",
                documentRequest,
                "Processing standard 1",
                "notes",
                "contractorReferenceNumber",
                positions,
                false
        );
    }

    @Override
    public void testGetters() {
        assertEquals("consigneeName", contractRequest.getConsigneeCompanyName());
        assertEquals("consignee@mail.ch", contractRequest.getConsigneeEmail());
        assertEquals(validFrom, contractRequest.getValidFrom());
        assertEquals(validUntil, contractRequest.getValidUntil());
        assertEquals("documentType", contractRequest.getDocumentTypeCode());
        assertEquals(documentRequest, contractRequest.getDocumentUpload());
        assertEquals("Processing standard 1", contractRequest.getProcessingStandardName());
        assertEquals("notes", contractRequest.getNotes());
        assertEquals("contractorReferenceNumber", contractRequest.getContractorReferenceNumber());
        assertEquals(positions, contractRequest.getPositions());
        assertFalse(contractRequest.isInvitation());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        contractRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        contractRequest.setPositions(null);
        try {
            contractRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
