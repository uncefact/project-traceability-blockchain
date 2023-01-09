package ch.supsi.core.request.transformation_plan;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.transformation_plan.TransformationPlanRequest;
import ch.supsi.request.position.TransformationPlanPositionRequest;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class TransformationPlanRequestTest extends UneceRequestTestTemplate {

    private TransformationPlanRequest transformationPlanRequest;
    private List<TransformationPlanPositionRequest> transformationPlanPositionRequestList;
    private Date date;

    @Override
    public void init() {
        date = new Date();
        transformationPlanPositionRequestList = Collections.singletonList(new TransformationPlanPositionRequest(1L, 10.0));
        transformationPlanRequest = new TransformationPlanRequest(
                "transformationPlanName",
                transformationPlanPositionRequestList,
                Collections.singletonList("code"),
                Collections.singletonList("prStandard"),
                "productCategoryCode",
                date,
                date,
                "notes",
                "traceabilityLevelNameTest",
                "transparencyLevelNameTest"
        );
    }

    @Override
    public void testGetters() {
        assertEquals("transformationPlanName", transformationPlanRequest.getName());
        assertEquals(transformationPlanPositionRequestList, transformationPlanRequest.getPositionRequestList());
        assertEquals(Collections.singletonList("code"), transformationPlanRequest.getProcessCodeList());
        assertEquals(Collections.singletonList("prStandard"), transformationPlanRequest.getProcessingStandardList());
        assertEquals(date, transformationPlanRequest.getValidFrom());
        assertEquals(date, transformationPlanRequest.getValidUntil());
        assertEquals("notes", transformationPlanRequest.getNotes());
        assertEquals("traceabilityLevelNameTest", transformationPlanRequest.getTraceabilityLevelName());
        assertEquals("transparencyLevelNameTest", transformationPlanRequest.getTransparencyLevelName());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        transformationPlanRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        transformationPlanRequest.setPositionRequestList(null);
        try {
            transformationPlanRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}