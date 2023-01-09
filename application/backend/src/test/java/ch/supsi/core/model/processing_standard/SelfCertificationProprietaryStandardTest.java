package ch.supsi.core.model.processing_standard;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.SustainabilityCriterion;
import ch.supsi.model.processing_standard.SelfCertificationProprietaryStandard;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class SelfCertificationProprietaryStandardTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        SelfCertificationProprietaryStandard selfCertificationProprietaryStandard = new SelfCertificationProprietaryStandard();
        assertNull(selfCertificationProprietaryStandard.getName());
        assertNull(selfCertificationProprietaryStandard.getLogoPath());
        assertNull(selfCertificationProprietaryStandard.getSiteUrl());
        assertNull(selfCertificationProprietaryStandard.getSustainabilityCriterion());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        SelfCertificationProprietaryStandard selfCertificationProprietaryStandard = new SelfCertificationProprietaryStandard();
        selfCertificationProprietaryStandard.setName("processing standard 1");
        assertEquals("processing standard 1", selfCertificationProprietaryStandard.getName());
        selfCertificationProprietaryStandard.setLogoPath("logos.com/logo.png");
        assertEquals("logos.com/logo.png", selfCertificationProprietaryStandard.getLogoPath());
        selfCertificationProprietaryStandard.setSiteUrl("processingStandard.com");
        assertEquals("processingStandard.com", selfCertificationProprietaryStandard.getSiteUrl());

        SustainabilityCriterion sustainabilityCriterion = new SustainabilityCriterion();
        selfCertificationProprietaryStandard.setSustainabilityCriterion(sustainabilityCriterion);
        assertEquals(sustainabilityCriterion, selfCertificationProprietaryStandard.getSustainabilityCriterion());
    }
}
