package ch.supsi.repository.transaction.certificate;

import ch.supsi.model.transaction.certification.SelfCertificationDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SelfCertificationDocumentTypeRepository extends JpaRepository<SelfCertificationDocumentType, String> {
}
