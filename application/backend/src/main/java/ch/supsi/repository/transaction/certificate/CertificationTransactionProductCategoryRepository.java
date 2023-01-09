package ch.supsi.repository.transaction.certificate;

import ch.supsi.model.transaction.certification.CertificationTransactionProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationTransactionProductCategoryRepository extends JpaRepository<CertificationTransactionProductCategory, Long> {
}
