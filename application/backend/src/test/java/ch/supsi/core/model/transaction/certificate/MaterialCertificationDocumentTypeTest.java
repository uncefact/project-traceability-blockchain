package ch.supsi.core.model.transaction.certificate;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.transaction.certification.MaterialCertificationDocumentType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class MaterialCertificationDocumentTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        MaterialCertificationDocumentType materialCertificationDocumentType = new MaterialCertificationDocumentType();
        assertNull(materialCertificationDocumentType.getCode());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        MaterialCertificationDocumentType materialCertificationDocumentType = new MaterialCertificationDocumentType();
        materialCertificationDocumentType.setCode("123");
        assertEquals("123", materialCertificationDocumentType.getCode());
    }
}
