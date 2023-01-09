package ch.supsi.core.request.position;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.presentable.MaterialPresentable;
import ch.supsi.request.position.PositionRequest;

import static org.junit.Assert.assertEquals;

public class PositionRequestTest extends UneceRequestTestTemplate {

    private PositionRequest positionRequest;
    private MaterialPresentable materialPresentable;

    @Override
    public void init() {
        materialPresentable = new MaterialPresentable();
        positionRequest = new PositionRequest(
                1L,
                materialPresentable
        );
    }

    @Override
    public void testGetters() {
        assertEquals(Long.valueOf(1L), positionRequest.getId());
        assertEquals(materialPresentable, positionRequest.getMaterial());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        positionRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        positionRequest.setId(null);
        try {
            positionRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
