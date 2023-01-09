package ch.supsi.core.model;

import ch.supsi.model.ProcessType;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.model.transformation_plan.TransformationPlanProcessType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class TransformationPlanProcessTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        TransformationPlanProcessType transformationPlanProcessType = new TransformationPlanProcessType();
        assertNull(transformationPlanProcessType.getId());
        assertNull(transformationPlanProcessType.getTransformationPlan());
        assertNull(transformationPlanProcessType.getProcessType());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        TransformationPlanProcessType transformationPlanProcessType = new TransformationPlanProcessType();
        transformationPlanProcessType.setId(1L);
        assertEquals(Long.valueOf(1L), transformationPlanProcessType.getId());

        TransformationPlan transformationPlan = new TransformationPlan();
        transformationPlanProcessType.setTransformationPlan(transformationPlan);
        assertEquals(transformationPlan, transformationPlanProcessType.getTransformationPlan());

        ProcessType processType = new ProcessType();
        transformationPlanProcessType.setProcessType(processType);
        assertEquals(processType, transformationPlanProcessType.getProcessType());
    }
}
