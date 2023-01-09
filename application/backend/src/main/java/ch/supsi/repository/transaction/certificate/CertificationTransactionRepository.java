package ch.supsi.repository.transaction.certificate;

import ch.supsi.model.company.Company;
import ch.supsi.model.Document;
import ch.supsi.model.transaction.TransactionStatus;
import ch.supsi.model.transaction.certification.CertificationTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface CertificationTransactionRepository extends JpaRepository<CertificationTransaction, Long> {

    CertificationTransaction getById(Long id);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE CertificationTransaction c " +
            "SET c.certificateReferenceNumber = :certificationReferenceNumber, c.status = :transactionStatus, c.consigneeDate = :consigneeDate " +
            "WHERE c.id = :id")
    void updateCertificateFields(Long id, String certificationReferenceNumber, TransactionStatus transactionStatus, Date consigneeDate);

    List<CertificationTransaction> findAllByConsigneeCompanyName(String companyName);

    List<CertificationTransaction> findAllByContractorCompanyName(String companyName);

    @Query("SELECT c FROM CertificationTransaction c WHERE c.document.id = :documentId AND (c.consignee = :company OR c.contractor = :company)")
    List<CertificationTransaction> findAllByDocumentIdAndConsigneeOrContractor(Long documentId, Company company);

    CertificationTransaction findByDocument(Document document);

}
