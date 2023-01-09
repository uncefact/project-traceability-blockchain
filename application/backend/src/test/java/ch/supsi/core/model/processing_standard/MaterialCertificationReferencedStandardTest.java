package ch.supsi.core.model.processing_standard;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.SustainabilityCriterion;
import ch.supsi.model.processing_standard.MaterialCertificationReferencedStandard;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class MaterialCertificationReferencedStandardTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        MaterialCertificationReferencedStandard materialCertificationReferencedStandard = new MaterialCertificationReferencedStandard();
        assertNull(materialCertificationReferencedStandard.getName());
        assertNull(materialCertificationReferencedStandard.getLogoPath());
        assertNull(materialCertificationReferencedStandard.getSiteUrl());
        assertNull(materialCertificationReferencedStandard.getSustainabilityCriterion());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        MaterialCertificationReferencedStandard materialCertificationReferencedStandard = new MaterialCertificationReferencedStandard();
        materialCertificationReferencedStandard.setName("processing standard 1");
        assertEquals("processing standard 1", materialCertificationReferencedStandard.getName());
        materialCertificationReferencedStandard.setLogoPath("logos.com/logo.png");
        assertEquals("logos.com/logo.png", materialCertificationReferencedStandard.getLogoPath());
        materialCertificationReferencedStandard.setSiteUrl("processingStandard.com");
        assertEquals("processingStandard.com", materialCertificationReferencedStandard.getSiteUrl());

        SustainabilityCriterion sustainabilityCriterion = new SustainabilityCriterion();
        materialCertificationReferencedStandard.setSustainabilityCriterion(sustainabilityCriterion);
        assertEquals(sustainabilityCriterion, materialCertificationReferencedStandard.getSustainabilityCriterion());
    }
}
