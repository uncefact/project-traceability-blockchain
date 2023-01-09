package ch.supsi.core.model.transaction.certificate;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.ProcessType;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.model.transaction.certification.CertificationTransactionProcessType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class CertificationTransactionProcessTypeTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        CertificationTransactionProcessType certificationTransactionProcessType = new CertificationTransactionProcessType();
        assertNull(certificationTransactionProcessType.getId());
        assertNull(certificationTransactionProcessType.getProcessType());
        assertNull(certificationTransactionProcessType.getCertificationTransaction());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        CertificationTransactionProcessType certificationTransactionProcessType = new CertificationTransactionProcessType();
        certificationTransactionProcessType.setId(1L);
        assertEquals(Long.valueOf(1L), certificationTransactionProcessType.getId());
        ProcessType processType = new ProcessType();
        certificationTransactionProcessType.setProcessType(processType);
        assertEquals(processType, certificationTransactionProcessType.getProcessType());
        CertificationTransaction certificationTransaction = new CertificationTransaction();
        certificationTransactionProcessType.setCertificationTransaction(certificationTransaction);
        assertEquals(certificationTransaction, certificationTransactionProcessType.getCertificationTransaction());
    }
}
