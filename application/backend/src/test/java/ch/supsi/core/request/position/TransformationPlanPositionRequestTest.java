package ch.supsi.core.request.position;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.position.TransformationPlanPositionRequest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class TransformationPlanPositionRequestTest extends UneceRequestTestTemplate {

    private TransformationPlanPositionRequest transformationPlanPositionRequest;

    @Override
    public void init() {
        transformationPlanPositionRequest = new TransformationPlanPositionRequest(
                1L,
                10.2
        );
    }

    @Override
    public void testGetters() {
        assertEquals(Long.valueOf(1L), transformationPlanPositionRequest.getContractorMaterialId());
        assertEquals(Double.valueOf(10.2), transformationPlanPositionRequest.getQuantity());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        transformationPlanPositionRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        transformationPlanPositionRequest.setQuantity(null);
        try {
            transformationPlanPositionRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
