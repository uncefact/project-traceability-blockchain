package ch.supsi.core.model.transaction.certificate;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.ProductCategory;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.model.transaction.certification.CertificationTransactionProductCategory;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class CertificationTransactionProductCategoryTest extends ModelTestTemplate {
    @Override
    public void testConstructor() throws Exception {
        CertificationTransactionProductCategory certificationTransactionProductCategory = new CertificationTransactionProductCategory();
        assertNull(certificationTransactionProductCategory.getId());
        assertNull(certificationTransactionProductCategory.getCertificationTransaction());
        assertNull(certificationTransactionProductCategory.getProductCategory());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        CertificationTransactionProductCategory certificationTransactionProductCategory = new CertificationTransactionProductCategory();
        certificationTransactionProductCategory.setId(1L);
        assertEquals(Long.valueOf(1L), certificationTransactionProductCategory.getId());
        ProductCategory productCategory = new ProductCategory();
        certificationTransactionProductCategory.setProductCategory(productCategory);
        assertEquals(productCategory, certificationTransactionProductCategory.getProductCategory());
        CertificationTransaction certificationTransaction = new CertificationTransaction();
        certificationTransactionProductCategory.setCertificationTransaction(certificationTransaction);
        assertEquals(certificationTransaction, certificationTransactionProductCategory.getCertificationTransaction());
    }
}
