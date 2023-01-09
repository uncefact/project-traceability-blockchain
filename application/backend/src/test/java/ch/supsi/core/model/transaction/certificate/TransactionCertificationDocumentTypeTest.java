package ch.supsi.core.model.transaction.certificate;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.transaction.certification.TransactionCertificationDocumentType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class TransactionCertificationDocumentTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        TransactionCertificationDocumentType transactionCertificationDocumentType = new TransactionCertificationDocumentType();
        assertNull(transactionCertificationDocumentType.getCode());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        TransactionCertificationDocumentType transactionCertificationDocumentType = new TransactionCertificationDocumentType();
        transactionCertificationDocumentType.setCode("123");
        assertEquals("123", transactionCertificationDocumentType.getCode());
    }
}
