package ch.supsi.repository.processing_standard;

import ch.supsi.model.processing_standard.TransactionCertificationReferencedStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionCertificationReferencedStandardRepository extends JpaRepository<TransactionCertificationReferencedStandard, String> {

    List<TransactionCertificationReferencedStandard> findAllByNameIn(List<String> processingStandardNames);

}
