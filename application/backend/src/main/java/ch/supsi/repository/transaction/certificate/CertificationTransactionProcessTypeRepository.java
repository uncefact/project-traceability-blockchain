package ch.supsi.repository.transaction.certificate;

import ch.supsi.model.transaction.certification.CertificationTransactionProcessType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationTransactionProcessTypeRepository extends JpaRepository<CertificationTransactionProcessType, Long> {

}