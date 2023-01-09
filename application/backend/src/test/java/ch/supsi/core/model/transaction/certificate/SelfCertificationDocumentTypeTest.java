package ch.supsi.core.model.transaction.certificate;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.transaction.certification.SelfCertificationDocumentType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class SelfCertificationDocumentTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        SelfCertificationDocumentType selfCertificationDocumentType = new SelfCertificationDocumentType();
        assertNull(selfCertificationDocumentType.getCode());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        SelfCertificationDocumentType selfCertificationDocumentType = new SelfCertificationDocumentType();
        selfCertificationDocumentType.setCode("123");
        assertEquals("123", selfCertificationDocumentType.getCode());
    }
}
