package ch.supsi.core.request.transaction.trade;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.transaction.trade.UpdateTradeRequest;

import static org.junit.Assert.assertEquals;

public class UpdateTradeRequestTest extends UneceRequestTestTemplate {

    private UpdateTradeRequest updateTradeRequest;

    @Override
    public void init() {
        updateTradeRequest = new UpdateTradeRequest("proc standard 1", "tradeType");
    }

    @Override
    public void testGetters() {
        assertEquals("proc standard 1", updateTradeRequest.getProcessingStandardName());
        assertEquals("tradeType", updateTradeRequest.getTradeType());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        updateTradeRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        updateTradeRequest.setTradeType(null);
        try {
            updateTradeRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
