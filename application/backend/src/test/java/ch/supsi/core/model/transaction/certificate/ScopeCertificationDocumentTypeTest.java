package ch.supsi.core.model.transaction.certificate;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.transaction.certification.ScopeCertificationDocumentType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ScopeCertificationDocumentTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        ScopeCertificationDocumentType scopeCertificationDocumentType = new ScopeCertificationDocumentType();
        assertNull(scopeCertificationDocumentType.getCode());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        ScopeCertificationDocumentType scopeCertificationDocumentType = new ScopeCertificationDocumentType();
        scopeCertificationDocumentType.setCode("123");
        assertEquals("123", scopeCertificationDocumentType.getCode());
    }
}
