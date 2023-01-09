package ch.supsi.repository.transaction.certificate;

import ch.supsi.model.transaction.certification.MaterialCertificationDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialCertificationDocumentTypeRepository extends JpaRepository<MaterialCertificationDocumentType, String> {
}
