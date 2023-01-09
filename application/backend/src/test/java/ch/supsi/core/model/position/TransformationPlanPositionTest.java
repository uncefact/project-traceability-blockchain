package ch.supsi.core.model.position;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.Material;
import ch.supsi.model.transformation_plan.TransformationPlan;
import ch.supsi.model.Unit;
import ch.supsi.model.position.TransformationPlanPosition;

import static org.junit.Assert.*;

public class TransformationPlanPositionTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        TransformationPlanPosition position = new TransformationPlanPosition();
        assertNull(position.getId());
        assertNull(position.getQuantity());
        assertNull(position.getUnit());
        assertNull(position.getConsigneeMaterial());
        assertNull(position.getContractorMaterial());
        assertNull(position.getExternalDescription());
        assertNull(position.getWeight());
        assertNull(position.getTransformationPlan());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        TransformationPlanPosition transformationPlanPosition = new TransformationPlanPosition();
        transformationPlanPosition.setId(2L);
        assertEquals(transformationPlanPosition.getId(), Long.valueOf(2L));
        transformationPlanPosition.setQuantity(5.4);
        assertEquals(transformationPlanPosition.getQuantity(), Double.valueOf(5.4));
        Unit unit = new Unit();
        transformationPlanPosition.setUnit(unit);
        assertEquals(transformationPlanPosition.getUnit(), unit);
        Material material = new Material();
        material.setInput(true);
        transformationPlanPosition.setContractorMaterial(material);
        assertEquals(transformationPlanPosition.getContractorMaterial(), material);
        assertTrue(transformationPlanPosition.isIn());
        material.setName("consignee material");
        transformationPlanPosition.setConsigneeMaterial(material);
        assertEquals("consignee material", transformationPlanPosition.getConsigneeMaterial().getName());
        transformationPlanPosition.setExternalDescription("description");
        assertEquals(transformationPlanPosition.getExternalDescription(), "description");
        transformationPlanPosition.setWeight(140.2);
        assertEquals(Double.valueOf(140.2), transformationPlanPosition.getWeight());

        TransformationPlan transformationPlan = new TransformationPlan();
        transformationPlanPosition.setTransformationPlan(transformationPlan);
        assertEquals(transformationPlan, transformationPlanPosition.getTransformationPlan());

    }
}
