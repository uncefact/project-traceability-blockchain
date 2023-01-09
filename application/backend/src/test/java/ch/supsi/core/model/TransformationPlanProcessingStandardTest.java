package ch.supsi.core.model;

import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.model.transformation_plan.TransformationPlanProcessingStandard;
import ch.supsi.model.processing_standard.ProcessingStandard;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class TransformationPlanProcessingStandardTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        TransformationPlanProcessingStandard transformationPlanProcessingStandard = new TransformationPlanProcessingStandard();
        assertNull(transformationPlanProcessingStandard.getId());
        assertNull(transformationPlanProcessingStandard.getTransformationPlan());
        assertNull(transformationPlanProcessingStandard.getProcessingStandard());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        TransformationPlanProcessingStandard transformationPlanProcessingStandard = new TransformationPlanProcessingStandard();
        transformationPlanProcessingStandard.setId(1L);
        assertEquals(Long.valueOf(1L), transformationPlanProcessingStandard.getId());

        TransformationPlan transformationPlan = new TransformationPlan();
        transformationPlanProcessingStandard.setTransformationPlan(transformationPlan);
        assertEquals(transformationPlan, transformationPlanProcessingStandard.getTransformationPlan());

        ProcessingStandard processingStandard = new ProcessingStandard();
        transformationPlanProcessingStandard.setProcessingStandard(processingStandard);
        assertEquals(processingStandard, transformationPlanProcessingStandard.getProcessingStandard());
    }
}
