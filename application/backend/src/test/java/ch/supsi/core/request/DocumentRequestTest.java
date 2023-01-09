package ch.supsi.core.request;

import ch.supsi.enums.UneceError;
import ch.supsi.exception.UneceException;
import ch.supsi.request.DocumentRequest;

import static org.junit.Assert.assertEquals;

public class DocumentRequestTest extends UneceRequestTestTemplate {

    private DocumentRequest documentRequest;

    @Override
    public void init() {
        documentRequest = new DocumentRequest(
                "docName",
                "docContentType",
                "docContent"
        );
    }

    @Override
    public void testGetters() {
        assertEquals("docName", documentRequest.getName());
        assertEquals("docContentType", documentRequest.getContentType());
        assertEquals("docContent", documentRequest.getContent());
    }

    @Override
    public void testSuccessfulValidation() throws UneceException {
        documentRequest.validate();
    }

    @Override
    public void testFailingValidation() throws UneceException {
        documentRequest.setContent(null);
        try {
            documentRequest.validate();
        }
        catch (UneceException e){
            assertEquals(UneceError.PARAMETER_MISSING, e.getError());
        }
    }
}
