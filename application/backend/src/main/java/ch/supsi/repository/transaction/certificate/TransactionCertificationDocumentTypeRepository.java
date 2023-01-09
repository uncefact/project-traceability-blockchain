package ch.supsi.repository.transaction.certificate;

import ch.supsi.model.transaction.certification.TransactionCertificationDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionCertificationDocumentTypeRepository extends JpaRepository<TransactionCertificationDocumentType, String> {
}
