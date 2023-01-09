package ch.supsi.core.model.transaction.certificate.assessment_type;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.transaction.certification.assessment_type.SelfCertificationAssessmentType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class SelfCertificationAssessmentTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        SelfCertificationAssessmentType selfCertificationAssessmentType = new SelfCertificationAssessmentType();
        assertNull(selfCertificationAssessmentType.getName());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        SelfCertificationAssessmentType selfCertificationAssessmentType = new SelfCertificationAssessmentType();
        selfCertificationAssessmentType.setName("assessment type 1");
        assertEquals("assessment type 1", selfCertificationAssessmentType.getName());
    }
}
