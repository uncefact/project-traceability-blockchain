package ch.supsi.core.model.transaction.certificate.assessment_type;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.transaction.certification.assessment_type.AssessmentType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class AssessmentTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        AssessmentType assessmentType = new AssessmentType();
        assertNull(assessmentType.getName());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        AssessmentType assessmentType = new AssessmentType();
        assessmentType.setName("GREEN test");
        assertEquals(assessmentType.getName(), "GREEN test");
    }
}
