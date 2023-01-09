package ch.supsi.core.model;

import ch.supsi.model.DocumentType;

import static org.junit.Assert.*;

public class DocumentTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        DocumentType documentType = new DocumentType();
        assertNull(documentType.getName());
        assertNull(documentType.getCode());
        assertNull(documentType.getDescription());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        DocumentType documentType = new DocumentType();
        documentType.setCode("dnc");
        assertEquals(documentType.getCode(), "dnc");
        documentType.setName("Doc Type");
        assertEquals(documentType.getName(), "Doc Type");
        documentType.setDescription("Doc type description");
        assertEquals("Doc type description", documentType.getDescription());

    }
}
