package ch.supsi.core.request.transformation_plan;

import ch.supsi.core.request.UneceRequestTestTemplate;
import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.transformation_plan.TransformationPlanUpdateRequest;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class TransformationPlanUpdateRequestTest extends UneceRequestTestTemplate {
    private TransformationPlanUpdateRequest transformationPlanUpdateRequest;

    private List<String> processingStandardList;
    private String traceabilityLevelName;
    private String transparencyLevelName;

    @Override
    public void init() {
        processingStandardList = Arrays.asList("proc1", "proc2");
        traceabilityLevelName = "traceabilityName";
        transparencyLevelName = "transparencyName";

        transformationPlanUpdateRequest = new TransformationPlanUpdateRequest(processingStandardList, traceabilityLevelName, transparencyLevelName);
    }

    @Override
    public void testGetters() {
        assertEquals(processingStandardList, transformationPlanUpdateRequest.getProcessingStandardList());
        assertEquals(traceabilityLevelName, transformationPlanUpdateRequest.getTraceabilityLevelName());
        assertEquals(transparencyLevelName, transformationPlanUpdateRequest.getTransparencyLevelName());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        transformationPlanUpdateRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        transformationPlanUpdateRequest.setTransparencyLevelName(null);
        try {
            transformationPlanUpdateRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
