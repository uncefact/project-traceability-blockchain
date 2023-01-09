package ch.supsi.core.model.processing_standard;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.SustainabilityCriterion;
import ch.supsi.model.processing_standard.ProcessingStandard;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ProcessingStandardTest extends ModelTestTemplate {

    private SustainabilityCriterion sustainabilityCriterion = new SustainabilityCriterion();

    @Override
    public void testConstructor() throws Exception {
        ProcessingStandard emptyProcessingStandard = new ProcessingStandard();
        assertNull(emptyProcessingStandard.getLogoPath());
        assertNull(emptyProcessingStandard.getName());
        assertNull(emptyProcessingStandard.getSiteUrl());
        assertNull(emptyProcessingStandard.getSustainabilityCriterion());

        ProcessingStandard processingStandard = new ProcessingStandard("test","logo","site", sustainabilityCriterion);
        assertEquals(processingStandard.getName(),"test");
        assertEquals(processingStandard.getLogoPath(),"logo");
        assertEquals(processingStandard.getSiteUrl(),"site");
        assertEquals(processingStandard.getSustainabilityCriterion(), sustainabilityCriterion);
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ProcessingStandard processingStandard = new ProcessingStandard();
        processingStandard.setName("test");
        processingStandard.setLogoPath("logo");
        processingStandard.setSiteUrl("site");
        processingStandard.setSustainabilityCriterion(sustainabilityCriterion);

        assertEquals(processingStandard.getName(),"test");
        assertEquals(processingStandard.getLogoPath(),"logo");
        assertEquals(processingStandard.getSiteUrl(),"site");
        assertEquals(sustainabilityCriterion, processingStandard.getSustainabilityCriterion());
    }
}
