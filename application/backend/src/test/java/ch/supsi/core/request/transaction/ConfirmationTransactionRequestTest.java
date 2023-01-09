package ch.supsi.core.request.transaction;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.request.position.PositionRequest;
import ch.supsi.request.transaction.ConfirmationTransactionRequest;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class ConfirmationTransactionRequestTest extends UneceRequestTestTemplate {

    private ConfirmationTransactionRequest confirmationTransactionRequest;
    private List<PositionRequest> positions;
    private Date consigneeDate;

    @Override
    public void init() {
        consigneeDate = new Date();
        positions = Collections.singletonList(new PositionRequest());
        confirmationTransactionRequest = new ConfirmationTransactionRequest(
                "consigneeReferenceNumber",
                "certificationReferenceNumber",
                TransactionStatus.ACCEPTED,
                consigneeDate,
                positions
        );
    }

    @Override
    public void testGetters() {
        assertEquals("consigneeReferenceNumber", confirmationTransactionRequest.getConsigneeReferenceNumber());
        assertEquals("certificationReferenceNumber", confirmationTransactionRequest.getCertificationReferenceNumber());
        assertEquals(TransactionStatus.ACCEPTED, confirmationTransactionRequest.getTransactionStatus());
        assertEquals(consigneeDate, confirmationTransactionRequest.getConsigneeDate());
        assertEquals(positions, confirmationTransactionRequest.getPositions());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        confirmationTransactionRequest.setCertificationReferenceNumber(null);
        confirmationTransactionRequest.setConsigneeDate(null);
        confirmationTransactionRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        confirmationTransactionRequest.setCertificationReferenceNumber(null);
        confirmationTransactionRequest.setConsigneeDate(null);
        try {
            confirmationTransactionRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
