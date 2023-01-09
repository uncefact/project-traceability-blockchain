package ch.supsi.core.model.transaction.certificate.assessment_type;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.transaction.certification.assessment_type.ThirdPartyAssessmentType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ThirdPartyAssessmentTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        ThirdPartyAssessmentType thirdPartyAssessmentType = new ThirdPartyAssessmentType();
        assertNull(thirdPartyAssessmentType.getName());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ThirdPartyAssessmentType thirdPartyAssessmentType = new ThirdPartyAssessmentType();
        thirdPartyAssessmentType.setName("Third party assessment type");
        assertEquals("Third party assessment type", thirdPartyAssessmentType.getName());
    }
}
