package ch.supsi.core.model.processing_standard;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.SustainabilityCriterion;
import ch.supsi.model.processing_standard.TransactionCertificationReferencedStandard;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class TransactionCertificationReferencedStandardTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        TransactionCertificationReferencedStandard transactionCertificationReferencedStandard = new TransactionCertificationReferencedStandard();
        assertNull(transactionCertificationReferencedStandard.getName());
        assertNull(transactionCertificationReferencedStandard.getLogoPath());
        assertNull(transactionCertificationReferencedStandard.getSiteUrl());
        assertNull(transactionCertificationReferencedStandard.getSustainabilityCriterion());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        TransactionCertificationReferencedStandard transactionCertificationReferencedStandard = new TransactionCertificationReferencedStandard();
        transactionCertificationReferencedStandard.setName("processing standard 1");
        assertEquals("processing standard 1", transactionCertificationReferencedStandard.getName());
        transactionCertificationReferencedStandard.setLogoPath("logos.com/logo.png");
        assertEquals("logos.com/logo.png", transactionCertificationReferencedStandard.getLogoPath());
        transactionCertificationReferencedStandard.setSiteUrl("processingStandard.com");
        assertEquals("processingStandard.com", transactionCertificationReferencedStandard.getSiteUrl());

        SustainabilityCriterion sustainabilityCriterion = new SustainabilityCriterion();
        transactionCertificationReferencedStandard.setSustainabilityCriterion(sustainabilityCriterion);
        assertEquals(sustainabilityCriterion, transactionCertificationReferencedStandard.getSustainabilityCriterion());
    }
}
