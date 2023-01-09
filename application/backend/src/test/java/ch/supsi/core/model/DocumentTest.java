package ch.supsi.core.model;

import ch.supsi.model.Document;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class DocumentTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        Document document = new Document();
        assertNull(document.getId());
        assertNull(document.getFileName());
        assertNull(document.getContent());
        assertNull(document.getContentType());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        Document document = new Document();
        document.setId(1L);
        assertEquals(Long.valueOf(1L), document.getId());
        document.setFileName("docName");
        assertEquals("docName", document.getFileName());
        document.setContentType("application/pdf");
        assertEquals("application/pdf", document.getContentType());
        byte[] content = new byte[]{};
        document.setContent(content);
        assertEquals(content, document.getContent());
    }
}
