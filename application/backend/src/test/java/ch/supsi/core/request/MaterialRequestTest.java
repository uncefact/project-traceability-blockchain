package ch.supsi.core.request;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.MaterialRequest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class MaterialRequestTest extends UneceRequestTestTemplate {

    private MaterialRequest materialRequest;

    @Override
    public void init() {
        materialRequest = new MaterialRequest(
                "materialName",
                "companyName",
                false
        );
    }

    @Override
    public void testGetters() {
        assertEquals("materialName", materialRequest.getName());
        assertEquals("companyName", materialRequest.getCompanyName());
        assertFalse(materialRequest.isInput());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        materialRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        materialRequest.setCompanyName(null);
        try {
            materialRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
