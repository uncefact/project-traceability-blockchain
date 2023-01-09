package ch.supsi.core.model.transaction.certificate;

import ch.supsi.core.model.ModelTestTemplate;
import ch.supsi.model.*;
import ch.supsi.model.company.Company;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import ch.supsi.model.transaction.certification.assessment_type.AssessmentType;

import java.util.Date;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class CertificationTransactionTest extends ModelTestTemplate {

    @Override
    public void testConstructor() throws Exception {
        CertificationTransaction certificationTransaction = new CertificationTransaction();
        assertNull(certificationTransaction.getId());
        assertNull(certificationTransaction.getContractorReferenceNumber());
        assertNull(certificationTransaction.getContractor());
        assertNull(certificationTransaction.getConsignee());
        assertNull(certificationTransaction.getDocument());
        assertNull(certificationTransaction.getDocumentType());
        assertNull(certificationTransaction.getAssessmentType());
        assertNull(certificationTransaction.getNotes());
        assertNull(certificationTransaction.getValidFrom());
        assertNull(certificationTransaction.getValidUntil());
        assertNull(certificationTransaction.getContractorDate());
        assertNull(certificationTransaction.getStatus());
        assertNull(certificationTransaction.getContractorEmail());
        assertNull(certificationTransaction.getConsigneeEmail());
        assertNull(certificationTransaction.getCertificateReferenceNumber());
        assertNull(certificationTransaction.getSubject());
        assertNull(certificationTransaction.getMaterial());
    }

    @Override
    public void testGettersAndSetters() throws Exception {
        CertificationTransaction certificationTransaction = new CertificationTransaction();
        certificationTransaction.setId(1L);
        assertEquals(Long.valueOf(1L), certificationTransaction.getId());
        certificationTransaction.setContractorReferenceNumber("1234");
        assertEquals("1234", certificationTransaction.getContractorReferenceNumber());
        Company company = new Company();
        company.setCompanyName("certifier srl");
        certificationTransaction.setContractor(company);
        assertEquals("certifier srl", certificationTransaction.getContractor().getCompanyName());
        certificationTransaction.setContractorEmail("certifier@mail.ch");
        assertEquals("certifier@mail.ch", certificationTransaction.getContractorEmail());
        company.setCompanyName("target company");
        certificationTransaction.setConsignee(company);
        assertEquals("target company", certificationTransaction.getConsignee().getCompanyName());
        certificationTransaction.setConsigneeEmail("target@mail.ch");
        assertEquals("target@mail.ch", certificationTransaction.getConsigneeEmail());
        Document document = new Document();
        certificationTransaction.setDocument(document);
        assertEquals(document, certificationTransaction.getDocument());
        DocumentType documentType = new DocumentType();
        certificationTransaction.setDocumentType(documentType);
        assertEquals(documentType, certificationTransaction.getDocumentType());
        AssessmentType assessmentType = new AssessmentType();
        certificationTransaction.setAssessmentType(assessmentType);
        assertEquals(assessmentType, certificationTransaction.getAssessmentType());
        certificationTransaction.setNotes("notes");
        assertEquals("notes", certificationTransaction.getNotes());
        Date date = new Date();
        certificationTransaction.setValidFrom(date);
        assertEquals(date, certificationTransaction.getValidFrom());
        certificationTransaction.setValidUntil(date);
        assertEquals(date, certificationTransaction.getValidUntil());
        certificationTransaction.setContractorDate(date);
        assertEquals(date, certificationTransaction.getContractorDate());
        certificationTransaction.setStatus(TransactionStatus.ACCEPTED);
        assertEquals(TransactionStatus.ACCEPTED, certificationTransaction.getStatus());

        certificationTransaction.setCertificateReferenceNumber("certRefNum");
        assertEquals("certRefNum", certificationTransaction.getCertificateReferenceNumber());
        Material material = new Material();
        certificationTransaction.setMaterial(material);
        assertEquals(material, certificationTransaction.getMaterial());
    }
}
