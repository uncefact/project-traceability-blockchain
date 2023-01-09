package ch.supsi.repository.transaction.certificate;

import ch.supsi.model.transaction.certification.ScopeCertificationDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScopeCertificationDocumentTypeRepository extends JpaRepository<ScopeCertificationDocumentType, String> {
}
