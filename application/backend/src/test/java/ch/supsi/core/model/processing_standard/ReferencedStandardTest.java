package ch.supsi.core.model.processing_standard;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.SustainabilityCriterion;
import ch.supsi.model.processing_standard.ReferencedStandard;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ReferencedStandardTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        ReferencedStandard referencedStandard = new ReferencedStandard();
        assertNull(referencedStandard.getName());
        assertNull(referencedStandard.getLogoPath());
        assertNull(referencedStandard.getSiteUrl());
        assertNull(referencedStandard.getSustainabilityCriterion());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ReferencedStandard referencedStandard = new ReferencedStandard();
        referencedStandard.setName("Ref standard");
        assertEquals("Ref standard", referencedStandard.getName());
        referencedStandard.setLogoPath("www.logo.ch/logo.png");
        assertEquals("www.logo.ch/logo.png", referencedStandard.getLogoPath());
        referencedStandard.setSiteUrl("www.refstandard.com");
        assertEquals("www.refstandard.com", referencedStandard.getSiteUrl());
        SustainabilityCriterion sustainabilityCriterion = new SustainabilityCriterion();
        referencedStandard.setSustainabilityCriterion(sustainabilityCriterion);
        assertEquals(sustainabilityCriterion, referencedStandard.getSustainabilityCriterion());
    }
}
